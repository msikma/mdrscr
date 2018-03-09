'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shops = exports.categories = exports.default = undefined;

var _mandarake = require('./mandarake');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _mandarake.mandarakeSearch;
  }
});

var _categories = require('./mandarake/categories');

var categories = _interopRequireWildcard(_categories);

var _shops = require('./mandarake/shops');

var shops = _interopRequireWildcard(_shops);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.categories = categories;
exports.shops = shops;