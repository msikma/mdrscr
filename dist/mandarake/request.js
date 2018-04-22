'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMandarakeFavorites = exports.getMandarakeSearch = exports.getMultiplePages = exports.getExtendedInfo = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _requestAsBrowser = require('requestAsBrowser');

var _requestAsBrowser2 = _interopRequireDefault(_requestAsBrowser);

var _cookies = require('../util/cookies');

var _cookies2 = _interopRequireDefault(_cookies);

var _scrape = require('./scrape');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

/**
 * Fetches the extended info for all items.
 */
var getExtendedInfo = exports.getExtendedInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(items) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ja';
    var progressCb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var urls, html;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            urls = items.map(function (item) {
              return item.link;
            });
            _context.next = 3;
            return getMultiplePages(urls, progressCb);

          case 3:
            html = _context.sent;
            return _context.abrupt('return', items.map(function (item, n) {
              return _extends({}, item, (0, _scrape.parseSingleDetailExtended)(html[n], lang));
            }));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getExtendedInfo(_x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Returns the HTML for an array of pages, resolving when they are all ready.
 * Used to fetch e.g. all pages in one's favorites list.
 */
var getMultiplePages = exports.getMultiplePages = function getMultiplePages(urls) {
  var progressCb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var downloaded = 0;
  var total = urls.length;

  return Promise.all(urls.map(function (url) {
    return new Promise(function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve) {
        var pageContent;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _requestAsBrowser2.default)(url, _cookies2.default.jar);

              case 2:
                pageContent = _context2.sent;

                if (progressCb) progressCb(++downloaded, total);
                return _context2.abrupt('return', resolve(pageContent.body));

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x5) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
};

/**
 * Main entry point for the search result scraping code.
 * This loads the given URL's HTML and parses the contents, returning the results as structured objects.
 */
var getMandarakeSearch = exports.getMandarakeSearch = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(url, searchDetails, lang) {
    var data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _requestAsBrowser2.default)(url, _cookies2.default.jar);

          case 2:
            data = _context3.sent;
            return _context3.abrupt('return', (0, _scrape.fetchMandarakeSearch)(data.body, url, searchDetails, lang));

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getMandarakeSearch(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Retrieves the favorites URL and parses its contents.
 */
var getMandarakeFavorites = exports.getMandarakeFavorites = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(url, lang) {
    var addExtendedInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var progressCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var data;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _requestAsBrowser2.default)(url, _cookies2.default.jar);

          case 2:
            data = _context4.sent;
            return _context4.abrupt('return', (0, _scrape.fetchMandarakeFavorites)(data.body, lang, addExtendedInfo, progressCb));

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getMandarakeFavorites(_x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();