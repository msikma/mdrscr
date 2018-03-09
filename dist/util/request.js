'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestAsBrowser = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// These headers are sent with each request to make us look more like a real browser.
var browserHeaders = {
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8,nl;q=0.7,de;q=0.6,es;q=0.5,it;q=0.4,pt;q=0.3',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive'

  /**
   * Safely requests and returns the HTML for a URL.
   *
   * This mimics a browser request to ensure we don't hit an anti-bot wall.
   */
};var requestAsBrowser = exports.requestAsBrowser = function requestAsBrowser(url) {
  var extraHeaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _requestPromiseNative2.default)({ url: url, headers: _extends({}, browserHeaders, extraHeaders), gzip: true });
};