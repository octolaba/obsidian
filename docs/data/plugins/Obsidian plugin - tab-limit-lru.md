---
uid: 1cd5ad0b-ab93-5ecd-bc67-b52c9e04150f
xid:
  - tab-limit-lru
aliases:
  - tab-limit-lru
  - LRU Tab Limiter
  - fireshort/obsidian-tab-limit
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tab-limit-lru
alt:
  - https://github.com/fireshort/obsidian-tab-limit
downloads: 114
updated at: "2026-05-18T13:02:06Z"
related to:
  - "[[GitHub - 1231976335]]"
remind me:
---

# LRU Tab Limiter

Keeps open Markdown tabs under a configurable maximum, five by default. When a new tab would exceed the limit, the least recently used Markdown tab is closed. Tab switches update recency, so older inactive tabs are replaced first.

```cue
plugin: {
    id:     "tab-limit-lru"
    name:   "LRU Tab Limiter"
    author: "Ivan Chen"
    repo:   "fireshort/obsidian-tab-limit"

    html_url:    "https://community.obsidian.md/plugins/tab-limit-lru"
    github_url:  "https://github.com/fireshort/obsidian-tab-limit"
    description: "Keeps Markdown tabs under a limit by replacing the least recently used tab. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Limit open Markdown tabs to a configurable maximum (default 5). Close the least-recently-used Markdown tab when opening a new one would exceed the limit, with tab switches marking recency so older inactive tabs are replaced first."

    stats: {
        downloads:  114
        updated_at: 1779109326000
    }
}
```

[^template]: [[Obsidian plugin]]
