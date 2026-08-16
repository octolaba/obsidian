---
uid: 6e3e1291-e5b3-5bcd-a41f-6a82e73d8b97
xid:
  - obsidian-view-mode-by-frontmatter
aliases:
  - obsidian-view-mode-by-frontmatter
  - Force note view mode
  - bwydoogh/obsidian-force-view-mode-of-note
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-view-mode-by-frontmatter
alt:
  - https://github.com/bwydoogh/obsidian-force-view-mode-of-note
downloads: 73608
updated at: "2023-12-07T19:40:27Z"
related to:
  - "[[GitHub - 393988364]]"
remind me:
---

# Force note view mode

Front matter forces a note to open in a chosen view and editing mode. The keys are obsidianUIMode and obsidianEditingMode, with the older obsidian_ui_mode key recorded in the index description. The note then opens in its configured mode even when the pane it lands in is currently in a different one.

```cue
plugin: {
    id:     "obsidian-view-mode-by-frontmatter"
    name:   "Force note view mode"
    author: "bwydoogh"
    repo:   "bwydoogh/obsidian-force-view-mode-of-note"

    html_url:    "https://community.obsidian.md/plugins/obsidian-view-mode-by-frontmatter"
    github_url:  "https://github.com/bwydoogh/obsidian-force-view-mode-of-note"
    description: "Force the view mode for a note by using frontmatter: YAML block with 'obsidian_ui_mode' as key."
    about:       "Force notes to open in a specific view or editing mode by adding obsidianUIMode and obsidianEditingMode to the note's front matter. Ensure notes open in the configured default mode even when a pane is currently in a different mode."

    stats: {
        downloads:  73608
        updated_at: 1701978027000
    }
}
```

[^template]: [[Obsidian plugin]]
