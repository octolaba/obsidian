---
uid: 9056ae76-02d5-511c-b84a-92c5dfd71aca
xid:
  - unirate-currency
aliases:
  - unirate-currency
  - UniRate Currency
  - unirate-api/obsidian-currency
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/unirate-currency
alt:
  - https://github.com/unirate-api/obsidian-currency
downloads: 114
updated at: "2026-05-11T06:22:59Z"
related to:
  - "[[GitHub - 1235237231]]"
remind me:
---

# UniRate Currency

Puts live or historical exchange rates into a note through inline code, where usd:eur yields a rate and usd:eur:100 converts an amount. More than 170 currencies and major cryptocurrencies are covered through UniRateAPI, with daily history back to 1999 on the Pro tier. A modal insertion command and a selection conversion command are provided, and rates are cached for sixty minutes.

```cue
plugin: {
    id:     "unirate-currency"
    name:   "UniRate Currency"
    author: "unirate-api"
    repo:   "unirate-api/obsidian-currency"

    html_url:    "https://community.obsidian.md/plugins/unirate-currency"
    github_url:  "https://github.com/unirate-api/obsidian-currency"
    description: "Inline live and historical currency exchange rates. Type `usd:eur` in a note to see the rate; type `usd:eur:100` to convert. 170+ currencies and crypto via UniRateAPI. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Insert live or historical currency exchange rates directly into notes using inline code like usd:eur or usd:eur:100. Support 170+ currencies and major cryptocurrencies, provide daily history back to 1999 on Pro, offer modal insertion and selection conversion commands, and cache rates for 60 minutes."

    stats: {
        downloads:  114
        updated_at: 1778480579000
    }
}
```

[^template]: [[Obsidian plugin]]
