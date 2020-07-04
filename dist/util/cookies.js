"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.unloadCookies = exports.loadCookies = void 0;

var _requestAsBrowser = require("requestAsBrowser");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Container for our cookies.
var cookie = {
  jar: null
  /**
   * Loads a cookie file to use for every request.
   * For correctly making authenticated requests to Mandarake, we need a cookie
   * at domain='order.mandarake.co.jp', path='/', key='session_id'.
   */

};

var loadCookies =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(file) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _requestAsBrowser.loadCookieFile)(file);

          case 2:
            cookie.jar = _context.sent.jar;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function loadCookies(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Unloads previously loaded cookies to send clean requests again.
 */


exports.loadCookies = loadCookies;

var unloadCookies = function unloadCookies() {
  cookie.jar = null;
};

exports.unloadCookies = unloadCookies;
var _default = cookie;
exports["default"] = _default;