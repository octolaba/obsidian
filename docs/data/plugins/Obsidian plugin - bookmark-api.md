---
uid: 4ba42eaa-fac9-5a7b-9d30-6ce2b62f1401
xid:
  - bookmark-api
aliases:
  - bookmark-api
  - Bookmark API
  - niko-drossos/bookmarks-API
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/bookmark-api
alt:
  - https://github.com/niko-drossos/bookmarks-API
downloads: 93
updated at: "2026-04-14T07:00:11Z"
related to:
  - "[[GitHub - 1166193307]]"
remind me:
---

# Bookmark API

Bookmark API registers global functions on the window object so bookmarks can be manipulated programmatically. It adds, removes and moves bookmark groups and entries and sets custom display titles, acting on the active file or on any given path, for callers such as Templater or Dataview.

```cue
plugin: {
    id:     "bookmark-api"
    name:   "Bookmark API"
    author: "niko-drossos"
    repo:   "niko-drossos/bookmarks-API"

    html_url:    "https://community.obsidian.md/plugins/bookmark-api"
    github_url:  "https://github.com/niko-drossos/bookmarks-API"
    description: "Exposes global bookmarking functions for programmatically adding files to bookmark groups. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Manage bookmarks programmatically via global functions registered on window. Add, remove, move bookmark groups and entries, set custom display titles, and operate on the active file or any path from scripts like Templater or Dataview."

    stats: {
        downloads:  93
        updated_at: 1776150011000
    }
}
```

[^template]: [[Obsidian plugin]]
