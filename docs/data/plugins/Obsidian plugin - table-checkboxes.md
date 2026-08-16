---
uid: 87b40cf4-0917-55ff-ad01-b9107a3661be
xid:
  - table-checkboxes
aliases:
  - table-checkboxes
  - Markdown table checkboxes
  - 0x-dln/obsidian-table-checkboxes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/table-checkboxes
alt:
  - https://github.com/0x-dln/obsidian-table-checkboxes
downloads: 19357
updated at: "2024-12-19T22:37:35Z"
related to:
  - "[[GitHub - 555553008]]"
remind me:
---

# Markdown table checkboxes

Replaces Markdown checkboxes inside tables with live HTML checkboxes that are toggled in view mode, with their state persisted to the underlying file. A command converts all checkboxes in the current file, optionally including those outside tables. Checkbox identifiers can also be regenerated in bulk.

```cue
plugin: {
    id:     "table-checkboxes"
    name:   "Markdown table checkboxes"
    author: "0x-dln"
    repo:   "0x-dln/obsidian-table-checkboxes"

    html_url:    "https://community.obsidian.md/plugins/table-checkboxes"
    github_url:  "https://github.com/0x-dln/obsidian-table-checkboxes"
    description: "Add support for stateful checkboxes inside Markdown tables."
    about:       "Replace markdown checkboxes inside tables with live HTML checkboxes that can be toggled in view mode and persist to the underlying file. Convert all checkboxes in the current file or include checkboxes outside tables, and regenerate checkbox IDs in bulk."

    stats: {
        downloads:  19357
        updated_at: 1734647855000
    }
}
```

[^template]: [[Obsidian plugin]]
