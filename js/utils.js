'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  function generateId() {
    var time = Date.now();
    var randomString = String(Math.random()).split('.')[1];
    return randomString + time;
  }

  function debounce(cb) {
    var lastTimeout;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  }

  window.utils = {
    debounce: debounce,
    generateId: generateId,
  };
}
)();
