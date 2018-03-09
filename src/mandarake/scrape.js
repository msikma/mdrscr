/**
 * mdrscr - Mandarake Scraper <https://bitbucket.org/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import cheerio from 'cheerio'
import { requestAsBrowser } from 'src/util/request'

const MANDARAKE_BASE = 'https://order.mandarake.co.jp'
const IN_STOCK = { ja: '在庫あります', en: 'In stock' }
const PRICE = { ja: new RegExp('([0-9]+)円\\+税'), en: new RegExp('([0-9]+) yen') }
const ITEM_NO = new RegExp('(.+?)\\(([0-9]+)\\)')

const parsePrice = (price, lang) => {
  const match = price.match(PRICE[lang])
  return match && Number(match[1])
}

const parseLink = (url) => (
  `${url.startsWith('/') ? MANDARAKE_BASE : ''}${url}`
)

const parseItemNo = (itemNo) => {
  const match = itemNo.match(ITEM_NO)
  return match && [match[1], match[2]].map(str => str.trim())
}

const parseSearchResults = ($, entries, lang) => {
  return entries.map((n, entry) => {
    const image = $('.pic img', entry).attr('src')
    const link = parseLink($('.pic a', entry).attr('href'))
    const shop = $('.basic .shop', entry).text().trim()
    const itemNo = parseItemNo($('.basic .itemno', entry).text().trim())
    const inStock = $('.basic .stock', entry).text().trim() === IN_STOCK[lang]
    const title = $('.title a', entry).text().trim()
    const price = parsePrice($('.price', entry).text().trim(), lang)

    return {
      image,
      link,
      shop,
      itemNo,
      inStock,
      title,
      price
    }
  }).get()
}

const parseMandarakeSearch = ($, searchDetails, lang) => {
  const entries = parseSearchResults($, $('.entry .thumlarge .block'), lang)

  return {
    searchDetails,
    lang,
    entries
  }
}

export const fetchMandarakeSearch = async (url, searchDetails, lang) => {
  const html = await requestAsBrowser(url)
  const $html = cheerio.load(html)
  return parseMandarakeSearch($html, searchDetails, lang)
}
