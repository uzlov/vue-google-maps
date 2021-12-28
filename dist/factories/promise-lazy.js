"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lazyValue = _interopRequireDefault(require("../utils/lazy-value"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCookie(name) {
  var value = "; ".concat(document.cookie);
  var parts = value.split("; ".concat(name, "="));
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function _default(loadGmapApi, GmapApi) {
  return function (options) {
    // Things to do once the API is loaded
    function onApiLoaded() {
      GmapApi.gmapApi = {};
      return window.google;
    }

    if (options.load) {
      // If library should load the API
      return (0, _lazyValue.default)(function () {
        // Load the
        // This will only be evaluated once
        if (typeof window === 'undefined') {
          // server side -- never resolve this promise
          return new Promise(function () {}).then(onApiLoaded);
        } else {
          var nonceCookie = options.nonceCookie ? getCookie(options.nonceCookie) : undefined;
          return new Promise(function (resolve, reject) {
            try {
              window.vueGoogleMapsInit = resolve;
              loadGmapApi(options.load, options.loadCn, nonceCookie);
            } catch (err) {
              reject(err);
            }
          }).then(onApiLoaded);
        }
      });
    } else {
      // If library should not handle API, provide
      // end-users with the global `vueGoogleMapsInit: () => undefined`
      // when the Google Maps API has been loaded
      var promise = new Promise(function (resolve) {
        if (typeof window === 'undefined') {
          // Do nothing if run from server-side
          return;
        }

        window.vueGoogleMapsInit = resolve;
      }).then(onApiLoaded);
      return (0, _lazyValue.default)(function () {
        return promise;
      });
    }
  };
}