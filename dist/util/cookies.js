'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unloadCookies = exports.loadCookies = undefined;

var _requestAsBrowser = require('requestAsBrowser');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

// Container for our cookies.
var cookie = {
  jar: null

  /**
   * Loads a cookie file to use for every request.
   * For correctly making authenticated requests to Mandarake, we need a cookie
   * at domain='order.mandarake.co.jp', path='/', key='session_id'.
   */
};var loadCookies = exports.loadCookies = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _requestAsBrowser.loadCookieFile)(file);

          case 2:
            cookie.jar = _context.sent.jar;

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function loadCookies(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Unloads previously loaded cookies to send clean requests again.
 */
var unloadCookies = exports.unloadCookies = function unloadCookies() {
  cookie.jar = null;
};

exports.default = cookie;