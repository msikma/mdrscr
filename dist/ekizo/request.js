"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMandarakeAuctionSearch = void 0;

var _requestAsBrowser = _interopRequireDefault(require("requestAsBrowser"));

var _cookies = _interopRequireDefault(require("../util/cookies"));

var _scrape = require("./scrape");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * This loads the auction URL's HTML and calls the parser to extract the info.
 */
var getMandarakeAuctionSearch =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url, searchDetails) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _requestAsBrowser["default"])(url, _cookies["default"].jar);

          case 2:
            data = _context.sent;
            return _context.abrupt("return", (0, _scrape.fetchMandarakeAuctionSearch)(data.body, url, searchDetails));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getMandarakeAuctionSearch(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getMandarakeAuctionSearch = getMandarakeAuctionSearch;