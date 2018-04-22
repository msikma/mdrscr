/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import cheerio from 'cheerio'

import { shopsByName } from '../common/shopsByName'
import { MANDARAKE_AUCTION_PATH, mandarakeAuctionObjectURL } from './urls'

// Parser for Japanese time durations.
const reTime = new RegExp('(([0-9]+)日)?(([0-9]+)時間)?(([0-9]+)分)?')

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
  const matches = timeStr.match(reTime)
  const days = matches[2] ? matches[2] : '0'
  const hours = matches[4] ? matches[4] : '0'
  const minutes = matches[6] ? matches[6] : '0'

  return {
    days: parseInt(days, 10),
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    formattedTime: `${padToTwo(hours)}:${padToTwo(minutes)}`
  }
}

/**
 * Attaches the base URL to a link if it's not an absolute link.
 */
const parseLink = (url) => (
  `${!url.startsWith('http') ? MANDARAKE_AUCTION_PATH : ''}${url}`
)

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
  const categories = $('#aucItemCategoryItems a', entry).get().map(cat => $('#name', cat).text().trim())
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
  const entries = $('#itemListLayout .block').map(parseSearchResult($)).get()

  return {
    searchDetails,
    lang: 'ja',
    url,
    entries,
    entryCount: entries.length
  }
}
