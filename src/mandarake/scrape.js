/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import cheerio from 'cheerio'
import { flattenDeep } from 'lodash'

import { shopsByName } from '../common/shopsByName'
import { getExtendedInfo, getMultiplePages } from './request'
import { MANDARAKE_ORDER_BASE, mandarakeOrderURL } from './urls'

// Some constant strings and regular expressions for parsing result contents.
const IN_STOCK = { ja: '在庫あります', en: 'In stock' }
const IN_STOREFRONT = { ja: '在庫確認します', en: 'Store Front Item' }
const PRICE = { ja: new RegExp('([0-9,]+)円(\\+税)?'), en: new RegExp('([0-9,]+) yen') }
const ITEM_NO = new RegExp('(.+?)(\\(([0-9-]+)\\))?$')

/**
 * Parses a price string, e.g. '500円+税', '1,000円+税' and returns only the number.
 */
const parsePrice = (price, lang) => {
  const match = price.match(PRICE[lang])
  return match && Number(match[1].replace(',', ''))
}

/**
 * Attaches the base URL to a link if it's not an absolute link.
 */
const parseLink = (url) => (
  `${!url.startsWith('http') ? MANDARAKE_ORDER_BASE : ''}${url}`
)

/**
 * Splits up an item number string.
 * e.g. 'cmp-4ftk-00XDSDC9 (0181099788)' becomes [ 'cmp-4ftk-00XDSDC9', '0181099788' ].
 * As noted in the readme, the first is the Mandarake unique ID, and the second is a product specific ID.
 */
const parseItemNo = (itemNo) => {
  const match = itemNo.match(ITEM_NO)
  // In most cases, we have both the Mandarake ID and the product ID.
  if (match && match[3]) {
    return [match[1], match[3]].map(str => str.trim())
  }
  // Otherwise, return only the Mandarake ID.
  else if (match && match[1]) {
    return [match[1].trim()]
  }
  // I'm not aware of IDs that don't match either of the above choices.
  // But if there is, it's probably best to just return the input string as an array.
  return [itemNo]
}

/**
 * Parses a string containing the item's location (shop).
 * Some shops have an additional indicator, e.g. "中野店 他1店".
 */
const parseShop = (shopString, lang) => {
  const shop = shopString.split(' ')
  const shopCode = shopsByName[lang][shop[0]]
  return { shop, shopCode }
}

/**
 * Retrieves all pertinent information for one single item.
 */
const parseSingleSearchResult = ($, lang) => (n, entry) => {
  // Whether this is an adult item.
  const isAdult = $('.r18item', entry).length > 0

  // Adult items hide the link to the item's detail page.
  // Either generate the link from the item code, or take it from the <a> tag.
  const link = isAdult
    ? mandarakeOrderURL($('.adult_link', entry).attr('id').trim())
    : parseLink($('.pic a', entry).attr('href'))

  // If this is an adult item, the image will be in a different place.
  const image = isAdult
    ? $('.pic .r18item img', entry).attr('src').trim()
    : $('.pic img', entry).attr('src').trim()

  const { shop, shopCode } = parseShop($('.basic .shop', entry).text().trim(), lang)
  const itemNo = parseItemNo($('.basic .itemno', entry).text().trim())

  // If an item is in stock, it can either be set aside for online ordering,
  // or it can be on display in one of Mandarake's physical stores.
  // In the latter case, 'inStorefront' will be true.
  // If an item is in a physical store, it means the item is available in principle,
  // but could potentially have been bought since it was entered into the database.
  const stockStatus = $('.basic .stock', entry).text().trim()
  const inStock = stockStatus === IN_STOCK[lang] || stockStatus === IN_STOREFRONT[lang]
  const inStorefront = stockStatus === IN_STOREFRONT[lang]

  // On the search results page, titles are inside an <a> tag. Otherwise, a <p>.
  const titleLink = $('.title a', entry).text().trim()
  const titleParagraph = $('.title p', entry).text().trim()
  const title = titleLink || titleParagraph
  const price = parsePrice($('.price', entry).text().trim(), lang)

  return {
    title,
    itemNo,
    image,
    link,
    shop,
    shopCode,
    price,
    isAdult,
    inStock,
    inStorefront
  }
}

/**
 * Parses and returns the contents of favorites from an array of pages.
 * The array that we expect here is an array of Cheerio objects.
 *
 * We're returning the same data that we send for a search result page.
 * For favorites, we still need to request additional data.
 */
const parseFavoritesItems = (pagesArr$, lang) => (
  flattenDeep(pagesArr$.map($ => $('.content .block').map(parseSingleSearchResult($, lang)).get()))
)

/**
 * Returns the URLs to other favorites pages.
 */
const findFavoritesPages = ($) => (
  $('.content .pager .numberlist li a')
    // Filter out the current page.
    .filter((n, el) => !!$(el).attr('href'))
    .map((n, el) => `${MANDARAKE_ORDER_BASE}${$(el).attr('href')}`)
    .get()
)

/**
 * Parse a single detail page and return extended info only.
 * This naturally assumes that we already have the item's basic info.
 */
export const parseSingleDetailExtended = (html, lang) => {
  const $ = cheerio.load(html)
  const otherShopNames = $('.other_itemlist .shop').map((n, el) => $(el).text().trim()).get()
  const otherShops = otherShopNames.map(shop => ({ shop, shopCode: shopsByName[lang][shop] }))
  return {
    otherShops
  }
}

/**
 * Loads the given HTML for a search page and parses its contents, returning the results as structured objects.
 */
export const fetchMandarakeSearch = async (html, url, searchDetails, lang) => {
  const $ = cheerio.load(html)
  const entries = $('.entry .thumlarge .block').map(parseSingleSearchResult($, lang)).get()

  return {
    searchDetails,
    lang,
    url,
    entries,
    entryCount: entries.length
  }
}

/**
 * Fetches the currently logged in user's favorites list and returns
 * all items found there. Note that this could take quite a long time to complete,
 * depending on how many pages there are. We will try to request multiple
 * pages at the same time, but not too many.
 */
export const fetchMandarakeFavorites = async (html, lang, addExtendedInfo = false, progressCb = null) => {
  const $main = cheerio.load(html)

  // Check whether we're logged in or not. This is mandatory to fetch favorites.
  const notLoggedIn = html.indexOf('body class="login"') > -1
  if (notLoggedIn) {
    throw new TypeError('Not logged in')
  }

  // Find out how many other pages there are, and request them too.
  const otherURLs = findFavoritesPages($main)
  const otherPages = await getMultiplePages(otherURLs)
  const otherCh = otherPages.map(html => cheerio.load(html))

  // Parse all main info from all items. This is the same as the search results data.
  const basicInfo = parseFavoritesItems([$main, ...otherCh], lang)

  // Return basic info only if we don't need extended shop availability information.
  if (!addExtendedInfo) return basicInfo

  // Now that we have the basic info, we need to actually request every single item URL
  // in order to find out which stores the item is in.
  // This data is only available on the detail page, and it's crucial for determining
  // the most efficient shopping list.
  return getExtendedInfo(basicInfo, lang, progressCb)
}
