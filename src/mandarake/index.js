/**
 * mdrscr - Mandarake Scraper <https://bitbucket.org/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import { fetchMandarakeSearch } from 'src/mandarake/scrape'

const orderURL = 'https://order.mandarake.co.jp/order/listPage/list?'
const auctionURL = 'https://ekizo.mandarake.co.jp/auction/item/itemsListEn.html?category=plamo'

/**
 * Converts an object of key/value pairs to URI params.
 */
const objToParams = (obj) => Object.keys(obj)
  .filter(k => obj[k] != null)
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
  .join('&')

/**
 * Returns the URL we need to scrape a search request.
 */
const mandarakeURL = (searchDetails, lang) => (
  `${orderURL}${objToParams({ ...searchDetails, lang })}`
)

/**
 * Main entry point. Scrapes the Mandarake link, then prints its information,
 * then downloads the files.
 */
export const downloadMandarakeURL = (searchDetails, lang) => {
  const url = mandarakeURL(searchDetails, lang)
  return fetchMandarakeSearch(url, searchDetails, lang)
}
