'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMandarakeSearch = exports.ORDER_ITEM = exports.MANDARAKE_AUCTION_BASE = exports.MANDARAKE_ORDER_BASE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('../util/request');

var _shops = require('./shops');

var shops = _interopRequireWildcard(_shops);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// List of shops by their English and Japanese names.
var shopsByName = {
  en: Object.values(shops).reduce(function (acc, shop) {
    return _extends({}, acc, _defineProperty({}, shop[1], shop[0]));
  }, {}),
  ja: Object.values(shops).reduce(function (acc, shop) {
    return _extends({}, acc, _defineProperty({}, shop[2], shop[0]));
  }, {})

  // Domain for Mandarake mail order site.
};var MANDARAKE_ORDER_BASE = exports.MANDARAKE_ORDER_BASE = 'https://order.mandarake.co.jp';
// Domain for Mandarake auction site.
var MANDARAKE_AUCTION_BASE = exports.MANDARAKE_AUCTION_BASE = 'https://ekizo.mandarake.co.jp';
// Returns an item's order page URL using its item code. Necessary for adult items, since they hide the link.
var ORDER_ITEM = exports.ORDER_ITEM = function ORDER_ITEM(code) {
  return MANDARAKE_ORDER_BASE + '/order/detailPage/item?itemCode=' + code + '&ref=list';
};

// Some constant strings and regular expressions for parsing result contents.
var IN_STOCK = { ja: '在庫あります', en: 'In stock' };
var IN_STOREFRONT = { ja: '在庫確認します', en: 'Store Front Item' };
var PRICE = { ja: new RegExp('([0-9]+)円\\+税'), en: new RegExp('([0-9]+) yen') };
var ITEM_NO = new RegExp('(.+?)(\\(([0-9]+)\\))?$');

/**
 * Parses a price string, e.g. '500円+税', and returns only the number.
 */
var parsePrice = function parsePrice(price, lang) {
  var match = price.match(PRICE[lang]);
  return match && Number(match[1]);
};

/**
 * Attaches the base URL to a link if it's not an absolute link.
 */
var parseLink = function parseLink(url) {
  return '' + (!url.startsWith('http') ? MANDARAKE_ORDER_BASE : '') + url;
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
 * Returns the contents of Mandarake search result entries.
 * We scan the contents for the title, image, link, item code, etc.
 */
var parseSearchResults = function parseSearchResults($, entries, lang) {
  return entries.map(function (n, entry) {
    // Whether this is an adult item.
    var isAdult = $('.r18item', entry).length > 0;

    // Adult items hide the link to the item's detail page.
    // Either generate the link from the item code, or take it from the <a> tag.
    var link = isAdult ? ORDER_ITEM($('.adult_link', entry).attr('id').trim()) : parseLink($('.pic a', entry).attr('href'));

    // If this is an adult item, the image will be in a different place.
    var image = isAdult ? $('.pic .r18item img', entry).attr('src') : $('.pic img', entry).attr('src');

    var shop = $('.basic .shop', entry).text().trim();
    var shopCode = shopsByName[lang][shop];
    var itemNo = parseItemNo($('.basic .itemno', entry).text().trim());

    // If an item is in stock, it can either be set aside for online ordering,
    // or it can be on display in one of Mandarake's physical stores.
    // In the latter case, 'inStorefront' will be true.
    // If an item is in a physical store, it means the item is available in principle,
    // but could potentially have been bought since it was entered into the database.
    var stockStatus = $('.basic .stock', entry).text().trim();
    var inStock = stockStatus === IN_STOCK[lang] || stockStatus === IN_STOREFRONT[lang];
    var inStorefront = stockStatus === IN_STOREFRONT[lang];

    var title = $('.title a', entry).text().trim();
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
  }).get();
};

/**
 * Main search result object. Most of the work is done in the parseSearchResults() function.
 */
var parseMandarakeSearch = function parseMandarakeSearch($, url, searchDetails, lang) {
  var entries = parseSearchResults($, $('.entry .thumlarge .block'), lang);

  return {
    searchDetails: searchDetails,
    lang: lang,
    url: url,
    entries: entries,
    entryCount: entries.length
  };
};

/**
 * Main entry point for the search result scraping code.
 * This loads the given URL's HTML and parses the contents, returning the results as structured objects.
 */
var fetchMandarakeSearch = exports.fetchMandarakeSearch = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, searchDetails, lang) {
    var html, $html;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _request.requestAsBrowser)(url);

          case 2:
            html = _context.sent;
            $html = _cheerio2.default.load(html);
            return _context.abrupt('return', parseMandarakeSearch($html, url, searchDetails, lang));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchMandarakeSearch(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();