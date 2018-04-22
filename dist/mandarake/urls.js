'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mandarakeSearchURL = exports.mandarakeFavoritesURL = exports.mandarakeOrderURL = exports.MANDARAKE_FAVS_URL = exports.MANDARAKE_ORDER_URL = exports.MANDARAKE_ORDER_BASE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _query = require('../util/query');

// Domain for Mandarake mail order site.
var MANDARAKE_ORDER_BASE = exports.MANDARAKE_ORDER_BASE = 'https://order.mandarake.co.jp';
// Mandarake mail order site.
var MANDARAKE_ORDER_URL = exports.MANDARAKE_ORDER_URL = MANDARAKE_ORDER_BASE + '/order/listPage/list';
// Page URL for a Mandarake user's favorites list.
var MANDARAKE_FAVS_URL = exports.MANDARAKE_FAVS_URL = MANDARAKE_ORDER_BASE + '/order/MyPage/favoritesList';

// Returns an item's order page URL using its item code. Necessary for adult items, since they hide the link.
var mandarakeOrderURL = exports.mandarakeOrderURL = function mandarakeOrderURL(code) {
  return MANDARAKE_ORDER_BASE + '/order/detailPage/item?itemCode=' + code + '&ref=list';
};

// Returns the URL we need to scrape the user's favorites.
var mandarakeFavoritesURL = exports.mandarakeFavoritesURL = function mandarakeFavoritesURL(lang) {
  return MANDARAKE_FAVS_URL + '?' + (0, _query.objToParams)({ lang: lang });
};

// Returns the URL we need to scrape a search request.
var mandarakeSearchURL = exports.mandarakeSearchURL = function mandarakeSearchURL(searchDetails, lang) {
  return MANDARAKE_ORDER_URL + '?' + (0, _query.objToParams)(_extends({}, searchDetails, { lang: lang }));
};