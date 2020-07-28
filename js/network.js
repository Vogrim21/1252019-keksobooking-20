'use strict';
(function () {
  var LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var POST_URL = 'https://javascript.pages.academy/keksobooking';
  var HTTP_STATUS_OK = 200;

  function createXhr(method, url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_OK) {
        cb(null, xhr.response);
      } else {
        cb('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      cb('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      cb('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open(method, url);
    return xhr;
  }

  function load(cb) {
    var xhr = createXhr('GET', LOAD_URL, cb);
    xhr.send();
  }

  function send(data, cb) {
    var xhr = createXhr('POST', POST_URL, cb);
    xhr.send(data);
  }

  window.Network = {
    load: load,
    send: send
  };
})();
