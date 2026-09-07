---
uid: 9949e9cd-d148-5d48-b819-676d2183eaba
xid:
  - lean-search
aliases:
  - lean-search
  - Lean Search
  - felixleopold/lean-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/lean-search
alt:
  - https://github.com/felixleopold/lean-search
downloads: 77
updated at: "2026-07-30T06:18:20Z"
related to:
  - "[[GitHub - 1316000972]]"
remind me:
---

# Lean Search

Searches the vault with ranking by frecency, combining how often a note is opened with how recently, and gives precedence to exact title and heading matches. The index is kept compact and rebuilt incrementally in the background to hold memory use down. With an empty query it lists the most frequently and most recently opened notes.

```cue
plugin: {
    id:     "lean-search"
    name:   "Lean Search"
    author: "felixleopold"
    repo:   "felixleopold/lean-search"

    html_url:    "https://community.obsidian.md/plugins/lean-search"
    github_url:  "https://github.com/felixleopold/lean-search"
    description: "Search your vault quickly with precise matching and frecency ranking that favors recently and frequently opened notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Find notes instantly with a lean, zoxide-style search that ranks results by frecency (open count × recency) and favors exact title and heading matches. Reduce memory use with a compact index and incremental background reindexing, and surface your most-frequent or recently opened notes even with an empty query."

    stats: {
        downloads:  77
        updated_at: 1785392300000
    }
}
```

[^template]: [[Obsidian plugin]]
