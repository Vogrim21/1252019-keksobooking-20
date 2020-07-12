'use strict';
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
map.classList.remove('map--faded');

var COUNT = 8;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 70;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 3;
var MIN_GUESTS = 1;
var MAX_GUESTS = 3;
var TYPE_OF_ROOMS = ['palace', 'flat', 'house', 'bungalo'];
var TIME = [12 + ':00', 13 + ':00', 14 + ':00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_COORDS_Y = 130;
var MAX_COORDS_Y = 630;
var MIN_COORDS_X = 50;
var MAX_COORDS_X = document.querySelector('.map').offsetWidth - 50;

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

var generatePin = function (pin) {
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.querySelector('.map__pin').cloneNode(true);
  var pinUserAvatar = pinElement.querySelector('img');

  var pinLocationX = (pin.location.x - PIN_WIDTH) + 'px';
  var pinLocationY = pin.location.y - (PIN_HEIGHT / 2) + 'px';

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

generatePins(generateAds(COUNT));
