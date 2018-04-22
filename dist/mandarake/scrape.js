'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMandarakeFavorites = exports.fetchMandarakeSearch = exports.parseSingleDetailExtended = undefined;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _lodash = require('lodash');

var _shopsByName = require('../common/shopsByName');

var _request = require('./request');

var _urls = require('./urls');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

// Some constant strings and regular expressions for parsing result contents.
var IN_STOCK = { ja: '在庫あります', en: 'In stock' };
var IN_STOREFRONT = { ja: '在庫確認します', en: 'Store Front Item' };
var PRICE = { ja: new RegExp('([0-9,]+)円(\\+税)?'), en: new RegExp('([0-9,]+) yen') };
var ITEM_NO = new RegExp('(.+?)(\\(([0-9-]+)\\))?$');

/**
 * Parses a price string, e.g. '500円+税', '1,000円+税' and returns only the number.
 */
var parsePrice = function parsePrice(price, lang) {
  var match = price.match(PRICE[lang]);
  return match && Number(match[1].replace(',', ''));
};

/**
 * Attaches the base URL to a link if it's not an absolute link.
 */
var parseLink = function parseLink(url) {
  return '' + (!url.startsWith('http') ? _urls.MANDARAKE_ORDER_BASE : '') + url;
};

/**
 * Splits up an item number string.
 * e.g. 'cmp-4ftk-00XDSDC9 (0181099788)' becomes [ 'cmp-4ftk-00XDSDC9', '0181099788' ].
 * As noted in the readme, the first is the Mandarake unique ID, and the second is a product specific ID.
 */
var parseItemNo = function parseItemNo(itemNo) {
  var match = itemNo.match(ITEM_NO);
  // In most cases, we have both the Mandarake ID and the product ID.
  if (match && match[3]) {
    return [match[1], match[3]].map(function (str) {
      return str.trim();
    });
  }
  // Otherwise, return only the Mandarake ID.
  else if (match && match[1]) {
      return [match[1].trim()];
    }
  // I'm not aware of IDs that don't match either of the above choices.
  // But if there is, it's probably best to just return the input string as an array.
  return [itemNo];
};

/**
 * Retrieves all pertinent information for one single item.
 */
var parseSingleSearchResult = function parseSingleSearchResult($, lang) {
  return function (n, entry) {
    // Whether this is an adult item.
    var isAdult = $('.r18item', entry).length > 0;

    // Adult items hide the link to the item's detail page.
    // Either generate the link from the item code, or take it from the <a> tag.
    var link = isAdult ? (0, _urls.mandarakeOrderURL)($('.adult_link', entry).attr('id').trim()) : parseLink($('.pic a', entry).attr('href'));

    // If this is an adult item, the image will be in a different place.
    var image = isAdult ? $('.pic .r18item img', entry).attr('src') : $('.pic img', entry).attr('src');

    var shop = $('.basic .shop', entry).text().trim();
    var shopCode = _shopsByName.shopsByName[lang][shop];
    var itemNo = parseItemNo($('.basic .itemno', entry).text().trim());

    // If an item is in stock, it can either be set aside for online ordering,
    // or it can be on display in one of Mandarake's physical stores.
    // In the latter case, 'inStorefront' will be true.
    // If an item is in a physical store, it means the item is available in principle,
    // but could potentially have been bought since it was entered into the database.
    var stockStatus = $('.basic .stock', entry).text().trim();
    var inStock = stockStatus === IN_STOCK[lang] || stockStatus === IN_STOREFRONT[lang];
    var inStorefront = stockStatus === IN_STOREFRONT[lang];

    // On the search results page, titles are inside an <a> tag. Otherwise, a <p>.
    var titleLink = $('.title a', entry).text().trim();
    var titleParagraph = $('.title p', entry).text().trim();
    var title = titleLink || titleParagraph;
    var price = parsePrice($('.price', entry).text().trim(), lang);

    return {
      title: title,
      itemNo: itemNo,
      image: image,
      link: link,
      shop: shop,
      shopCode: shopCode,
      price: price,
      isAdult: isAdult,
      inStock: inStock,
      inStorefront: inStorefront
    };
  };
};

