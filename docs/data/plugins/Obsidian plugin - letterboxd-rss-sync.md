---
uid: 4b7adcf4-1126-5cbf-9769-6f28b9513b6b
xid:
  - letterboxd-rss-sync
aliases:
  - letterboxd-rss-sync
  - Letterboxd Diary RSS Sync
  - fleker/letterboxd-for-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/letterboxd-rss-sync
alt:
  - https://github.com/fleker/letterboxd-for-obsidian
downloads: 2123
updated at: "2026-06-01T23:22:41Z"
related to:
  - "[[GitHub - 782314178]]"
remind me:
---

# Letterboxd Diary RSS Sync

This plugin syncs a public Letterboxd diary through its RSS feed, writing recent entries into a single Markdown file as a bulleted list with date-specific backlinks. New entries are merged in going forward, and each fetch pulls at most the last fifty items.

```cue
plugin: {
    id:     "letterboxd-rss-sync"
    name:   "Letterboxd Diary RSS Sync"
    author: "fleker"
    repo:   "fleker/letterboxd-for-obsidian"

    html_url:    "https://community.obsidian.md/plugins/letterboxd-rss-sync"
    github_url:  "https://github.com/fleker/letterboxd-for-obsidian"
    description: "Syncs your public Letterboxd diary."
    about:       "Sync your Letterboxd diary into Obsidian via public RSS feeds, importing recent entries into a single Markdown file as a bulleted list with date-specific backlinks. Merge new diary entries going forward; each fetch pulls up to the last 50 items."

    stats: {
        downloads:  2123
        updated_at: 1780356161000
    }
}
```

[^template]: [[Obsidian plugin]]
