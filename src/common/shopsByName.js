/**
 * mdrscr - Mandarake Scraper <https://github.com/msikma/mdrscr>
 * Copyright © 2018, Michiel Sikma
 */

import * as shops from './shops'

// List of shops by their English and Japanese names.
export const shopsByName = {
  en: Object.values(shops).reduce((acc, shop) => ({ ...acc, [shop[1]]: shop[0] }), {}),
  ja: Object.values(shops).reduce((acc, shop) => ({ ...acc, [shop[2]]: shop[0] }), {})
}
