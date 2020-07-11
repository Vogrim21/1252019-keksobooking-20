'use strict';
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
map.classList.remove('map--faded');

var dataHousing = {
  PIN_WIDTH: 40,
  PIN_HEIGHT: 70,

  MIN_PRICE: 1000,
  MAX_PRICE: 1000000,

  MIN_ROOMS: 1,
  MAX_ROOMS: 3,

  MIN_GUESTS: 1,
  MAX_GUESTS: 3,

  TYPE_OF_ROOMS: ['palace', 'flat', 'house', 'bungalo'],
  TIME: [12, 13, 14],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],

  MIN_PHOTOS: 1,
  MAX_PHOTOS: 3,

  MIN_COORDS_Y: 130,
  MAX_COORDS_Y: 650,
  MIN_COORDS_X: 1,
  MAX_COORDS_X: document.querySelector('.map').offsetWidth
};

var arrayRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var arrayRandomElement = function (massiv) {
  var rand = Math.floor(Math.random() * massiv.length);
  return massiv[rand];
};

var arrayRandomLength = function (array) {
  var clone = array.slice();
  clone.length = arrayRandomNumber(1, array.length - 1);
  return clone;
};

var generatePhotos = function () {
  var photos = [];

  for (var i = 1; i < arrayRandomNumber(dataHousing.MIN_PHOTOS, dataHousing.MAX_PHOTOS) + 1; i++) {
    var photo = '' + i + '.png';
    photos.push(photo);
  }
  return photos;
};

var generateData = function (count) {
  var data = [];
  for (var i = 1; i <= count; i++) {
    var locationX = arrayRandomNumber(dataHousing.MIN_COORDS_X, dataHousing.MAX_COORDS_X);
    var locationY = arrayRandomNumber(dataHousing.MIN_COORDS_Y, dataHousing.MAX_COORDS_Y);

    data.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png',
      },
      offer: {
        title: 'Some title',
        address: locationX + ', ' + locationY,
        price: arrayRandomNumber(dataHousing.MIN_PRICE, dataHousing.MAX_PRICE),
        type: arrayRandomElement(dataHousing.TYPE_OF_ROOMS),
        rooms: arrayRandomNumber(dataHousing.MIN_ROOMS, dataHousing.MAX_ROOMS),
        guests: arrayRandomNumber(dataHousing.MIN_GUESTS, dataHousing.MAX_GUESTS),
        checkin: arrayRandomElement(dataHousing.TIME) + ':00',
        checkout: arrayRandomElement(dataHousing.TIME) + ':00',
        features: arrayRandomLength(dataHousing.FEATURES),
        description: 'Some description',
        photos: generatePhotos(),
      },
      location: {
        x: locationX,
        y: locationY,
      }
    });
  }
  return data;
};

var generatePin = function (pin) {
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.querySelector('.map__pin').cloneNode(true);
  var pinUserAvatar = pinElement.querySelector('img');

  var pinLocationX = (pin.location.x - dataHousing.PIN_WIDTH) + 'px';
  var pinLocationY = pin.location.y - (dataHousing.PIN_HEIGHT / 2) + 'px';

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

generatePins(generateData(8));
