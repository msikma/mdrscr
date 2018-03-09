/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import { MANDARAKE_ORDER_BASE, MANDARAKE_AUCTION_BASE, fetchMandarakeSearch } from './scrape'
import { EVERYTHING } from './categories'
import { ALL_STORES } from './shops'

// Mandarake mail order site.
const orderURL = `${MANDARAKE_ORDER_BASE}/order/listPage/list?`
// Mandarake auction site.
const auctionURL = `${MANDARAKE_AUCTION_BASE}/auction/item/itemsListEn.html?category=plamo`

// Default search details. Every search overrides these values.
// You can change anything, but it's not recommended to change 'sort', 'sortOrder' and 'dispCount'.
const defaultDetails = {
  // What to search for. If empty, everything is displayed.
  keyword: '',
  // Limits results to a specific category.
  categoryCode: EVERYTHING[0],
  // Limits results to those physically at a specific Mandarake location.
  // Useful for combining items in one shipment.
  shop: ALL_STORES[0],
  // 0: hide adult items. 1: show adult items.
  dispAdult: 0,
  // 0: show sold out items. 1: hide sold out items.
  soldOut: 1,
  // Limits results to a maximum price of n yen.
  maxPrice: null,
  // Limits results to items added n minutes ago.
  // This should be set based on how often the bot runs.
  upToMinutes: 0, // eventually, set to 360
  // Changes the sort order. Not recommended to override.
  sort: 'arrival',
  // 0: ascending. 1: descending. Not recommended to override.
  sortOrder: 1,
  // How many results to show at most. Not recommended to override.
  // Should be as high as possible so we don't miss anything.
  dispCount: 240
}

/**
 * Converts an object of key/value pairs to URI params.
 */
const objToParams = (obj) => Object.keys(obj)
  // Filter out null, undefined and empty strings, but keep 0.
  .filter(k => obj[k] != null && obj[k] !== '')
  // Encode to URI components.
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
  .join('&')

/**
 * Returns the URL we need to scrape a search request.
 */
const mandarakeSearchURL = (searchDetails, lang) => (
  // Converts our search parameters to a query string.
  `${orderURL}${objToParams({ ...searchDetails, lang })}`
)

/**
 * Main entry point. Scrapes Mandarake's search results and returns info for the items found.
 * Search details are merged with our defaults first, and 'lang' defaults to Japanese if not set.
 */
export const mandarakeSearch = (searchDetails, lang = 'ja') => {
  const search = { ...defaultDetails, ...searchDetails }
  const url = mandarakeSearchURL(search, lang)
  return fetchMandarakeSearch(url, search, lang)
}
