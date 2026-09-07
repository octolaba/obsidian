---
uid: d229954d-6ba3-5e5f-97c2-f7ee399d150a
xid:
  - boost-link-suggestions
aliases:
  - boost-link-suggestions
  - Boost Link Suggestions
  - jglev/obsidian-boost-link-suggestions
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/boost-link-suggestions
alt:
  - https://github.com/jglev/obsidian-boost-link-suggestions
downloads: 1522
updated at: "2023-09-27T12:39:57Z"
related to:
  - "[[GitHub - 579714353]]"
remind me:
---

# Boost Link Suggestions

This plugin replaces the inline link suggester with one that orders candidates by how many incoming links a note has, plus a manual boost score read from YAML. Aliases are listed before filenames in the suggestion order, so boosted and frequently referenced notes surface at the top.

```cue
plugin: {
    id:     "boost-link-suggestions"
    name:   "Boost Link Suggestions"
    author: "jglev"
    repo:   "jglev/obsidian-boost-link-suggestions"

    html_url:    "https://community.obsidian.md/plugins/boost-link-suggestions"
    github_url:  "https://github.com/jglev/obsidian-boost-link-suggestions"
    description: "Alternative inline link suggester that orders results by link count and manual boosts."
    about:       "Suggest inline links ordered by incoming-link count plus manual YAML \"boost\" scores to prioritize frequently referenced notes. List aliases in suggestion order before filenames and surface boosted pages at the top so desired targets appear first."

    stats: {
        downloads:  1522
        updated_at: 1695818397000
    }
}
```

[^template]: [[Obsidian plugin]]
