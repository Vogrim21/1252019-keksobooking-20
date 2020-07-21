'use strict';
var COUNT = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 3;
var MIN_GUESTS = 1;
var MAX_GUESTS = 3;
var TYPE_OF_ROOMS = ['palace', 'flat', 'house', 'bungalo'];
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_COORDS_Y = 130;
var MAX_COORDS_Y = 630;
var MIN_COORDS_X = 1;
var MAX_COORDS_X = document.querySelector('.map').offsetWidth;

var propertyType = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

var template = document.querySelector('#card')
    .content
    .querySelector('.map__card.popup');

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
map.classList.remove('map--faded');

var arrayRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var arrayRandomElement = function (array) {
  var rand = Math.floor(Math.random() * array.length);
  return array[rand];
};

var arrayRandomLength = function (array) {
  var clone = array.slice();
  clone.length = arrayRandomNumber(1, array.length - 1);
  return clone;
};

var generateAds = function (count) {
  var data = [];
  for (var i = 1; i <= count; i++) {
    var locationX = arrayRandomNumber(MIN_COORDS_X, MAX_COORDS_X);
    var locationY = arrayRandomNumber(MIN_COORDS_Y, MAX_COORDS_Y);

    data.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png',
      },
      offer: {
        title: 'Some title',
        address: locationX + ', ' + locationY,
        price: arrayRandomNumber(MIN_PRICE, MAX_PRICE),
        type: arrayRandomElement(TYPE_OF_ROOMS),
        rooms: arrayRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: arrayRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: arrayRandomElement(TIME),
        checkout: arrayRandomElement(TIME),
        features: arrayRandomLength(FEATURES),
        description: 'Some description',
        photos: arrayRandomLength(PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY,
      }
    });
  }
  return data;
};

var offers = generateAds(COUNT);

var generatePin = function (pin) {
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.querySelector('.map__pin').cloneNode(true);
  var pinUserAvatar = pinElement.querySelector('img');
  var pinLocationX = pin.location.x - PIN_WIDTH + 'px';
  var pinLocationY = pin.location.y + 'px';

  pinLocationX = pin.location.x - PIN_WIDTH / 2 + 'px';
  pinLocationY = pin.location.y - PIN_HEIGHT + 'px';

  pinUserAvatar.src = pin.author.avatar;
  pinElement.style.left = pinLocationX;
  pinElement.style.top = pinLocationY;

  return pinElement;
};

var generatePins = function (array) {
  var fragment = document.createDocumentFragment();
  array.forEach(function (el) {
    fragment.appendChild(generatePin(el));
  });
  mapPins.appendChild(fragment);
};

var resolvePhotos = function (container, photoUrls) {
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
};

var resolveFeatures = function (container, features) {
  var createTestKeywordsExistenceFunc = function (keywords) {
    var reString = keywords.join('|');
    var re = new RegExp(reString);
    return function testKeywordsExistenceFunc(string) {
      return re.test(string);
    };
  };
  var testKeywordsExistence = createTestKeywordsExistenceFunc(features);
  var filterNotMathedFeatureElements = function (element) {
    var className = element.className;
    return !testKeywordsExistence(className);
  };
  var notPresentFeatureElements = Array.from(container.children).filter(filterNotMathedFeatureElements);
  notPresentFeatureElements.forEach(function (element) {
    container.removeChild(element);
  });
};

var createCard = function (add) {
  var card = template.cloneNode(true);
  var offer = add.offer;

  card.querySelector('.popup__avatar').setAttribute('src', add.author.avatar);
  card.querySelector('.popup__title').textContent = offer.title;
  card.querySelector('.popup__text--address').textContent = offer.address;
  card.querySelector('.popup__text--price').innerHTML = offer.price + ' &#x20bd;<span>/ночь</span>';
  card.querySelector('.popup__type').textContent = propertyType[offer.type];
  card.querySelector('.popup__text--capacity').textContent =
    offer.rooms + ' ' + 'комнат' +
    ' для ' + offer.guests + ' ' + 'гостей';
  card.querySelector('.popup__text--time').textContent =
    'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;

  var featuresContainer = card.querySelector('.popup__features');
  if (offer.features && offer.features.length > 0) {
    resolveFeatures(featuresContainer, offer.features);
  } else {
    featuresContainer.hidden = true;
  }

  if (offer.description) {
    card.querySelector('.popup__description').textContent = offer.description;
  }

  var photosContainer = card.querySelector('.popup__photos');
  if (offer.photos && offer.photos.length > 0) {
    resolvePhotos(photosContainer, offer.photos);
  } else {
    photosContainer.hidden = true;
  }

  return card;
};

generatePins(offers);
map.appendChild(createCard(offers[0]));
