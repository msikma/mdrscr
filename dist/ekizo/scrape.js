"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMandarakeAuctionSearch = void 0;

var _cheerio = _interopRequireDefault(require("cheerio"));

var _shopsByName = require("../common/shopsByName");

var _urls = require("./urls");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Parser for Japanese time durations and category slugs.
var reTime = new RegExp('(([0-9]+)日)?(([0-9]+)時間)?(([0-9]+)分)?');
var reCat = new RegExp('itemsListJa\\.html\\?category=(.+?)$'); // Parses a price string. Just removes commas and cast to number.

var parsePrice = function parsePrice(priceStr) {
  return parseInt(priceStr.split(',').join(''), 10);
}; // Adds a '0' in front of a string if it is length 1. Used for time formatting.


var padToTwo = function padToTwo(str) {
  return str.length === 1 ? "0".concat(str) : str;
};
/**
 * Parses the amount of time left for an auction and returns the result as a locale-independent string.
 * Durations can have three variables: days (日), hours (時間) and minutes (分).
 * An example: '13日18時間3分'. All numbers are regular width.
 */


var parseTimeLeft = function parseTimeLeft(timeStr) {
  if (timeStr === '入札開始前') {
    return {
      type: 'pre-bidding'
    };
  }

  var matches = timeStr.match(reTime);
  var days = matches[2] ? matches[2] : '0';
  var hours = matches[4] ? matches[4] : '0';
  var minutes = matches[6] ? matches[6] : '0';
  return {
    days: parseInt(days, 10),
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    formattedTime: "".concat(hours, ":").concat(padToTwo(minutes))
  };
};
/**
 * Attaches the base URL to a link if it's not an absolute link.
 */


var parseLink = function parseLink(url) {
  return "".concat(!url.startsWith('http') ? _urls.MANDARAKE_AUCTION_PATH : '').concat(url);
};
/**
 * If needed, we remove some items from the search query if we have both a query and a category.
 * If both are passed, the site will ignore the category altogether. So we need to do the filtering ourselves.
 */


var filterIfNeeded = function filterIfNeeded(entries, searchDetails) {
  // Only continue if we have both a query and category.
  if (!searchDetails.q || !searchDetails.category) {
    return entries;
  } // Filter the entries by category.


  var categorySlug = searchDetails.category;
  return entries.filter(function (entry) {
    var entrySlugs = entry.categories.map(function (c) {
      return c.slug;
    });
    return entrySlugs.indexOf(categorySlug) > -1;
  });
};
/**
 * Returns the category from a link, e.g. 'itemsListJa.html?category=anime_cels' returns 'anime_cels'.
 */


var parseCategoryHref = function parseCategoryHref(href) {
  var matches = href.match(reCat);
  return matches[1] ? matches[1] : null;
};
/**
 * Parses a single search result found on an auction search result page.
 */


var parseSearchResult = function parseSearchResult($) {
  return function (n, entry) {
    var title = $('#itemName', entry).text().trim();
    var itemNo = $('#itemNo', entry).text().trim();
    var link = parseLink($('#goItemInfo', entry).attr('href'));
    var image = $('#thumbnail', entry).attr('src');
    var auctionType = $('#auctionName', entry).text().trim();
    var shop = $('#isNotAucFesta .shop', entry).text().trim();
    var shopCode = _shopsByName.shopsByName['ja'][shop];
    var categories = $('#aucItemCategoryItems a', entry).get().map(function (cat) {
      return {
        name: $('#name', cat).text().trim(),
        slug: parseCategoryHref($(cat).attr('href'))
      };
    });
    var currentPrice = parsePrice($('#nowPrice', entry).text().trim());
    var startingPrice = parsePrice($('#startPrice', entry).text().trim());
    var bids = parseInt($('#bidCount', entry).text().trim(), 10);
    var watchers = parseInt($('#watchCount', entry).text().trim(), 10);
    var timeLeft = parseTimeLeft($('#strTimeLeft', entry).text().trim());
    return {
      title: title,
      itemNo: itemNo,
      link: link,
      image: image,
      auctionType: auctionType,
      shop: shop ? shop : null,
      shopCode: shopCode ? shopCode : null,
      categories: categories,
      currentPrice: currentPrice,
      startingPrice: startingPrice,
      bids: bids,
      watchers: watchers,
      timeLeft: timeLeft
    };
  };
};
/**
 * Parses the contents of an auction search page HTML.
 */


var fetchMandarakeAuctionSearch = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(html, url, searchDetails) {
    var $, entriesUnfiltered, entries;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            $ = _cheerio["default"].load(html);
            entriesUnfiltered = $('#itemListLayout .block').map(parseSearchResult($)).get(); // If we have both a query and a category, the site will only honor the query.
            // The category will be ignored. Thus we need to run through our search results
            // manually to remove items from the wrong category.

            entries = filterIfNeeded(entriesUnfiltered, searchDetails);
            return _context.abrupt("return", {
              searchDetails: searchDetails,
              lang: 'ja',
              url: url,
              entries: entries,
              entryCount: entries.length
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchMandarakeAuctionSearch(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchMandarakeAuctionSearch = fetchMandarakeAuctionSearch;