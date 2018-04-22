/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import { loadCookieFile } from 'requestAsBrowser'

// Container for our cookies.
const cookie = {
  jar: null
}

/**
 * Loads a cookie file to use for every request.
 * For correctly making authenticated requests to Mandarake, we need a cookie
 * at domain='order.mandarake.co.jp', path='/', key='session_id'.
 */
export const loadCookies = async (file) => {
  cookie.jar = (await loadCookieFile(file)).jar
}

/**
 * Unloads previously loaded cookies to send clean requests again.
 */
export const unloadCookies = () => {
  cookie.jar = null
}

export default cookie
