'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mandarakeSearch = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _scrape = require('./scrape');

var _categories = require('./categories');

var _shops = require('./shops');

// Mandarake mail order site.
var orderURL = _scrape.MANDARAKE_ORDER_BASE + '/order/listPage/list?';
// Mandarake auction site.
var auctionURL = _scrape.MANDARAKE_AUCTION_BASE + '/auction/item/itemsListEn.html?category=plamo';

// Default search details. Every search overrides these values.
// You can change anything, but it's not recommended to change 'sort', 'sortOrder' and 'dispCount'.
var defaultDetails = {
  // What to search for. If empty, everything is displayed.
  keyword: '',
  // Limits results to a specific category.
  categoryCode: _categories.EVERYTHING[0],
  // Limits results to those physically at a specific Mandarake location.
  // Useful for combining items in one shipment.
  shop: _shops.ALL_STORES[0],
  // 0: hide adult items. 1: show adult items.
  dispAdult: 0,
  // 0: show sold out items. 1: hide sold out items.
  soldOut: 1,
  // Limits results to a maximum price of n yen.
  maxPrice: null,
  // Limits results to items added n minutes ago.
  // This should be set based on how often the bot runs.
  upToMinutes: 0, // eventually, set to 360
  // Changes the sort order. Not recommended to override.
  sort: 'arrival',
  // 0: ascending. 1: descending. Not recommended to override.
  sortOrder: 1,
  // How many results to show at most. Not recommended to override.
  // Should be as high as possible so we don't miss anything.
  dispCount: 240

  /**
   * Converts an object of key/value pairs to URI params.
   */
};var objToParams = function objToParams(obj) {
  return Object.keys(obj)
  // Filter out null, undefined and empty strings, but keep 0.
  .filter(function (k) {
    return obj[k] != null && obj[k] !== '';
  })
  // Encode to URI components.
  .map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
  }).join('&');
};

/**
 * Returns the URL we need to scrape a search request.
 */
var mandarakeSearchURL = function mandarakeSearchURL(searchDetails, lang) {
  return (
    // Converts our search parameters to a query string.
    '' + orderURL + objToParams(_extends({}, searchDetails, { lang: lang }))
  );
};

/**
 * Main entry point. Scrapes Mandarake's search results and returns info for the items found.
 * Search details are merged with our defaults first, and 'lang' defaults to Japanese if not set.
 */
var mandarakeSearch = exports.mandarakeSearch = function mandarakeSearch(searchDetails) {
  var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ja';

  var search = _extends({}, defaultDetails, searchDetails);
  var url = mandarakeSearchURL(search, lang);
  return (0, _scrape.fetchMandarakeSearch)(url, search, lang);
};