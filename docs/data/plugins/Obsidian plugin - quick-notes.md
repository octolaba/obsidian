---
uid: 7c6141be-5977-51ef-960e-6fbbd570c2e5
xid:
  - quick-notes
aliases:
  - quick-notes
  - Quick Notes
  - seanmcowen/Quick-Note-Obsidian-Plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/quick-notes
alt:
  - https://github.com/seanmcowen/Quick-Note-Obsidian-Plugin
downloads: 483
updated at: "2024-09-26T18:37:52Z"
related to:
  - "[[GitHub - 821854656]]"
remind me:
---

# Quick Notes

Collects the display-name aliases used for the current file and adds them to its aliases metadata. A link written as a bare page name is converted to carry an explicit display name, so the displayed text survives a filename change. Notes are created silently in the background from selected text, optionally under a custom name, and the selection is linked as an alias.

```cue
plugin: {
    id:     "quick-notes"
    name:   "Quick Notes"
    author: "seanmcowen"
    repo:   "seanmcowen/Quick-Note-Obsidian-Plugin"

    html_url:    "https://community.obsidian.md/plugins/quick-notes"
    github_url:  "https://github.com/seanmcowen/Quick-Note-Obsidian-Plugin"
    description: "Speeds up some note taking abilities and allows for creating notes/links in the background"
    about:       "Find and add display-name aliases used for the current file into its aliases metadata. Convert links like [[Page]] into [[Page|Page]] to preserve displayed names when filenames change. Create notes silently from selected text (with optional custom names) and link selections as aliases."

    stats: {
        downloads:  483
        updated_at: 1727375872000
    }
}
```

[^template]: [[Obsidian plugin]]
