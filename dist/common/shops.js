'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

var ALL_STORES = exports.ALL_STORES = ['0', 'All stores', 'すべて']; // Also called '全店舗'
var SAHRA = exports.SAHRA = ['55', 'SAHRA', 'SAHRA'];
var NAKANO = exports.NAKANO = ['1', 'Nakano', '中野店'];
var COMPLEX = exports.COMPLEX = ['30', 'Complex', 'コンプレックス'];
var SHIBUYA = exports.SHIBUYA = ['6', 'Shibuya', '渋谷店'];
var IKEBUKURO = exports.IKEBUKURO = ['26', 'Ikebukuro', '池袋店'];
var NAGOYA = exports.NAGOYA = ['4', 'Nagoya', '名古屋店'];
var UTSUNOMIYA = exports.UTSUNOMIYA = ['28', 'Utsunomiya', '宇都宮店'];
var UMEDA = exports.UMEDA = ['7', 'Umeda', 'うめだ店'];
var GRANDCHAOS = exports.GRANDCHAOS = ['23', 'Grandchaos', 'グランドカオス'];
var FUKUOKA = exports.FUKUOKA = ['11', 'Fukuoka', '福岡店'];
var KOKURA = exports.KOKURA = ['29', 'Kokura', '小倉店'];
var SAPPORO = exports.SAPPORO = ['27', 'Sapporo', '札幌店'];

// Not really shops, but shown in the same list on the auctions site.
// English names are unofficial, since the auction site only exists in Japanese.
var DAILY_AUCTIONS = exports.DAILY_AUCTIONS = ['-14', 'Daily Auctions', '毎日オークション'];
var GREAT_AUCTION_TOURNAMENT = exports.GREAT_AUCTION_TOURNAMENT = ['14', 'Great Auction Tournament', '大オークション大会'];