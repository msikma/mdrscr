"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mandarakeSearchURL = exports.mandarakeFavoritesURL = exports.mandarakeOrderURL = exports.MANDARAKE_FAVS_URL = exports.MANDARAKE_ORDER_URL = exports.MANDARAKE_ORDER_BASE = void 0;

var _query = require("../util/query");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Domain for Mandarake mail order site.
var MANDARAKE_ORDER_BASE = 'https://order.mandarake.co.jp'; // Mandarake mail order site.

exports.MANDARAKE_ORDER_BASE = MANDARAKE_ORDER_BASE;
var MANDARAKE_ORDER_URL = "".concat(MANDARAKE_ORDER_BASE, "/order/listPage/list"); // Page URL for a Mandarake user's favorites list.

exports.MANDARAKE_ORDER_URL = MANDARAKE_ORDER_URL;
var MANDARAKE_FAVS_URL = "".concat(MANDARAKE_ORDER_BASE, "/order/MyPage/favoritesList"); // Returns an item's order page URL using its item code. Necessary for adult items, since they hide the link.

exports.MANDARAKE_FAVS_URL = MANDARAKE_FAVS_URL;

var mandarakeOrderURL = function mandarakeOrderURL(code) {
  return "".concat(MANDARAKE_ORDER_BASE, "/order/detailPage/item?itemCode=").concat(code, "&ref=list");
}; // Returns the URL we need to scrape the user's favorites.


exports.mandarakeOrderURL = mandarakeOrderURL;

var mandarakeFavoritesURL = function mandarakeFavoritesURL(lang) {
  return "".concat(MANDARAKE_FAVS_URL, "?").concat((0, _query.objToParams)({
    lang: lang
  }));
}; // Returns the URL we need to scrape a search request.


exports.mandarakeFavoritesURL = mandarakeFavoritesURL;

var mandarakeSearchURL = function mandarakeSearchURL(searchDetails, lang) {
  return "".concat(MANDARAKE_ORDER_URL, "?").concat((0, _query.objToParams)(_objectSpread({}, searchDetails, {
    lang: lang
  })));
};

exports.mandarakeSearchURL = mandarakeSearchURL;