/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import request from 'request-promise-native'
import FileCookieStore from 'file-cookie-store'

// Cookie file and jar container.
const cookies = {
  file: null,
  jar: null
}

// These headers are sent with each request to make us look more like a real browser.
const browserHeaders = {
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8,nl;q=0.7,de;q=0.6,es;q=0.5,it;q=0.4,pt;q=0.3',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive'
}

/**
 * Loads cookies from the specified cookies.txt file (or the default file)
 * and loads them into a jar so that we can make requests with them.
 *
 * If domain and path are set, we will return the number of cookies found
 * in the file for that domain and path combination.
 * This allows you to easily check if a cookie file matches expectations.
 *
 * For correctly making authenticated requests to Mandarake, we need a cookie
 * at domain='order.mandarake.co.jp', path='/', key='session_id'.
 */
export const loadCookies = (cookieOverride, domain = null, path = null, key = null) => (
  new Promise((resolve, reject) => {
    // Cookies exported from the browser in Netscape cookie file format.
    // These are sent with our request to ensure we have access to logged in pages.
    const cookieFile = cookieOverride
    const cookieStore = new FileCookieStore(cookieFile, { no_file_error: true })
    cookies.file = cookieFile
    cookies.jar = request.jar(cookieStore)

    // Check for our desired cookies.
    if (domain && path) {
      cookieStore.findCookie(domain, path, key, (err, result) => (
        result ? resolve() : reject('Could not find cookie')
      ))
    }
    else {
      resolve()
    }
  })
)

/**
 * Removes the previously set cookies file, in case requests as guest are needed.
 */
export const unloadCookies = () => {
  cookies.file = null
  cookies.jar = null
  return true
}

/**
 * Safely requests and returns the HTML for a URL.
 *
 * This mimics a browser request to ensure we don't hit an anti-bot wall.
 */
export const requestAsBrowser = (url, extraHeaders = {}) => (
  request({ url, headers: { ...browserHeaders, ...extraHeaders }, jar: cookies.jar, gzip: true })
)
