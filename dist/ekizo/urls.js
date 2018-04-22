'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mandarakeAuctionSearchURL = exports.mandarakeAuctionObjectURL = exports.MANDARAKE_AUCTION_INDEX = exports.MANDARAKE_AUCTION_PATH = exports.MANDARAKE_AUCTION_BASE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _query = require('../util/query');

// Domain for Mandarake auction site.
var MANDARAKE_AUCTION_BASE = exports.MANDARAKE_AUCTION_BASE = 'https://ekizo.mandarake.co.jp';
// The path in which all important pages are found.
var MANDARAKE_AUCTION_PATH = exports.MANDARAKE_AUCTION_PATH = MANDARAKE_AUCTION_BASE + '/auction/item/';
// Mandarake auction index page.
var MANDARAKE_AUCTION_INDEX = exports.MANDARAKE_AUCTION_INDEX = MANDARAKE_AUCTION_PATH + 'itemsListJa.html';

// Returns the URL for single item.
var mandarakeAuctionObjectURL = exports.mandarakeAuctionObjectURL = function mandarakeAuctionObjectURL(id) {
  return MANDARAKE_AUCTION_INDEX + '?index=' + id;
};

// Returns the URL for an auction search request.
var mandarakeAuctionSearchURL = exports.mandarakeAuctionSearchURL = function mandarakeAuctionSearchURL(searchDetails) {
  return MANDARAKE_AUCTION_INDEX + '?' + (0, _query.objToParams)(_extends({}, searchDetails));
};