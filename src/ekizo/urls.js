/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import { objToParams } from '../util/query'

// Domain for Mandarake auction site.
export const MANDARAKE_AUCTION_BASE = 'https://ekizo.mandarake.co.jp'
// The path in which all important pages are found.
export const MANDARAKE_AUCTION_PATH = `${MANDARAKE_AUCTION_BASE}/auction/item/`
// Mandarake auction index page.
export const MANDARAKE_AUCTION_INDEX = `${MANDARAKE_AUCTION_PATH}itemsListJa.html`

// Returns the URL for single item.
export const mandarakeAuctionObjectURL = id => `${MANDARAKE_AUCTION_INDEX}?index=${id}`

// Returns the URL for an auction search request.
export const mandarakeAuctionSearchURL = (searchDetails) => {
  // 'keyword' is accepted for consistency with the main search, but the URL
  // requires it be named 'q'.
  const searchDetailsCopy = { ...searchDetails }
  searchDetailsCopy.q = searchDetailsCopy.keyword
  delete searchDetailsCopy.keyword
  
  return `${MANDARAKE_AUCTION_INDEX}?${objToParams({ ...searchDetailsCopy })}`
}
