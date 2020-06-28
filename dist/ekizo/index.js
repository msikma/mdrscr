"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mandarakeAuctionSearch = void 0;

var _request = require("./request");

var _urls = require("./urls");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Default search details. Every search overrides these values.
// The ability to customize these search results is far more limited than the regular site at the moment.
var defaultDetails = {
  // Search query. Unlike regular Mandarake searches, if this is empty we get nothing.
  keyword: '',
  // Limits results to a specific category.
  category: null
};
/**
 * Main entry point. Retrieves the results of an auction search page
 * and returns the information of what's found there.
 */

var mandarakeAuctionSearch = function mandarakeAuctionSearch(searchDetails) {
  var search = _objectSpread({}, defaultDetails, {}, searchDetails);

  var url = (0, _urls.mandarakeAuctionSearchURL)(search);
  return (0, _request.getMandarakeAuctionSearch)(url, search);
};

exports.mandarakeAuctionSearch = mandarakeAuctionSearch;