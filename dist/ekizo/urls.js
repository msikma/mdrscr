"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mandarakeAuctionSearchURL = exports.mandarakeAuctionObjectURL = exports.MANDARAKE_AUCTION_INDEX = exports.MANDARAKE_AUCTION_PATH = exports.MANDARAKE_AUCTION_BASE = void 0;

var _query = require("../util/query");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Domain for Mandarake auction site.
var MANDARAKE_AUCTION_BASE = 'https://ekizo.mandarake.co.jp'; // The path in which all important pages are found.

exports.MANDARAKE_AUCTION_BASE = MANDARAKE_AUCTION_BASE;
var MANDARAKE_AUCTION_PATH = "".concat(MANDARAKE_AUCTION_BASE, "/auction/item/"); // Mandarake auction index page.

exports.MANDARAKE_AUCTION_PATH = MANDARAKE_AUCTION_PATH;
var MANDARAKE_AUCTION_INDEX = "".concat(MANDARAKE_AUCTION_PATH, "itemsListJa.html"); // Returns the URL for single item.

exports.MANDARAKE_AUCTION_INDEX = MANDARAKE_AUCTION_INDEX;

var mandarakeAuctionObjectURL = function mandarakeAuctionObjectURL(id) {
  return "".concat(MANDARAKE_AUCTION_INDEX, "?index=").concat(id);
}; // Returns the URL for an auction search request.


exports.mandarakeAuctionObjectURL = mandarakeAuctionObjectURL;

var mandarakeAuctionSearchURL = function mandarakeAuctionSearchURL(searchDetails) {
  // 'keyword' is accepted for consistency with the main search, but the URL
  // requires it be named 'q'.
  var searchDetailsCopy = _objectSpread({}, searchDetails);

  searchDetailsCopy.q = searchDetailsCopy.keyword;
  delete searchDetailsCopy.keyword;
  return "".concat(MANDARAKE_AUCTION_INDEX, "?").concat((0, _query.objToParams)(_objectSpread({}, searchDetailsCopy)));
};

exports.mandarakeAuctionSearchURL = mandarakeAuctionSearchURL;