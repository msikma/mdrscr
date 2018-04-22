/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import requestAsBrowser from 'requestAsBrowser'
import cookie from '../util/cookies'

import { fetchMandarakeAuctionSearch } from './scrape'

/**
 * This loads the auction URL's HTML and calls the parser to extract the info.
 */
export const getMandarakeAuctionSearch = async (url, searchDetails) => {
  const data = await requestAsBrowser(url, cookie.jar)
  return fetchMandarakeAuctionSearch(data.body, url, searchDetails)
}
