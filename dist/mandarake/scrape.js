'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMandarakeFavorites = exports.fetchMandarakeSearch = exports.unloadCookies = exports.loadCookies = exports.ORDER_ITEM = exports.MANDARAKE_AUCTION_BASE = exports.MANDARAKE_ORDER_BASE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _lodash = require('lodash');

var _requestAsBrowser = require('requestAsBrowser');

var _requestAsBrowser2 = _interopRequireDefault(_requestAsBrowser);

var _shops = require('./shops');

var shops = _interopRequireWildcard(_shops);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
var PRICE = { ja: new RegExp('([0-9,]+)円(\\+税)?'), en: new RegExp('([0-9,]+) yen') };
var ITEM_NO = new RegExp('(.+?)(\\(([0-9-]+)\\))?$');

// Container for our cookies.
var cookie = {
  jar: null

  /**
   * Loads a cookie file to use for every request.
   * For correctly making authenticated requests to Mandarake, we need a cookie
   * at domain='order.mandarake.co.jp', path='/', key='session_id'.
   */
};var loadCookies = exports.loadCookies = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _requestAsBrowser.loadCookieFile)(file);

          case 2:
            cookie.jar = _context.sent.jar;

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function loadCookies(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Unloads previously loaded cookies to send clean requests again.
 */
var unloadCookies = exports.unloadCookies = function unloadCookies() {
  cookie.jar = null;
};

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

var parseSingleSearchResult = function parseSingleSearchResult($, lang) {
  return function (n, entry) {
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
 * Returns the contents of Mandarake search result entries.
 * We scan the contents for the title, image, link, item code, etc.
 */
var parseSearchResults = function parseSearchResults($, entries, lang) {
  return entries.map(parseSingleSearchResult($, lang)).get();
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
var getFavoritesPages = function getFavoritesPages($) {
  return $('.content .pager .numberlist li a')
  // Filter out the current page.
  .filter(function (n, el) {
    return !!$(el).attr('href');
  }).map(function (n, el) {
    return '' + MANDARAKE_ORDER_BASE + $(el).attr('href');
  }).get();
};

/**
 * Fetches the extended info for all items.
 *
 * This can take a while, so we accept a progress callback function
 * that takes (currItem, totalItems) as its signature.
 */
var fetchExtendedInfo = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(items) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ja';
    var progressCb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var downloaded, total;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            downloaded = 0;
            total = items.length;
            _context3.next = 4;
            return Promise.all(items.map(function (item) {
              return new Promise(function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve) {
                  var data, extended;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return (0, _requestAsBrowser2.default)(item.link, cookie.jar);

                        case 2:
                          data = _context2.sent;
                          extended = parseSingleDetailExtended(_cheerio2.default.load(data.body), lang);

                          if (progressCb) progressCb(++downloaded, total);
                          resolve(_extends({}, item, extended));

                        case 6:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, undefined);
                }));

                return function (_x5) {
                  return _ref3.apply(this, arguments);
                };
              }());
            }));

          case 4:
            return _context3.abrupt('return', _context3.sent);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function fetchExtendedInfo(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Parse a single detail page and return extended info only.
 * This naturally assumes that we already have the item's basic info.
 */
var parseSingleDetailExtended = function parseSingleDetailExtended($, lang) {
  var otherShopNames = $('.other_itemlist .shop').map(function (n, el) {
    return $(el).text().trim();
  }).get();
  var otherShops = otherShopNames.map(function (shop) {
    return { shop: shop, shopCode: shopsByName[lang][shop] };
  });
  return {
    otherShops: otherShops
  };
};

/**
 * Main entry point for the search result scraping code.
 * This loads the given URL's HTML and parses the contents, returning the results as structured objects.
 */
var fetchMandarakeSearch = exports.fetchMandarakeSearch = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(url, searchDetails, lang) {
    var data, $html;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _requestAsBrowser2.default)(url, cookie.jar);

          case 2:
            data = _context4.sent;
            $html = _cheerio2.default.load(data.body);
            return _context4.abrupt('return', parseMandarakeSearch($html, url, searchDetails, lang));

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function fetchMandarakeSearch(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Fetches the currently logged in user's favorites list and returns
 * all items found there. Note that this could take quite a long time to complete,
 * depending on how many pages there are. We will try to request multiple
 * pages at the same time, but not too many.
 */
var fetchMandarakeFavorites = exports.fetchMandarakeFavorites = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(mainURL, lang) {
    var getExtendedInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var progressCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _lodash.noop;
    var mainContent, $main, notLoggedIn, otherURLs, otherCh, basicInfo;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _requestAsBrowser2.default)(mainURL, cookie.jar);

          case 2:
            mainContent = _context6.sent;
            $main = _cheerio2.default.load(mainContent.body);

            // Check whether we're logged in or not. This is mandatory to fetch favorites.

            notLoggedIn = mainContent.body.indexOf('body class="login"') > -1;

            if (!notLoggedIn) {
              _context6.next = 7;
              break;
            }

            throw new TypeError('Not logged in');

          case 7:

            // Find out how many other pages there are, and request them too.
            otherURLs = getFavoritesPages($main);
            _context6.next = 10;
            return Promise.all(otherURLs.map(function (url) {
              return new Promise(function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve) {
                  var pageContent;
                  return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          _context5.next = 2;
                          return (0, _requestAsBrowser2.default)(url, cookie.jar);

                        case 2:
                          pageContent = _context5.sent;
                          return _context5.abrupt('return', resolve(_cheerio2.default.load(pageContent.body)));

                        case 4:
                        case 'end':
                          return _context5.stop();
                      }
                    }
                  }, _callee5, undefined);
                }));

                return function (_x13) {
                  return _ref6.apply(this, arguments);
                };
              }());
            }));

          case 10:
            otherCh = _context6.sent;


            // Parse all main info from all items. This is the same as the search results data.
            basicInfo = parseFavoritesItems([$main].concat(_toConsumableArray(otherCh)), lang);

            // Return basic info only if we don't need extended shop availability information.

            if (getExtendedInfo) {
              _context6.next = 14;
              break;
            }

            return _context6.abrupt('return', basicInfo);

          case 14:
            return _context6.abrupt('return', fetchExtendedInfo(basicInfo, lang, progressCb));

          case 15:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function fetchMandarakeFavorites(_x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}();