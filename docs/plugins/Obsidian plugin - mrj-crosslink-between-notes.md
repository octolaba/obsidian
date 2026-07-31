---
uid: d240b796-1528-53be-88e3-c679c0e54fbc
xid:
  - mrj-crosslink-between-notes
aliases:
  - mrj-crosslink-between-notes
  - Add links to current note
  - mrjackphil/obsidian-crosslink-between-notes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mrj-crosslink-between-notes
alt:
  - https://github.com/mrjackphil/obsidian-crosslink-between-notes
downloads: 12776
updated at: "2021-05-01T09:55:51Z"
related to:
  - "[[GitHub - 309347786]]"
remind me:
---

# Add links to current note

Adds a link back to the currently open note at the end of several other notes at once. The command scans the cursor position or the selection for wikilinks and appends a link to the open note in each file it matches. Targets come from a selection, a link under the cursor, or the quick switcher.

```cue
plugin: {
    id:     "mrj-crosslink-between-notes"
    name:   "Add links to current note"
    author: "mrjackphil"
    repo:   "mrjackphil/obsidian-crosslink-between-notes"

    html_url:    "https://community.obsidian.md/plugins/mrj-crosslink-between-notes"
    github_url:  "https://github.com/mrjackphil/obsidian-crosslink-between-notes"
    description: "A command to add a link to the current note at the bottom of selected notes."
    about:       "Add a backlink to the currently open note at the end of multiple notes by running a command that scans the cursor or selection for [[WikiLinks]]. Target files from selections, cursor-positioned links, or the quick switcher and append a wikilink to the open note in each matched file."

    stats: {
        downloads:  12776
        updated_at: 1619862951000
    }
}
```

[^template]: [[Obsidian plugin]]
