'use strict';
(function () {
  var ESCAPE_KEY_CODE = 'Escape';

  var propertyType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var template = document.querySelector('#card')
      .content
      .querySelector('.map__card.popup');

  window.createCard = function createCard(dto, onclose) {
    var card = template.cloneNode(true);
    var offer = dto.offer;

    card.querySelector('.popup__avatar').setAttribute('src', dto.author.avatar);
    card.querySelector('.popup__title').textContent = offer.title;
    card.querySelector('.popup__text--address').textContent = offer.address;
    card.querySelector('.popup__text--price').innerHTML = offer.price + ' &#x20bd;<span>/ночь</span>';
    card.querySelector('.popup__type').textContent = propertyType[offer.type];
    card.querySelector('.popup__text--capacity').textContent =
      offer.rooms + ' ' + resolveDeclensionRoomsWord(offer.rooms) +
      ' для ' + offer.guests + ' ' + resolveDeclensionGuestWord(offer.guests);
    card.querySelector('.popup__text--time').textContent =
      'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;

    var featuresContainer = card.querySelector('.popup__features');
    if (offer.features && offer.features.length > 0) {
      resolveFeatures(featuresContainer, offer.features);
    } else {
      featuresContainer.classList.add('hidden');
    }

    if (offer.description) {
      card.querySelector('.popup__description').textContent = offer.description;
    }

    var photosContainer = card.querySelector('.popup__photos');
    if (offer.photos && offer.photos.length > 0) {
      resolvePhotos(photosContainer, offer.photos);
    } else {
      photosContainer.classList.add('hidden');
    }

    card.querySelector('.popup__close').addEventListener('click', function () {
      removeCard();
    });

    document.addEventListener('keydown', documentEscapeKeydownHandler);

    return card;

    function documentEscapeKeydownHandler(evt) {
      if (evt.key === ESCAPE_KEY_CODE) {
        evt.preventDefault();
        removeCard();
      }
    }

    function removeCard() {
      document.removeEventListener('keydown', documentEscapeKeydownHandler);
      if (onclose) {
        onclose();
      }
      card.remove();
    }

    function resolveFeatures(container, features) {
      var testKeywordsExistence = createTestKeywordsExistenceFunc(features);
      var notPresentFeatureElements = Array.from(container.children).filter(filterNotMathedFeatureElements);
      notPresentFeatureElements.forEach(function (element) {
        container.removeChild(element);
      });

      function filterNotMathedFeatureElements(element) {
        var className = element.className;
        return !testKeywordsExistence(className);
      }

      function createTestKeywordsExistenceFunc(keywords) {
        var reString = keywords.join('|');
        var re = new RegExp(reString);
        return function testKeywordsExistenceFunc(string) {
          return re.test(string);
        };
      }
    }

    function resolvePhotos(container, photoUrls) {
      var photoListItemSample = container.querySelector('.popup__photo');
      container.removeChild(photoListItemSample);
      var photoListItems = photoUrls.map(function (url) {
        var photoListItemElement = photoListItemSample.cloneNode(true);
        photoListItemElement.setAttribute('src', url);
        return photoListItemElement;
      });

      photoListItems.forEach(function (element) {
        container.appendChild(element);
      });
    }

    function resolveDeclensionRoomsWord(number) {
      if (number >= 10 && number <= 20) {
        return 'комнат';
      }

      var remainder = number % 10;
      if (remainder === 1) {
        return 'комната';
      } else if (remainder >= 2 && remainder <= 4) {
        return 'комнаты';
      }

      return 'комнат';
    }

    function resolveDeclensionGuestWord(number) {
      return (number % 10 === 1) ? 'гостя' : 'гостей';
    }
  };
})();
