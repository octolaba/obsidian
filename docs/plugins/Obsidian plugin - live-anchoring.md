---
uid: e80330cc-17fd-5b63-a78a-242eec6bd43f
xid:
  - live-anchoring
aliases:
  - live-anchoring
  - Live Anchoring
  - arthursrz/live-anchoring
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/live-anchoring
alt:
  - https://github.com/arthursrz/live-anchoring
downloads: 106
updated at: "2026-06-12T15:38:20Z"
related to:
  - "[[GitHub - 1267484165]]"
remind me:
---

# Live Anchoring

Anchors writing to the vault by turning words and phrases that match existing note titles into wikilinks after a brief pause in typing. Links are applied in place in a single editor transaction so the cursor and scroll position do not move, the longest matching title wins, and frontmatter, code, existing links, and URLs are skipped.

```cue
plugin: {
    id:     "live-anchoring"
    name:   "Live Anchoring"
    author: "Arthur Sarazin"
    repo:   "arthursrz/live-anchoring"

    html_url:    "https://community.obsidian.md/plugins/live-anchoring"
    github_url:  "https://github.com/arthursrz/live-anchoring"
    description: "Anchor your writing to your vault: when you pause typing, words that match existing note titles become wikilinks automatically. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Anchor writing by converting words or phrases matching note titles into [[wikilinks]] after a brief typing pause. Apply links in-place in one editor transaction so cursor and scroll stay put, prefer longest-title matches, and skip frontmatter, code and existing links/URLs."

    stats: {
        downloads:  106
        updated_at: 1781278700000
    }
}
```

[^template]: [[Obsidian plugin]]
