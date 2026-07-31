---
uid: d2007ae1-0efc-5387-a172-0e1595699af7
xid:
  - starred-news-sync
aliases:
  - starred-news-sync
  - Starred News Sync
  - jmiba/starred-news-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/starred-news-sync
alt:
  - https://github.com/jmiba/starred-news-sync
downloads: 218
updated at: "2026-05-31T20:50:19Z"
related to:
  - "[[GitHub - 1248293830]]"
remind me:
---

# Starred News Sync

Starred items from an RSS reader are imported as Markdown notes with YAML frontmatter carrying title, URL, feed, author, dates and tags, under stable deduplicated filenames derived from URLs or identifiers. HTML summaries are converted to Markdown, full article content can optionally be fetched, and syncing runs manually or on a schedule. The recorded inputs name FreshRSS, Inoreader, Feedly and Miniflux among the compatible readers.

```cue
plugin: {
    id:     "starred-news-sync"
    name:   "Starred News Sync"
    author: "Jens Mittelbach"
    repo:   "jmiba/starred-news-sync"

    html_url:    "https://community.obsidian.md/plugins/starred-news-sync"
    github_url:  "https://github.com/jmiba/starred-news-sync"
    description: "Import starred RSS reader items as notes with YAML frontmatter. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import starred RSS items into Obsidian as Markdown notes with YAML frontmatter (title, URL, feed, author, dates, tags) and stable, deduplicated filenames from URLs or IDs. Convert HTML summaries to safe Markdown, optionally fetch full article content, and sync manually or on a schedule; supports FreshRSS, Inoreader, Feedly, Miniflux and other compatible readers."

    stats: {
        downloads:  218
        updated_at: 1780260619000
    }
}
```

[^template]: [[Obsidian plugin]]
