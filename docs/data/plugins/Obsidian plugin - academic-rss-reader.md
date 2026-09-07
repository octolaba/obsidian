---
uid: 6381ad7e-e77a-5fa4-8a12-72b5c4c5fe9d
xid:
  - academic-rss-reader
aliases:
  - academic-rss-reader
  - Academic RSS Reader
  - apoclyreol/Academic_RSS_Reader-Obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/academic-rss-reader
alt:
  - https://github.com/apoclyreol/Academic_RSS_Reader-Obsidian
downloads: 84
updated at: "2026-08-02T02:23:14Z"
related to:
  - "[[GitHub - 1314710033]]"
remind me:
---

# Academic RSS Reader

Manages academic RSS feeds locally, importing subscriptions from OPML or a URL and extracting title, authors, journal, year, DOI, link and abstract from each item, deduplicated by GUID. Items are screened through five baskets: unread, interested, archived, hidden and expired. Recommendations are computed with TF-IDF and logistic regression alongside keyword rules and review by an OpenAI-compatible model, with keyword relevance shown in color and interest analyzed per subscription. Cached translation of titles is optional.

```cue
plugin: {
    id:     "academic-rss-reader"
    name:   "Academic RSS Reader"
    author: "apocly"
    repo:   "apoclyreol/Academic_RSS_Reader-Obsidian"

    html_url:    "https://community.obsidian.md/plugins/academic-rss-reader"
    github_url:  "https://github.com/apoclyreol/Academic_RSS_Reader-Obsidian"
    description: "在 Obsidian 中订阅、阅读和整理学术 RSS 文献。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Manage academic RSS feeds and screen literature locally, importing OPML/URLs and extracting title, authors, journal, year, DOI, link and abstract with GUID-based deduplication and five review baskets (unread, interested, archived, hidden, expired). Get personalized recommendations via TF-IDF and logistic regression with keyword and OpenAI-compatible LLM review, view colored keyword relevance and per-subscription interest analysis, and enable optional cached title translation."

    stats: {
        downloads:  84
        updated_at: 1785637394000
    }
}
```

[^template]: [[Obsidian plugin]]
