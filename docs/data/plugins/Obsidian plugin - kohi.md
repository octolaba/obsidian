---
uid: 988a112b-887f-56ce-86ac-372c327bbd8c
xid:
  - kohi
aliases:
  - kohi
  - KOHi
  - chiahsien/obsidian-kohi
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/kohi
alt:
  - https://github.com/chiahsien/obsidian-kohi
downloads: 151
updated at: "2026-05-13T22:50:12Z"
related to:
  - "[[GitHub - 1221699047]]"
remind me:
---

# KOHi

Imports highlights and notes from KOReader devices as one Markdown note per book. KOReader storage modes are detected automatically and Lua-serialized annotations are parsed. Output is shaped by Nunjucks templates, books are picked through fuzzy search, filenames are sanitized, and re-imports overwrite predictably.

```cue
plugin: {
    id:     "kohi"
    name:   "KOHi"
    author: "chiahsien"
    repo:   "chiahsien/obsidian-kohi"

    html_url:    "https://community.obsidian.md/plugins/kohi"
    github_url:  "https://github.com/chiahsien/obsidian-kohi"
    description: "Import KOReader highlights and notes into your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import highlights and notes from KOReader devices into Obsidian as one Markdown note per book. Auto-detect KOReader storage modes, parse Lua-serialized annotations, use Nunjucks templates for customizable output, pick books via fuzzy search, sanitize filenames, and handle re-import overwrites predictably."

    stats: {
        downloads:  151
        updated_at: 1778712612000
    }
}
```

[^template]: [[Obsidian plugin]]
