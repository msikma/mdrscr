mdrscr - Mandarake Scraper
==========================

A simple scraper library that parses Mandarake search results and returns the items found there.

## Usage

The main export takes an object of search parameters and a language (either `ja` for Japanese or `en` for English; defaults to Japanese).

```js
import mandarakeSearch, { categories } from 'mdrscr'

// Search 'pokemon' in the comics category.
const testSearch = {
  keyword: 'pokemon',
  categoryCode: categories.COMICS[0]
}

const runTest = async () => {
  const items = await mandarakeSearch(testSearch, 'ja')
  console.log(items)
}
```

`mandarakeScraper()` returns a Promise, so if you're not using async/await you can set a `.then()` function instead. Once the Promise resolves, `items` contains an array of search results, e.g.:

```
{ searchDetails:
   { keyword: 'pokemon',
     categoryCode: '1101',
     shop: '0',
     dispAdult: 0,
     soldOut: 1,
     maxPrice: null,
     upToMinutes: 0,
     sort: 'arrival',
     sortOrder: 1,
     dispCount: 240 },
  lang: 'ja',
  url: 'https://order.mandarake.co.jp/order/listPage/list?keyword=pokemon&categoryCode=1101&shop=0&dispAdult=0&soldOut=1&upToMinutes=0&sort=arrival&sortOrder=1&dispCount=240&lang=ja',
  entries:
   [ { title: 'item title',
       itemNo: ['nitem-00XDSDC9', '0181099788'],
       image: 'https://img.mandarake.co.jp/...imagelink.jpg',
       link: 'https://order.mandarake.co.jp/order/...detailpage',
       shop: '福岡店',
       shopCode: '11',
       price: 100,
       isAdult: false,
       inStock: true,
       inStorefront: true },
     /* ...many more... */ ],
  entryCount: 34 }
```

An entry is mostly self-explanatory, but it's worth mentioning that the item number is an array. The first array item is a value that is unique to Mandarake. The second is unique to the item. Every item has a different `itemNo[0]`, but it's possible for multiple items to have the same `itemNo[1]` if they are the same product. Some products do not have a product ID and will have one item in the `itemNo` array only.

The price is always in Yen. `inStock` indicates whether a product is in stock, and `inStorefront` indicates if it is available at a physical Mandarake store. If the latter is true, it could be that someone bought the product since it was entered into the database — this will be checked after you decide to buy it and go to checkout.

## Search parameters

The following parameters can be passed in a search:

| Parameter | Default | Explanation |
| --------- | ------- | ----------- |
| `keyword` | `''` | What to search for. If an empty string, everything is displayed. |
| `categoryCode` | `'00'` | Limits results to a specific category. If `'00'`, all categories are included. |
| `shop` | `'0'` | Limits results to those physically at a specific Mandarake location. Useful for combining items in one shipment. If `'0'`, all shops are included. |
| `dispAdult` | `0` | 0: hide adult items. 1: show adult items. |
| `soldOut` | `1` | 0: show sold out items. 1: hide sold out items. |
| `maxPrice` | `null` | Limits results to a maximum price of n yen. |
| `upToMinutes` | `0` | Limits results to items added n minutes ago. This should be set based on how often you'll scrape. |
| `sort` | `arrival` | Changes the sort method. Not recommended to override. |
| `sortOrder` | `1` | 0: ascending. 1: descending. Not recommended to override. |
| `dispCount` | `240` | How many results to show at most. Not recommended to override. Should be as high as possible so we don't miss anything. |

Most of the time, you probably want to pass only `keyword` and `categoryCode` and leave everything else at their defaults.

## Categories and shops

All of Mandarake's category codes and shop codes are exposed in the `categories` and `shops` exports:

```js
import { categories, shops } from 'mdrscr'
```

Each item is an array containing the internal code, the English name and the Japanese name. For example:

```js
console.log(categories.EVERYTHING)
> ['00', 'Everything', 'すべて']
console.log(shops.UTSUNOMIYA)
> ['28', 'Utsunomiya', '宇都宮店']
```

In a search query, you should always use the code. The labels can be used for making the results human readable later.
There are quite a lot of categories, so have a look in `src/mandarake/categories.js` for the full list.

## Copyright

MIT license.
