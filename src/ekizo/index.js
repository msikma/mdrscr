/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import { getMandarakeAuctionSearch } from './request'
import { mandarakeAuctionSearchURL } from './urls'

// Default search details. Every search overrides these values.
// The ability to customize these search results is far more limited than the regular site at the moment.
const defaultDetails = {
  // Search query. Unlike regular Mandarake searches, if this is empty we get nothing.
  keyword: '',
  // Limits results to a specific category.
  category: null
}

/**
 * Main entry point. Retrieves the results of an auction search page
 * and returns the information of what's found there.
 */
export const mandarakeAuctionSearch = (searchDetails) => {
  const search = { ...defaultDetails, ...searchDetails }
  const url = mandarakeAuctionSearchURL(search)
  return getMandarakeAuctionSearch(url, search)
}
