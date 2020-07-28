'use strict';

(function () {
  var NoticeMap = window.NoticeMap;
  var NoticeForm = window.NoticeForm;
  var FiltersBar = window.FiltersBar;
  var Network = window.Network;

  var MAX_PINS_ON_MAP = 5;
  var NAV_PIN_HEIGHT = 87;
  var NOT_FOR_GUESTS_ROOMS_NUMBER = 100;
  var NOT_FOR_GUESTS_INPUT_VALUE = '0';

  var navPinInitialCoordinates = null;
  var notices = [];

  init();

  function appendId(notice) {
    notice.id = window.utils.generateId();
  }

  function getFilteredNotices(noticesArr) {
    return noticesArr
      .filter(filterByOffersExists)
      .filter(filterByType)
      .filter(filterByPrice)
      .filter(filterByRoomsNumber)
      .filter(filterByGuests)
      .filter(filterByFeatures)
      .slice(0, MAX_PINS_ON_MAP);

    function filterByOffersExists(notice) {
      return notice.offer !== undefined && notice.offer !== null;
    }

    function filterByFeatures(notice) {
      var features = notice.offer.features;
      var requiredFeatures = FiltersBar.getFeatures();
      return requiredFeatures.every(function (feature) {
        return features.indexOf(feature) !== -1;
      });
    }

    function filterByGuests(notice) {
      var filterGuestsValue = FiltersBar.getGuests();
      if (filterGuestsValue === 'any') {
        return true;
      }
      if (filterGuestsValue === NOT_FOR_GUESTS_INPUT_VALUE) {
        return notice.offer.rooms === NOT_FOR_GUESTS_ROOMS_NUMBER;
      }
      var maxGuestsNumber = parseInt(filterGuestsValue, 10);
      return maxGuestsNumber <= notice.offer.guests;
    }

    function filterByRoomsNumber(notice) {
      var filterRoomsValue = FiltersBar.getRooms();
      if (filterRoomsValue === 'any') {
        return true;
      }
      var roomsNumber = parseInt(filterRoomsValue, 10);
      return notice.offer.rooms === roomsNumber;
    }

    function filterByPrice(notice) {
      var priceRange = FiltersBar.getPriceRange();
      var housePrice = notice.offer.price;
      return (housePrice >= priceRange.min) && (housePrice < priceRange.max);
    }

    function filterByType(notice) {
      var types = FiltersBar.getHousingType();
      return types.indexOf(notice.offer.type) !== -1;
    }
  }

  function filterNoticesAndReplacePins(noticesArr) {
    var filteredNotices = getFilteredNotices(noticesArr);
    replacePins(filteredNotices);
  }

  function replacePins(newNotices) {
    NoticeMap.clear();
    NoticeMap.placeNotices(newNotices);
  }

  /**
   * Вычисляет координаты указателя навигационной метки
   * @param {HTMLElement} navPin метка
   * @return {*} объект с целочисленными свойствами width, height
   */
  function calculateNavPinPointerCoordinate(navPin) {
    return {
      x: Math.round(navPin.offsetLeft + navPin.offsetWidth / 2),
      y: navPin.offsetTop + NAV_PIN_HEIGHT
    };
  }

  /**
   * Вычисляет координаты центра метки
   * @param {HTMLElement} pin метка
   * @return {*} объект с целочисленными свойствами width, height
   */
  function calculateRoundNavPinCoordinate(pin) {
    var offset = Math.round(pin.offsetWidth / 2);

    return {
      x: pin.offsetLeft + offset,
      y: pin.offsetTop + offset
    };
  }

  function init() {
    var ENTER_KEY_CODE = 'Enter';
    var ESCAPE_KEY_CODE = 'Escape';
    var MOUSE_MAIN_BUTTON_CODE = 0;

    var main = document.querySelector('main');
    var navPin = document.querySelector('.map__pin--main');
    var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');

    navPinInitialCoordinates = {
      x: navPin.offsetLeft,
      y: navPin.offsetTop
    };

    deactivatePage();
    initNavPinDrag();

    var filterNoticesAndReplacePinsDebounce = window.utils.debounce(filterNoticesAndReplacePins);
    document.addEventListener(FiltersBar.CHANGE_EVENT_TYPE, function () {
      filterNoticesAndReplacePinsDebounce(notices);
    });

    document.addEventListener(NoticeForm.SUBMIT_EVENT_TYPE, function () {
      var success = successTemplate.cloneNode(true);
      main.appendChild(success);

      window.addEventListener('keydown', windowKeyDownHandler);

      success.addEventListener('mousedown', function () {
        dismiss();
      });

      function windowKeyDownHandler(evt) {
        if (evt.code === ESCAPE_KEY_CODE) {
          dismiss();
        }
      }

      function dismiss() {
        window.removeEventListener('keydown', windowKeyDownHandler);
        success.remove();
        deactivatePage();
      }
    });

    document.addEventListener(NoticeForm.SUBMIT_ERROR_EVENT_TYPE, function (evt) {
      var errorContainer = errorTemplate.cloneNode(true);
      var messageElement = errorContainer.querySelector('.error__message');
      messageElement.textContent = evt.detail;
      var closeBtn = errorContainer.querySelector('.error__button');
      main.appendChild(errorContainer);

      window.addEventListener('keydown', windowKeyDownHandler);

      errorContainer.addEventListener('mousedown', function () {
        dismiss();
      });

      closeBtn.addEventListener('click', function () {
        dismiss();
      });

      function windowKeyDownHandler(evt1) {
        if (evt1.code === ESCAPE_KEY_CODE) {
          dismiss();
        }
      }

      function dismiss() {
        window.removeEventListener('keydown', windowKeyDownHandler);
        errorContainer.remove();
      }
    });

    var resetBtn = document.querySelector('.ad-form__reset');
    resetBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      deactivatePage();
    });

    function navPinMouseDownHandler(evt) {
      if (evt.button === MOUSE_MAIN_BUTTON_CODE) {
        activatePage();
        removeNavPinListeners();
      }
    }

    function initNavPinDrag() {
      var Y_MIN = 130;
      var Y_MAX = 630;
      var X_MIN = 0;
      var X_MAX = document.querySelector('.map').clientWidth;

      var navPinWidth = navPin.offsetWidth;
      var navPinXMin = X_MIN - navPinWidth / 2;
      var navPinXMax = X_MAX - navPinWidth / 2;
      var navPinYMin = Y_MIN - NAV_PIN_HEIGHT;
      var navPinYMax = Y_MAX - NAV_PIN_HEIGHT;

      navPin.addEventListener('mousedown', function () {
        window.addEventListener('mousemove', windowMouseMoveHandler);
        window.addEventListener('mouseup', windowMouseUpHandler);
      });

      // Слушатель навешивается на window, а не на элемент, потому что при быстром движении мыши
      // захват элемента может сорваться. Это происходит из-за того, что перемещение элемента не успевает
      // за перемещением мыши, в результате мышь оказывается за пределами перемещаемого элемента и все ломается.
      function windowMouseUpHandler() {
        window.removeEventListener('mousemove', windowMouseMoveHandler);
        window.removeEventListener('mouseup', windowMouseUpHandler);
      }

      function windowMouseMoveHandler(evt) {
        var x = navPin.offsetLeft + evt.movementX;
        var y = navPin.offsetTop + evt.movementY;

        if (x < navPinXMin) {
          x = navPinXMin;
        }
        if (x > navPinXMax) {
          x = navPinXMax;
        }
        if (y < navPinYMin) {
          y = navPinYMin;
        }
        if (y > navPinYMax) {
          y = navPinYMax;
        }

        navPin.style.left = x + 'px';
        navPin.style.top = y + 'px';

        var navPinPointerCoordinate = calculateNavPinPointerCoordinate(navPin);
        NoticeForm.setAddress(navPinPointerCoordinate.x + ', ' + navPinPointerCoordinate.y);
      }
    }

    function navPinKeyDownHandler(evt) {
      if (evt.code === ENTER_KEY_CODE) {
        activatePage();
        removeNavPinListeners();
      }
    }

    function activatePage() {
      NoticeMap.enable();
      NoticeForm.enable();
      var navPinPointerCoordinate = calculateNavPinPointerCoordinate(navPin);
      NoticeForm.setAddress(navPinPointerCoordinate.x + ', ' + navPinPointerCoordinate.y);
      Network.load(function (err, noticesArr) {
        if (err) {
          // стоило бы сообщить пользователю об ошибке, но в ТЗ не указано как обрабатывать такую ошибку
        } else {
          notices = noticesArr;
          if (notices.length !== 0) {
            notices.forEach(appendId);
            var filteredNotices = getFilteredNotices(notices);
            NoticeMap.placeNotices(filteredNotices);
          }
        }
      });
    }

    function deactivatePage() {
      notices = [];
      NoticeMap.disable();
      NoticeMap.reset();
      NoticeForm.disable();
      NoticeForm.reset();
      navPin.addEventListener('mousedown', navPinMouseDownHandler);
      navPin.addEventListener('keydown', navPinKeyDownHandler);
      navPin.style.left = navPinInitialCoordinates.x + 'px';
      navPin.style.top = navPinInitialCoordinates.y + 'px';
      var navPinPointerCoordinate = calculateRoundNavPinCoordinate(navPin);
      NoticeForm.setAddress(navPinPointerCoordinate.x + ', ' + navPinPointerCoordinate.y);
    }

    function removeNavPinListeners() {
      navPin.removeEventListener('mousedown', navPinMouseDownHandler);
      navPin.removeEventListener('keydown', navPinKeyDownHandler);
    }
  }

})();
