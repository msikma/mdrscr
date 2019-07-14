"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objToParams = void 0;

/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

/**
 * Converts an object of key/value pairs to URI params.
 */
var objToParams = function objToParams(obj) {
  return Object.keys(obj) // Filter out null, undefined and empty strings, but keep 0.
  .filter(function (k) {
    return obj[k] != null && obj[k] !== '';
  }) // Encode to URI components.
  .map(function (k) {
    return "".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(obj[k]));
  }).join('&');
};

exports.objToParams = objToParams;