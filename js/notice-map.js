'use strict';
(function () {
  var PinsMap = window.PinsMap;
  var FiltersBar = window.FiltersBar;
  var Pin = window.Pin;

  var DISABLED_CLASSNAME = 'map--faded';

  var targetElementForCard = document.querySelector('.map__filters-container');
  var map = document.querySelector('.map');

  window.NoticeMap = {
    enable: enable,
    disable: disable,
    clear: clear,
    placeNotices: placeNotices,
    reset: reset
  };

  function placeNotices(notices) {
    if (notices.length === 0) {
      return;
    }

    FiltersBar.enable();

    var pins = notices.map(function (dto) {
      var pin = Pin.create(dto);
      pin.addEventListener('click', function () {
        var oldCard = document.querySelector('.map .map__card.popup');
        if (oldCard) {
          oldCard.remove();
        }

        var notice = findNotice(pin.id);
        var newCard = window.createCard(notice, cardCloseHandler);
        targetElementForCard.insertAdjacentElement('beforebegin', newCard);

        Pin.activate(pin);
        var noticePins = PinsMap.findNoticePins();
        noticePins.forEach(deactivateInactivePinCallback);
      });
      return pin;

      function deactivateInactivePinCallback(item) {
        if (item !== pin && Pin.checkActive(item)) {
          Pin.deactivate(item);
        }
      }

      function findNotice(id) {
        for (var i = 0; i < notices.length; i++) {
          var notice = notices[i];
          if (notice.id === id) {
            return notice;
          }
        }
        return null;
      }

      function cardCloseHandler() {
        Pin.deactivate(pin);
      }
    });

    PinsMap.placePins(pins);
  }

  function clear() {
    PinsMap.clear();
    var card = map.querySelector('.map__card.popup');
    if (card) {
      card.remove();
    }
  }

  function reset() {
    clear();
    FiltersBar.reset();
  }

  function enable() {
    map.classList.remove(DISABLED_CLASSNAME);
  }

  function disable() {
    FiltersBar.disable();
    map.classList.add(DISABLED_CLASSNAME);
  }
})();
