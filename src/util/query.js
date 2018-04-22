/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

/**
 * Converts an object of key/value pairs to URI params.
 */
export const objToParams = (obj) => Object.keys(obj)
  // Filter out null, undefined and empty strings, but keep 0.
  .filter(k => obj[k] != null && obj[k] !== '')
  // Encode to URI components.
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
  .join('&')
