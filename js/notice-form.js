'use strict';
(function () {
  var SUBMIT_EVENT_TYPE = 'submitform';
  var SUBMIT_ERROR_EVENT_TYPE = 'submitform-error';
  var DISABLED_CLASSNAME = 'ad-form--disabled';

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MIN_NAME_LENGTH = 30;
  var MAX_NAME_LENGTH = 100;
  var PRICE_MAX = 1000000;
  var NOT_FOR_GUESTS_OPTION_VALUE = '0';
  var NOT_FOR_GUESTS_ROOMS_NUMBER = 100;
  var prices = {
    bungalo: {
      min: 0,
      max: PRICE_MAX
    },
    flat: {
      min: 1000,
      max: PRICE_MAX
    },
    house: {
      min: 5000,
      max: PRICE_MAX
    },
    palace: {
      min: 10000,
      max: PRICE_MAX
    }
  };

  var avatarInitialImageSrc;

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsetsArr = Array.from(document.querySelectorAll('.ad-form fieldset'));
  var avatarInput = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var typeInput = document.querySelector('#type');
  var titleInput = document.querySelector('#title');
  var priceInput = document.querySelector('#price');
  var capacityInput = document.querySelector('#capacity');
  var roomsInput = document.querySelector('#room_number');
  var imagesInput = document.querySelector('#images');
  var housingPreviewContainer = document.querySelector('.ad-form__photo');
  var addressInput = document.querySelector('#address');

  initAvatarInput();
  initTitleInput();
  initTypeInput();
  initPriceInput();
  initImagesInput();
  initTimeInputs();
  initRoomsInput();
  setupCapacityInput(Number(roomsInput.value));
  avatarInitialImageSrc = avatarPreview.src;

  adForm.addEventListener('submit', function (evt) {
    var isFormValid = adForm.checkValidity();
    if (!isFormValid) {
      return;
    }

    evt.preventDefault();
    var formData = new FormData(adForm);
    window.Network.send(formData, function (err) {
      if (err) {
        var errEvent = new CustomEvent(SUBMIT_ERROR_EVENT_TYPE, {
          detail: err
        });
        document.dispatchEvent(errEvent);
      } else {
        var event = new Event(SUBMIT_EVENT_TYPE);
        document.dispatchEvent(event);
      }
    });
  });

  window.NoticeForm = {
    SUBMIT_EVENT_TYPE: SUBMIT_EVENT_TYPE,
    SUBMIT_ERROR_EVENT_TYPE: SUBMIT_ERROR_EVENT_TYPE,
    enable: enable,
    disable: disable,
    reset: reset,
    setAddress: setAddress
  };

  function enable() {
    adForm.classList.remove(DISABLED_CLASSNAME);
    adFormFieldsetsArr.forEach(enableElement);
  }

  function disable() {
    adForm.classList.add(DISABLED_CLASSNAME);
    adFormFieldsetsArr.forEach(disableElement);
  }

  function setAddress(value) {
    addressInput.value = value;
  }

  function reset() {
    adForm.reset();
    capacityInput.value = 1;
    avatarPreview.src = avatarInitialImageSrc;
    housingPreviewContainer.innerHTML = '';
  }

  function disableElement(element) {
    element.disabled = true;
  }

  function enableElement(element) {
    element.disabled = false;
  }

  function initRoomsInput() {
    roomsInput.addEventListener('change', function (evt) {
      var target = evt.target;
      var roomsNumber = Number(target.value);
      setupCapacityInput(roomsNumber);
    });
  }

  function initTypeInput() {
    typeInput.addEventListener('change', function (evt) {
      var target = evt.target;
      var type = target.value;
      setPriceInputBoundsAccordingPropType(type);
    });
  }

  function initImagesInput() {
    imagesInput.addEventListener('change', function (evt) {
      var file = evt.target.files[0];
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var housingImageReader = new FileReader();
        housingImageReader.addEventListener('load', function () {
          housingPreviewContainer.innerHTML = '<img src="" alt="" width="70" height="70">';
          var housingPreview = document.querySelector('.ad-form__photo img');
          housingPreview.src = housingImageReader.result;
        });
        housingImageReader.readAsDataURL(file);
      }
    });
  }

  function initAvatarInput() {
    avatarInput.addEventListener('invalid', function (evt) {
      var target = evt.target;
      var validity = target.validity;

      if (validity.valueMissing) {
        target.setCustomValidity('Загрузите вашу фотографию');
      } else {
        target.setCustomValidity('');
      }
    });

    avatarInput.addEventListener('change', function (evt) {
      var file = evt.target.files[0];
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var avatarReader = new FileReader();
        avatarReader.addEventListener('load', function () {
          avatarPreview.src = avatarReader.result;
        });

        avatarReader.readAsDataURL(file);
      }
    });
  }

  function setupCapacityInput(roomsNumber) {
    var capacityOptions = Array.from(capacityInput.children);
    if (roomsNumber === NOT_FOR_GUESTS_ROOMS_NUMBER) {
      capacityOptions.forEach(function (option) {
        if (option.value === NOT_FOR_GUESTS_OPTION_VALUE) {
          option.disabled = false;
        } else {
          option.disabled = true;
          option.selected = false;
        }
      });
      capacityInput.value = NOT_FOR_GUESTS_OPTION_VALUE;
      return;
    }

    var capacityOptionMaxNumber = 0;
    capacityOptions.forEach(function (option) {
      var capacityNumber = Number(option.value);
      if (option.value === NOT_FOR_GUESTS_OPTION_VALUE) {
        option.disabled = true;
        return;
      }
      if (roomsNumber >= capacityNumber &&
          option.value !== NOT_FOR_GUESTS_OPTION_VALUE) {
        option.disabled = false;
        capacityOptionMaxNumber = Math.max(capacityOptionMaxNumber, capacityNumber);
      } else {
        option.disabled = true;
        option.selected = false;
      }
    });
    capacityInput.value = capacityOptionMaxNumber;
  }

  function initTitleInput() {
    titleInput.addEventListener('invalid', function () {
      if (titleInput.validity.valueMissing) {
        titleInput.setCustomValidity('Обязательное поле');
      } else {
        titleInput.setCustomValidity('');
      }
    });

    titleInput.addEventListener('input', function () {
      var valueLength = titleInput.value.length;

      if (valueLength < MIN_NAME_LENGTH) {
        titleInput.setCustomValidity('Ещё ' + (MIN_NAME_LENGTH - valueLength) + ' симв.');
      } else if (valueLength > MAX_NAME_LENGTH) {
        titleInput.setCustomValidity('Удалите лишние ' + (valueLength - MAX_NAME_LENGTH) + ' симв.');
      } else {
        titleInput.setCustomValidity('');
      }
    });
  }

  function initPriceInput() {
    setPriceInputBoundsAccordingPropType(typeInput.value);
    priceInput.addEventListener('invalid', function (evt) {
      var target = evt.target;
      var validity = evt.target.validity;

      if (validity.valueMissing) {
        target.setCustomValidity('Обязательное поле');
      } else if (validity.rangeOverflow || validity.rangeUnderflow) {
        target.setCustomValidity('Значение должно быть числом в пределах ' + target.min + '–' + target.max);
      } else {
        target.setCustomValidity('');
      }
    });
  }

  function initTimeInputs() {
    var timeinInput = document.querySelector('#timein');
    var timeoutInput = document.querySelector('#timeout');

    timeinInput.addEventListener('change', function () {
      timeoutInput.value = timeinInput.value;
    });

    timeoutInput.addEventListener('change', function () {
      timeinInput.value = timeoutInput.value;
    });
  }

  function setPriceInputBoundsAccordingPropType(type) {
    var price = prices[type];

    if (price) {
      setPriceInputBounds(price.min, price.max);
    } else {
      throw new Error('Unrecognized type');
    }
  }

  function setPriceInputBounds(min, max) {
    priceInput.min = min;
    priceInput.max = max;
    priceInput.placeholder = min;
  }

})();
