---
uid: d18f0424-63cf-51de-a141-261397248aa4
xid:
  - property-board
aliases:
  - property-board
  - Property Board
  - nalevex/obsidian_property_dashboard
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/property-board
alt:
  - https://github.com/nalevex/obsidian_property_dashboard
downloads: 30
updated at: "2026-08-04T06:06:14Z"
related to:
  - "[[GitHub - 1318513534]]"
remind me:
---

# Property Board

Builds Kanban and table boards from notes' frontmatter properties, grouping notes by a chosen key and saving each board as a .board file in the vault. Kanban columns are mapped from that property's values, with unknown or empty values collected in an Unknown column, and dragging a card updates the frontmatter. Card fields can display frontmatter values, file metadata, or slices of the note body.

```cue
plugin: {
    id:     "property-board"
    name:   "Property Board"
    author: "NaleVex"
    repo:   "nalevex/obsidian_property_dashboard"

    html_url:    "https://community.obsidian.md/plugins/property-board"
    github_url:  "https://github.com/nalevex/obsidian_property_dashboard"
    description: "Create .board files with property-driven board views. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create Kanban and table boards from your notes' frontmatter properties and group notes by a chosen key. Save each board as a .board file in your vault, drag Kanban cards to update that frontmatter, and map columns from the property's values with unknown or empty values in an Unknown column. Display card fields from frontmatter, file metadata, or slices of the note body."

    stats: {
        downloads:  30
        updated_at: 1785823574000
    }
}
```

[^template]: [[Obsidian plugin]]
