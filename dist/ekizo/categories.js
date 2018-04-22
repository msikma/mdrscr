'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

// Note that the categories are not strictly the same as on the order site.
// The auction site is only available in Japanese.
var ANIME_CELS = exports.ANIME_CELS = ['anime_cels', 'アニメ/セル画'];
var MANGA_BOOKS = exports.MANGA_BOOKS = ['manga-books', '本'];
var MANGA_BEFORE_1965 = exports.MANGA_BEFORE_1965 = ['manga_before_1965', '新書以前'];
var MANGA_AFTER_1965 = exports.MANGA_AFTER_1965 = ['manga_after_1965', '新書以降'];
var FUROKU = exports.FUROKU = ['furoku', '付録'];
var MAGAZINES = exports.MAGAZINES = ['magazines', '雑誌'];
var MOOK = exports.MOOK = ['mook', 'ムック・画集'];
var CULTURE = exports.CULTURE = ['culture', 'サブカルチャー'];
var SPIRITUAL = exports.SPIRITUAL = ['spiritual', '精神世界'];
var BUNGEI_SF = exports.BUNGEI_SF = ['bungei-sf', '文芸・ジュブナイル・絵本児童書'];
var ART_DESIGN_PHOTO = exports.ART_DESIGN_PHOTO = ['art-design-photo', 'アート・写真・建築・ファッション'];
var MUSIC = exports.MUSIC = ['music', '音楽・演劇'];
var BOOKS_OTHERS = exports.BOOKS_OTHERS = ['books-others', 'その他'];
var TOYS = exports.TOYS = ['toys', 'TOY'];
var SOFT_VINYL = exports.SOFT_VINYL = ['soft_vinyl', 'ソフビ'];
var PLAMO = exports.PLAMO = ['plamo', 'プラモデル'];
var GOKIN = exports.GOKIN = ['gokin', '合金・模型'];
var PLASTIC_TOYS = exports.PLASTIC_TOYS = ['plastic_toys', 'プラトイ'];
var AMETOY = exports.AMETOY = ['ametoy', 'アメトイ'];
var NORIMONO = exports.NORIMONO = ['norimono', '乗り物TOY'];
var TETSU = exports.TETSU = ['tetsu', '鉄道グッズ'];
var DOLL = exports.DOLL = ['doll', 'ドール'];
var ERASER_TOY = exports.ERASER_TOY = ['eraser_toy', 'ミクロ・消しゴム'];
var KONPEITO = exports.KONPEITO = ['konpeito', 'こんぺいとう(紙もの・おまけ)'];
var TIN_TOY = exports.TIN_TOY = ['tin_toy', 'ブリキ・戦前おもちゃ等'];
var NOVELTY = exports.NOVELTY = ['novelty', '企業もの'];
var AV = exports.AV = ['av', 'CD・DVD・VHS'];
var RECORD = exports.RECORD = ['record', 'レコード'];
var TOYS_OTHERS = exports.TOYS_OTHERS = ['toys-others', 'その他'];
var ANIME_CEL = exports.ANIME_CEL = ['anime_cel', 'アニメ/セル画'];
var ANIME_CEL_OTHERS = exports.ANIME_CEL_OTHERS = ['anime_cel-others', 'その他'];
var SCRIPTS = exports.SCRIPTS = ['scripts', '台本'];
var ANIME = exports.ANIME = ['anime', 'アニメ'];
var TOKUSATSU = exports.TOKUSATSU = ['tokusatsu', '特撮'];
var MOVIE_SCRIPTS = exports.MOVIE_SCRIPTS = ['movie_scripts', '映画'];
var DORAMA_SCRIPTS = exports.DORAMA_SCRIPTS = ['dorama_scripts', 'ドラマ'];
var SCRIPTS_OTHERS = exports.SCRIPTS_OTHERS = ['scripts-others', 'その他'];
var ORIGINAL_ART = exports.ORIGINAL_ART = ['original_art', 'ギャラリー'];
var SKETCHES_DRAFTS = exports.SKETCHES_DRAFTS = ['sketches-drafts', '原画・原稿'];
var SHIKISHI = exports.SHIKISHI = ['shikishi', '色紙'];
var BOOKS_WITH_AUTOGRAPHS = exports.BOOKS_WITH_AUTOGRAPHS = ['books_with_autographs', 'サイン本'];
var ORIGINAL_ART_OTHERS = exports.ORIGINAL_ART_OTHERS = ['original_art-others', 'その他'];
var CARDS = exports.CARDS = ['cards', 'カード'];
var BIKKURIMAN = exports.BIKKURIMAN = ['bikkuriman', 'シール'];
var VIN_CARDS = exports.VIN_CARDS = ['vin_cards', 'ヴィンテージカード'];
var TRADING_CARDS = exports.TRADING_CARDS = ['trading_cards', 'トレーディングカード'];
var TRADING_CARD_GAMES = exports.TRADING_CARD_GAMES = ['trading_card_games', 'トレーディングカードゲーム'];
var TELEPHONE_CARDS = exports.TELEPHONE_CARDS = ['telephone_cards', 'テレホンカード'];
var CARDDAS = exports.CARDDAS = ['carddas', 'カードダス'];
var SHITAJIKI = exports.SHITAJIKI = ['shitajiki', '下敷き'];
var LAMINATE_CARD = exports.LAMINATE_CARD = ['laminate_card', 'ラミネートカード'];
var CLEAR_FILE = exports.CLEAR_FILE = ['clear_file', 'クリアファイル'];
var CARDS_OTHERS = exports.CARDS_OTHERS = ['cards-others', 'その他'];
var GEINO = exports.GEINO = ['geino', '芸能'];
var GEINO_IPPAN = exports.GEINO_IPPAN = ['geino-ippan', '芸能タレント一般'];
var GEINO_IDOL_MALE = exports.GEINO_IDOL_MALE = ['geino-idol-male', '男性アイドル'];
var GEINO_IDOL_FEMALE = exports.GEINO_IDOL_FEMALE = ['geino-idol-female', '女性アイドル'];
var GEINO_SEIYU = exports.GEINO_SEIYU = ['geino-seiyu', '声優'];
var GEINO_TAKARAZUKA = exports.GEINO_TAKARAZUKA = ['geino-takarazuka', '宝塚'];
var POSTERS = exports.POSTERS = ['posters', 'ポスター'];
var DOUJINSHI = exports.DOUJINSHI = ['doujinshi', '同人'];
var HENTAI_DOUJINSHI = exports.HENTAI_DOUJINSHI = ['hentai_doujinshi', '男性同人誌'];
var YAOI_DOUJINSHI = exports.YAOI_DOUJINSHI = ['yaoi_doujinshi', '女性同人誌'];
var SHIRYO_DOUJINSHI = exports.SHIRYO_DOUJINSHI = ['shiryo_doujinshi', '資料系同人誌'];
var NORMAL_DOUJINSHI = exports.NORMAL_DOUJINSHI = ['normal_doujinshi', 'その他'];
var OTHERS = exports.OTHERS = ['others', 'その他'];
var COSPLAY = exports.COSPLAY = ['cosplay', 'コスプレ'];
var BASEBALL_GOODS = exports.BASEBALL_GOODS = ['baseball_goods', '野球'];