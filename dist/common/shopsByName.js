'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shopsByName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _shops = require('./shops');

var shops = _interopRequireWildcard(_shops);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// List of shops by their English and Japanese names.
var shopsByName = exports.shopsByName = {
  en: Object.values(shops).reduce(function (acc, shop) {
    return _extends({}, acc, _defineProperty({}, shop[1], shop[0]));
  }, {}),
  ja: Object.values(shops).reduce(function (acc, shop) {
    return _extends({}, acc, _defineProperty({}, shop[2], shop[0]));
  }, {})
};