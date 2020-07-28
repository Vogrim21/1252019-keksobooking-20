'use strict';
(function () {
  var ACTIVE_PIN_CLASSNAME = 'map__pin--active';
  var template = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  window.Pin = {
    create: create,
    checkActive: checkActive,
    activate: activate,
    deactivate: deactivate,
  };

  function create(dto) {
    var pin = template.cloneNode(true);

    pin.setAttribute('id', dto.id);
    var pinSize = getElementSize(pin);
    var pinLeft = Math.round(dto.location.x - pinSize.width / 2);
    var pinTop = dto.location.y - pinSize.height;
    pin.style.left = pinLeft + 'px';
    pin.style.top = pinTop + 'px';

    var img = pin.querySelector('img');
    img.setAttribute('src', dto.author.avatar);
    img.setAttribute('alt', dto.offer.title);

    return pin;
  }

  function checkActive(pin) {
    return pin.classList.contains(ACTIVE_PIN_CLASSNAME);
  }

  function activate(pin) {
    pin.classList.add(ACTIVE_PIN_CLASSNAME);
  }

  function deactivate(pin) {
    pin.classList.remove(ACTIVE_PIN_CLASSNAME);
  }

  function getElementSize(element) {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

})();
