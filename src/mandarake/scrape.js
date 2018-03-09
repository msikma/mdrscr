/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import cheerio from 'cheerio'

import { requestAsBrowser } from 'src/util/request'
import * as shops from 'src/mandarake/shops'

// List of shops by their English and Japanese names.
const shopsByName = {
  en: Object.values(shops).reduce((acc, shop) => ({ ...acc, [shop[1]]: shop[0] }), {}),
  ja: Object.values(shops).reduce((acc, shop) => ({ ...acc, [shop[2]]: shop[0] }), {})
}

// Domain for Mandarake mail order site.
export const MANDARAKE_ORDER_BASE = 'https://order.mandarake.co.jp'
// Domain for Mandarake auction site.
export const MANDARAKE_AUCTION_BASE = 'https://ekizo.mandarake.co.jp'
// Returns an item's order page URL using its item code. Necessary for adult items, since they hide the link.
export const ORDER_ITEM = code => `${MANDARAKE_ORDER_BASE}/order/detailPage/item?itemCode=${code}&ref=list`

// Some constant strings and regular expressions for parsing result contents.
const IN_STOCK = { ja: '在庫あります', en: 'In stock' }
const IN_STOREFRONT = { ja: '在庫確認します', en: 'Store Front Item' }
const PRICE = { ja: new RegExp('([0-9]+)円\\+税'), en: new RegExp('([0-9]+) yen') }
const ITEM_NO = new RegExp('(.+?)(\\(([0-9]+)\\))?$')

/**
 * Parses a price string, e.g. '500円+税', and returns only the number.
 */
const parsePrice = (price, lang) => {
  const match = price.match(PRICE[lang])
  return match && Number(match[1])
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
 * Returns the contents of Mandarake search result entries.
 * We scan the contents for the title, image, link, item code, etc.
 */
const parseSearchResults = ($, entries, lang) => {
  return entries.map((n, entry) => {
    // Whether this is an adult item.
    const isAdult = $('.r18item', entry).length > 0

    // Adult items hide the link to the item's detail page.
    // Either generate the link from the item code, or take it from the <a> tag.
    const link = isAdult
      ? ORDER_ITEM($('.adult_link', entry).attr('id').trim())
      : parseLink($('.pic a', entry).attr('href'))

    // If this is an adult item, the image will be in a different place.
    const image = isAdult
      ? $('.pic .r18item img', entry).attr('src')
      : $('.pic img', entry).attr('src')

    const shop = $('.basic .shop', entry).text().trim()
    const shopCode = shopsByName[lang][shop]
    const itemNo = parseItemNo($('.basic .itemno', entry).text().trim())

    // If an item is in stock, it can either be set aside for online ordering,
    // or it can be on display in one of Mandarake's physical stores.
    // In the latter case, 'inStorefront' will be true.
    // If an item is in a physical store, it means the item is available in principle,
    // but could potentially have been bought since it was entered into the database.
    const stockStatus = $('.basic .stock', entry).text().trim()
    const inStock = stockStatus === IN_STOCK[lang] || stockStatus === IN_STOREFRONT[lang]
    const inStorefront = stockStatus === IN_STOREFRONT[lang]

    const title = $('.title a', entry).text().trim()
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
  }).get()
}

/**
 * Main search result object. Most of the work is done in the parseSearchResults() function.
 */
const parseMandarakeSearch = ($, url, searchDetails, lang) => {
  const entries = parseSearchResults($, $('.entry .thumlarge .block'), lang)

  return {
    searchDetails,
    lang,
    url,
    entries,
    entryCount: entries.length
  }
}

/**
 * Main entry point for the search result scraping code.
 * This loads the given URL's HTML and parses the contents, returning the results as structured objects.
 */
export const fetchMandarakeSearch = async (url, searchDetails, lang) => {
  const html = await requestAsBrowser(url)
  const $html = cheerio.load(html)
  return parseMandarakeSearch($html, url, searchDetails, lang)
}
