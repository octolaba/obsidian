---
uid: 2a02a6c2-7a88-55dc-9b78-c1bd1c196f1e
xid:
  - explorer-order-editor
aliases:
  - explorer-order-editor
  - Explorer Order Editor
  - vcarus/obsidian-explorer-order-editor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/explorer-order-editor
alt:
  - https://github.com/vcarus/obsidian-explorer-order-editor
downloads: 134
updated at: "2026-08-11T13:47:37Z"
related to:
  - "[[GitHub - 1324976594]]"
remind me:
---

# Explorer Order Editor

Sets a manual order for the folders and notes inside a folder instead of alphabetical sorting, without renaming items with numeric prefixes and without storing anything in the Obsidian configuration folder. Dropping a row onto the top or bottom edge of another row in the file explorer places it there, while dropping on the middle of a folder still moves the item into that folder, and a dialog arranges a whole folder at once. Four commands move one item up, down, to the top or to the bottom from a hotkey. Every order lives in one plain note in the vault, so it syncs with the notes, diffs in version control and can be read by hand.

```cue
plugin: {
    id:     "explorer-order-editor"
    name:   "Explorer Order Editor"
    author: "vcarus"
    repo:   "vcarus/obsidian-explorer-order-editor"

    html_url:    "https://community.obsidian.md/plugins/explorer-order-editor"
    github_url:  "https://github.com/vcarus/obsidian-explorer-order-editor"
    description: "Drag folders and notes into a manual order, in the file explorer itself or in a dialog. Stored as plain text inside your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Set the order of the folders and notes inside a folder by hand, instead of living with alphabetical — no renaming things `01 `, `02 `, and nothing stored under `.obsidian/`. Drag a row onto the top or bottom edge of another row in the file explorer and it lands there; dropping on the middle of a folder still moves the item into that folder, as always. A dialog arranges a whole folder at once, and four commands move one item up, down, to the top or to the bottom from a hotkey. Every order lives in one plain note in your vault, so it syncs with your notes, diffs in version control, and can be read by hand. Nothing else needs to be installed."

    stats: {
        downloads:  134
        updated_at: 1786456057000
    }
}
```

[^template]: [[Obsidian plugin]]
