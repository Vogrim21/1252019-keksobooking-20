'use strict';
(function () {
  var pinsContainer = document.querySelector('.map__pins');

  window.PinsMap = {
    clear: clearMap,
    findNoticePins: findNoticePins,
    placePins: placePins
  };

  function placePins(pins) {
    appendElementsOptimized(pinsContainer, pins);
  }

  function clearMap() {
    var pins = findNoticePins();
    pins.forEach(removeDOMElement);
  }

  function removeDOMElement(element) {
    element.remove();
  }

  function appendElementsOptimized(container, elements) {
    var fragment = document.createDocumentFragment();
    elements.forEach(function (element) {
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }

  function findNoticePins() {
    var pins = document.querySelectorAll('.map__pin');
    return Array.prototype.filter.call(pins, function (pin) {
      return !pin.classList.contains('map__pin--main');
    });
  }

})();
