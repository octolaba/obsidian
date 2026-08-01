---
uid: 419fb5e4-9005-5f0b-9476-5672c0cb462e
xid:
  - backlink-cache
aliases:
  - backlink-cache
  - Backlink Cache
  - mnaoumov/obsidian-backlink-cache
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/backlink-cache
alt:
  - https://github.com/mnaoumov/obsidian-backlink-cache
downloads: 25462
updated at: "2026-07-21T00:37:24Z"
related to:
  - "[[GitHub - 689799494]]"
remind me:
---

# Backlink Cache

Backlink Cache maintains a persistent backlink cache so that backlink queries and the Backlinks pane stay fast in large vaults. Canvas and frontmatter markdown links are included, and the plugin offers fast and safe wrappers around the metadata cache's getBacklinksForFile, with the original function still reachable.

```cue
plugin: {
    id:     "backlink-cache"
    name:   "Backlink Cache"
    author: "Michael Naumov"
    repo:   "mnaoumov/obsidian-backlink-cache"

    html_url:    "https://community.obsidian.md/plugins/backlink-cache"
    github_url:  "https://github.com/mnaoumov/obsidian-backlink-cache"
    description: "Store backlink cache to speed up `app.metadataCache.getBacklinksForFile`."
    about:       "Speed up backlink queries and the Backlinks pane by maintaining a persistent backlink cache to improve performance in large vaults. Include Canvas and frontmatter markdown links and offer fast and safe app.metadataCache.getBacklinksForFile wrappers, with access to the original function."

    stats: {
        downloads:  25462
        updated_at: 1784594244000
    }
}
```

[^template]: [[Obsidian plugin]]
