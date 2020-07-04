"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMandarakeFavorites = exports.getMandarakeSearch = exports.getMultiplePages = exports.getExtendedInfo = void 0;

var _requestAsBrowser = _interopRequireDefault(require("requestAsBrowser"));

var _cookies = _interopRequireDefault(require("../util/cookies"));

var _scrape = require("./scrape");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Fetches the extended info for all items.
 */
var getExtendedInfo =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(items) {
    var lang,
        progressCb,
        urls,
        html,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            lang = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'ja';
            progressCb = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            urls = items.map(function (item) {
              return item.link;
            });
            _context.next = 5;
            return getMultiplePages(urls, progressCb);

          case 5:
            html = _context.sent;
            return _context.abrupt("return", items.map(function (item, n) {
              return _objectSpread({}, item, {}, (0, _scrape.parseSingleDetailExtended)(html[n], lang));
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getExtendedInfo(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Returns the HTML for an array of pages, resolving when they are all ready.
 * Used to fetch e.g. all pages in one's favorites list.
 */


exports.getExtendedInfo = getExtendedInfo;

var getMultiplePages = function getMultiplePages(urls) {
  var progressCb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var downloaded = 0;
  var total = urls.length;
  return Promise.all(urls.map(function (url) {
    return new Promise(
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(resolve) {
        var pageContent;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _requestAsBrowser["default"])(url, _cookies["default"].jar);

              case 2:
                pageContent = _context2.sent;
                if (progressCb) progressCb(++downloaded, total);
                return _context2.abrupt("return", resolve(pageContent.body));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
};
/**
 * Main entry point for the search result scraping code.
 * This loads the given URL's HTML and parses the contents, returning the results as structured objects.
 */


exports.getMultiplePages = getMultiplePages;

var getMandarakeSearch =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(url, searchDetails, lang) {
    var data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _requestAsBrowser["default"])(url, _cookies["default"].jar);

          case 2:
            data = _context3.sent;
            return _context3.abrupt("return", (0, _scrape.fetchMandarakeSearch)(data.body, url, searchDetails, lang));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getMandarakeSearch(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Retrieves the favorites URL and parses its contents.
 */


exports.getMandarakeSearch = getMandarakeSearch;

var getMandarakeFavorites =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(url, lang) {
    var addExtendedInfo,
        progressCb,
        data,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            addExtendedInfo = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : false;
            progressCb = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : null;
            _context4.next = 4;
            return (0, _requestAsBrowser["default"])(url, _cookies["default"].jar);

          case 4:
            data = _context4.sent;
            return _context4.abrupt("return", (0, _scrape.fetchMandarakeFavorites)(data.body, lang, addExtendedInfo, progressCb));

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getMandarakeFavorites(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getMandarakeFavorites = getMandarakeFavorites;