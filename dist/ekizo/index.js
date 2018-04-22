'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mandarakeAuctionSearch = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _request = require('./request');

var _urls = require('./urls');

// Default search details. Every search overrides these values.
// The ability to customize these search results is far more limited than the regular site at the moment.
var defaultDetails = {
  // Search query. Unlike regular Mandarake searches, if this is empty we get nothing.
  q: '',
  // Limits results to a specific category.
  category: null

  /**
   * Main entry point. Retrieves the results of an auction search page
   * and returns the information of what's found there.
   */
};var mandarakeAuctionSearch = exports.mandarakeAuctionSearch = function mandarakeAuctionSearch(searchDetails) {
  var search = _extends({}, defaultDetails, searchDetails);
  var url = (0, _urls.mandarakeAuctionSearchURL)(search);
  return (0, _request.getMandarakeAuctionSearch)(url, search);
};