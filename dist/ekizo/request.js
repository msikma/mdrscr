'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMandarakeAuctionSearch = undefined;

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
 * This loads the auction URL's HTML and calls the parser to extract the info.
 */
var getMandarakeAuctionSearch = exports.getMandarakeAuctionSearch = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, searchDetails) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _requestAsBrowser2.default)(url, _cookies2.default.jar);

          case 2:
            data = _context.sent;
            return _context.abrupt('return', (0, _scrape.fetchMandarakeAuctionSearch)(data.body, url, searchDetails));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getMandarakeAuctionSearch(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();