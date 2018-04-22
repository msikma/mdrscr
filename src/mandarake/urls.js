/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import { objToParams } from '../util/query'

// Domain for Mandarake mail order site.
export const MANDARAKE_ORDER_BASE = 'https://order.mandarake.co.jp'
// Mandarake mail order site.
export const MANDARAKE_ORDER_URL = `${MANDARAKE_ORDER_BASE}/order/listPage/list`
// Page URL for a Mandarake user's favorites list.
export const MANDARAKE_FAVS_URL = `${MANDARAKE_ORDER_BASE}/order/MyPage/favoritesList`

// Returns an item's order page URL using its item code. Necessary for adult items, since they hide the link.
export const mandarakeOrderURL = code => `${MANDARAKE_ORDER_BASE}/order/detailPage/item?itemCode=${code}&ref=list`

// Returns the URL we need to scrape the user's favorites.
export const mandarakeFavoritesURL = lang => `${MANDARAKE_FAVS_URL}?${objToParams({ lang })}`

// Returns the URL we need to scrape a search request.
export const mandarakeSearchURL = (searchDetails, lang) => (
  `${MANDARAKE_ORDER_URL}?${objToParams({ ...searchDetails, lang })}`
)