/**
 * Parses and returns the contents of favorites from an array of pages.
 * The array that we expect here is an array of Cheerio objects.
 *
 * We're returning the same data that we send for a search result page.
 * For favorites, we still need to request additional data.
 */
var parseFavoritesItems = function parseFavoritesItems(pagesArr$, lang) {
  return (0, _lodash.flattenDeep)(pagesArr$.map(function ($) {
    return $('.content .block').map(parseSingleSearchResult($, lang)).get();
  }));
};

/**
 * Returns the URLs to other favorites pages.
 */
var findFavoritesPages = function findFavoritesPages($) {
  return $('.content .pager .numberlist li a')
  // Filter out the current page.
  .filter(function (n, el) {
    return !!$(el).attr('href');
  }).map(function (n, el) {
    return '' + _urls.MANDARAKE_ORDER_BASE + $(el).attr('href');
  }).get();
};

/**
 * Parse a single detail page and return extended info only.
 * This naturally assumes that we already have the item's basic info.
 */
var parseSingleDetailExtended = exports.parseSingleDetailExtended = function parseSingleDetailExtended(html, lang) {
  var $ = _cheerio2.default.load(html);
  var otherShopNames = $('.other_itemlist .shop').map(function (n, el) {
    return $(el).text().trim();
  }).get();
  var otherShops = otherShopNames.map(function (shop) {
    return { shop: shop, shopCode: _shopsByName.shopsByName[lang][shop] };
  });
  return {
    otherShops: otherShops
  };
};

/**
 * Loads the given HTML for a search page and parses its contents, returning the results as structured objects.
 */
var fetchMandarakeSearch = exports.fetchMandarakeSearch = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(html, url, searchDetails, lang) {
    var $, entries;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            $ = _cheerio2.default.load(html);
            entries = $('.entry .thumlarge .block').map(parseSingleSearchResult($, lang)).get();
            return _context.abrupt('return', {
              searchDetails: searchDetails,
              lang: lang,
              url: url,
              entries: entries,
              entryCount: entries.length
            });

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchMandarakeSearch(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Fetches the currently logged in user's favorites list and returns
 * all items found there. Note that this could take quite a long time to complete,
 * depending on how many pages there are. We will try to request multiple
 * pages at the same time, but not too many.
 */
var fetchMandarakeFavorites = exports.fetchMandarakeFavorites = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(html, lang) {
    var addExtendedInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var progressCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var $main, notLoggedIn, otherURLs, otherPages, otherCh, basicInfo;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            $main = _cheerio2.default.load(html);

            // Check whether we're logged in or not. This is mandatory to fetch favorites.

            notLoggedIn = html.indexOf('body class="login"') > -1;

            if (!notLoggedIn) {
              _context2.next = 4;
              break;
            }

            throw new TypeError('Not logged in');

          case 4:

            // Find out how many other pages there are, and request them too.
            otherURLs = findFavoritesPages($main);
            _context2.next = 7;
            return (0, _request.getMultiplePages)(otherURLs);

          case 7:
            otherPages = _context2.sent;
            otherCh = otherPages.map(function (html) {
              return _cheerio2.default.load(html);
            });

            // Parse all main info from all items. This is the same as the search results data.

            basicInfo = parseFavoritesItems([$main].concat(_toConsumableArray(otherCh)), lang);

            // Return basic info only if we don't need extended shop availability information.

            if (addExtendedInfo) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', basicInfo);

          case 12:
            return _context2.abrupt('return', (0, _request.getExtendedInfo)(basicInfo, lang, progressCb));

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function fetchMandarakeFavorites(_x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}();