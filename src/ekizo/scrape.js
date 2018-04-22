/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import cheerio from 'cheerio'

import { shopsByName } from '../common/shopsByName'
import { MANDARAKE_AUCTION_PATH, mandarakeAuctionObjectURL } from './urls'

// Parser for Japanese time durations and category slugs.
const reTime = new RegExp('(([0-9]+)日)?(([0-9]+)時間)?(([0-9]+)分)?')
const reCat = new RegExp('itemsListJa\\.html\\?category=(.+?)$')

// Parses a price string. Just removes commas and cast to number.
const parsePrice = priceStr => parseInt(priceStr.split(',').join(''), 10)

// Adds a '0' in front of a string if it is length 1. Used for time formatting.
const padToTwo = str => str.length === 1 ? `0${str}` : str

/**
 * Parses the amount of time left for an auction and returns the result as a locale-independent string.
 * Durations can have three variables: days (日), hours (時間) and minutes (分).
 * An example: '13日18時間3分'. All numbers are regular width.
 */
const parseTimeLeft = (timeStr) => {
  if (timeStr === '入札開始前') {
    return { type: 'pre-bidding' }
  }
  const matches = timeStr.match(reTime)
  const days = matches[2] ? matches[2] : '0'
  const hours = matches[4] ? matches[4] : '0'
  const minutes = matches[6] ? matches[6] : '0'

  return {
    days: parseInt(days, 10),
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    formattedTime: `${hours}:${padToTwo(minutes)}`
  }
}

/**
 * Attaches the base URL to a link if it's not an absolute link.
 */
const parseLink = (url) => (
  `${!url.startsWith('http') ? MANDARAKE_AUCTION_PATH : ''}${url}`
)

/**
 * If needed, we remove some items from the search query if we have both a query and a category.
 * If both are passed, the site will ignore the category altogether. So we need to do the filtering ourselves.
 */
const filterIfNeeded = (entries, searchDetails) => {
  // Only continue if we have both a query and category.
  if (!searchDetails.q || !searchDetails.category) {
    return entries
  }
  // Filter the entries by category.
  const categorySlug = searchDetails.category
  return entries.filter(entry => {
    const entrySlugs = entry.categories.map(c => c.slug)
    return entrySlugs.indexOf(categorySlug) > -1
  })
}

/**
 * Returns the category from a link, e.g. 'itemsListJa.html?category=anime_cels' returns 'anime_cels'.
 */
const parseCategoryHref = (href) => {
  const matches = href.match(reCat)
  return matches[1] ? matches[1] : null
}

/**
 * Parses a single search result found on an auction search result page.
 */
const parseSearchResult = ($) => (n, entry) => {
  const title = $('#itemName', entry).text().trim()
  const itemNo = $('#itemNo', entry).text().trim()
  const link = parseLink($('#goItemInfo', entry).attr('href'))
  const image = $('#thumbnail', entry).attr('src')
  const auctionType = $('#auctionName', entry).text().trim()
  const shop = $('#isNotAucFesta .shop', entry).text().trim()
  const shopCode = shopsByName['ja'][shop]
  const categories = $('#aucItemCategoryItems a', entry).get().map(cat => ({
    name: $('#name', cat).text().trim(),
    slug: parseCategoryHref($(cat).attr('href'))
  }))
  const currentPrice = parsePrice($('#nowPrice', entry).text().trim())
  const startingPrice = parsePrice($('#startPrice', entry).text().trim())
  const bids = parseInt($('#bidCount', entry).text().trim(), 10)
  const watchers = parseInt($('#watchCount', entry).text().trim(), 10)
  const timeLeft = parseTimeLeft($('#strTimeLeft', entry).text().trim())

  return {
    title,
    itemNo,
    link,
    image,
    auctionType,
    shop: shop ? shop : null,
    shopCode: shopCode ? shopCode : null,
    categories,
    currentPrice,
    startingPrice,
    bids,
    watchers,
    timeLeft
  }
}

/**
 * Parses the contents of an auction search page HTML.
 */
export const fetchMandarakeAuctionSearch = async (html, url, searchDetails) => {
  const $ = cheerio.load(html)
  const entriesUnfiltered = $('#itemListLayout .block').map(parseSearchResult($)).get()

  // If we have both a query and a category, the site will only honor the query.
  // The category will be ignored. Thus we need to run through our search results
  // manually to remove items from the wrong category.
  const entries = filterIfNeeded(entriesUnfiltered, searchDetails)

  return {
    searchDetails,
    lang: 'ja',
    url,
    entries,
    entryCount: entries.length
  }
}
