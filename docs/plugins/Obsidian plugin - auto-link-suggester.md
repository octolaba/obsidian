---
uid: 3f7d5485-b121-5545-a3bb-1cc86520dd64
xid:
  - auto-link-suggester
aliases:
  - auto-link-suggester
  - Auto Link Suggester
  - hornatx/auto-link-suggester
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-link-suggester
alt:
  - https://github.com/hornatx/auto-link-suggester
downloads: 176
updated at: "2026-06-08T01:02:28Z"
related to:
  - "[[GitHub - 1258858130]]"
remind me:
---

# Auto Link Suggester

Auto Link Suggester offers native double-bracket link completions as a filename is typed, indexing only the folders you choose. Matching is by exact prefix or fuzzy search and is triggered after a single character for CJK and two characters for ASCII. Debounced, cache-aware scanning and a cap on the number of suggestions keep the CPU and UI cost down, and links are generated using Obsidian's own path rules.

```cue
plugin: {
    id:     "auto-link-suggester"
    name:   "Auto Link Suggester"
    author: "hornat"
    repo:   "hornatx/auto-link-suggester"

    html_url:    "https://community.obsidian.md/plugins/auto-link-suggester"
    github_url:  "https://github.com/hornatx/auto-link-suggester"
    description: "Automatically suggests internal link completions when you type a filename from a specified folder in the editor, with support for exact prefix and fuzzy matching. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Suggest native double-bracket link completions as you type by indexing only chosen folders and using debounced, cache-aware scanning to keep searches fast and lightweight. Support single-character triggers for CJK, two-character threshold for ASCII, prefix or fuzzy matching, and generate links using Obsidian's path rules while capping suggestions to reduce CPU and UI load."

    stats: {
        downloads:  176
        updated_at: 1780880548000
    }
}
```

[^template]: [[Obsidian plugin]]
