'use strict';
(function () {
  var CHANGE_EVENT_TYPE = 'filters-change';
  var APARTMENT_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var priceRanges = {
    any: {
      min: 0,
      max: Number.POSITIVE_INFINITY
    },
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: Number.POSITIVE_INFINITY
    },
  };

  var form = document.querySelector('.map__filters');
  var mapFiltersArr = Array.from(document.querySelector('.map__filters').children);
  var filterTypeInput = document.querySelector('#housing-type');
  var filterPriceInput = document.querySelector('#housing-price');
  var filterRoomsInput = document.querySelector('#housing-rooms');
  var filterGuestsInput = document.querySelector('#housing-guests');
  var filterFeaturesInputs = Array.from(document.querySelectorAll('#housing-features input'));

  [filterTypeInput, filterPriceInput, filterRoomsInput, filterGuestsInput]
    .concat(filterFeaturesInputs)
    .forEach(function (input) {
      input.addEventListener('change', fireChangeEvent);
    });

  window.FiltersBar = {
    CHANGE_EVENT_TYPE: CHANGE_EVENT_TYPE,
    enable: enable,
    disable: disable,
    getHousingType: getHousingType,
    getPriceRange: getPriceRange,
    getRooms: getRooms,
    getGuests: getGuests,
    getFeatures: getFeatures,
    reset: reset
  };

  function enable() {
    mapFiltersArr.forEach(enableElement);
  }

  function disable() {
    mapFiltersArr.forEach(disableElement);
  }

  function enableElement(element) {
    element.disabled = false;
  }

  function disableElement(element) {
    element.disabled = true;
  }

  function fireChangeEvent() {
    var data = {
      detail: new FormData(form)
    };
    var event = new CustomEvent('filters-change', data);
    document.dispatchEvent(event);
  }

  function getHousingType() {
    return (filterTypeInput.value === 'any') ? APARTMENT_TYPES : [filterTypeInput.value];
  }

  function getPriceRange() {
    return priceRanges[filterPriceInput.value];
  }

  function getRooms() {
    return filterRoomsInput.value;
  }

  function getGuests() {
    return filterGuestsInput.value;
  }

  function getFeatures() {
    return filterFeaturesInputs
      .filter(function (input) {
        return input.checked;
      })
      .map(function (input) {
        return input.value;
      });
  }

  function reset() {
    form.reset();
  }
})();
