---
uid: d5ce9a10-ad27-58eb-86e5-ed190a961767
xid:
  - cursor-history
aliases:
  - cursor-history
  - Cursor History
  - abdelrahmanhafez/obsidian-cursor-history
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cursor-history
alt:
  - https://github.com/abdelrahmanhafez/obsidian-cursor-history
downloads: 362
updated at: "2026-08-08T15:33:10Z"
related to:
  - "[[GitHub - 1194056448]]"
remind me:
---

# Cursor History

Tracks cursor positions across files and navigates back and forward through them with a browser-style stack. The heuristic is positional: the same line or a move within ten lines updates the current entry, while ten lines or more, or a different file, creates a new one. Up to fifty entries are kept per session, and forward history is cleared after navigating.

```cue
plugin: {
    id:     "cursor-history"
    name:   "Cursor History"
    author: "abdelrahmanhafez"
    repo:   "abdelrahmanhafez/obsidian-cursor-history"

    html_url:    "https://community.obsidian.md/plugins/cursor-history"
    github_url:  "https://github.com/abdelrahmanhafez/obsidian-cursor-history"
    description: "Navigate back and forward through cursor position history across files, like VS Code. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Track cursor positions across files and navigate back or forward with a browser-style stack. Use a position-based heuristic (same line or within 10 lines updates current entry; 10+ lines or a different file creates a new entry), keep up to 50 session entries, and clear forward history after navigating."

    stats: {
        downloads:  362
        updated_at: 1786203190000
    }
}
```

[^template]: [[Obsidian plugin]]
