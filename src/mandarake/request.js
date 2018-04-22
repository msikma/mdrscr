/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import requestAsBrowser from 'requestAsBrowser'
import cookie from '../util/cookies'

import { parseSingleDetailExtended, fetchMandarakeFavorites, fetchMandarakeSearch } from './scrape'

/**
 * Fetches the extended info for all items.
 */
export const getExtendedInfo = async (items, lang = 'ja', progressCb = null) => {
  const urls = items.map(item => item.link)
  const html = await getMultiplePages(urls, progressCb)
  return items.map((item, n) => ({ ...item, ...parseSingleDetailExtended(html[n], lang) }))
}

/**
 * Returns the HTML for an array of pages, resolving when they are all ready.
 * Used to fetch e.g. all pages in one's favorites list.
 */
export const getMultiplePages = (urls, progressCb = null) => {
  let downloaded = 0
  let total = urls.length

  return Promise.all(urls.map(url => (
    new Promise(async (resolve) => {
      const pageContent = await requestAsBrowser(url, cookie.jar)
      if (progressCb) progressCb(++downloaded, total)
      return resolve(pageContent.body)
    })
  )))
}

/**
 * Main entry point for the search result scraping code.
 * This loads the given URL's HTML and parses the contents, returning the results as structured objects.
 */
export const getMandarakeSearch = async (url, searchDetails, lang) => {
  const data = await requestAsBrowser(url, cookie.jar)
  return fetchMandarakeSearch(data.body, url, searchDetails, lang)
}

/**
 * Retrieves the favorites URL and parses its contents.
 */
export const getMandarakeFavorites = async (url, lang, addExtendedInfo = false, progressCb = null) => {
  const data = await requestAsBrowser(url, cookie.jar)
  return fetchMandarakeFavorites(data.body, lang, addExtendedInfo, progressCb)
}
