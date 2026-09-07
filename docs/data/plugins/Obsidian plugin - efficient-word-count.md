---
uid: bd849392-ae8e-5180-b648-416468a75d13
xid:
  - efficient-word-count
aliases:
  - efficient-word-count
  - Efficient Word Count
  - blueheron786/obsidian-efficient-word-count
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/efficient-word-count
alt:
  - https://github.com/blueheron786/obsidian-efficient-word-count
downloads: 540
updated at: "2025-06-19T21:34:08Z"
related to:
  - "[[GitHub - 1005162887]]"
remind me:
---

# Efficient Word Count

Calculates and caches word counts for every Markdown file in the vault, updating as files are created, modified, renamed or deleted, and skipping folders excluded in settings. The cache is persisted to disk for a fast startup, and the counts are readable programmatically through a global API for a single path or for the whole vault.

```cue
plugin: {
    id:     "efficient-word-count"
    name:   "Efficient Word Count"
    author: "blueheron786"
    repo:   "blueheron786/obsidian-efficient-word-count"

    html_url:    "https://community.obsidian.md/plugins/efficient-word-count"
    github_url:  "https://github.com/blueheron786/obsidian-efficient-word-count"
    description: "Efficiently calculates and caches word counts for notes, with folder exclusion. Uses cache to avoid recalculating word counts for unchanged notes."
    about:       "Calculate and cache word counts for all Markdown files in your vault, updating in real time as files are created, modified, renamed, or deleted and excluding configurable folders. Persist cache to disk for fast startup and access counts programmatically via the global API (window.wordCountCache.get(path) and .total())."

    stats: {
        downloads:  540
        updated_at: 1750368848000
    }
}
```

[^template]: [[Obsidian plugin]]
