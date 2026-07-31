---
uid: f8423ea5-d258-5527-a5a6-544ea5020371
xid:
  - checkbox-sync
aliases:
  - checkbox-sync
  - Checkbox Sync
  - groldsf/obsidian_check_plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/checkbox-sync
alt:
  - https://github.com/groldsf/obsidian_check_plugin
downloads: 2576
updated at: "2025-08-08T10:18:15Z"
related to:
  - "[[GitHub - 925478855]]"
remind me:
---

# Checkbox Sync

Checkbox Sync keeps nested checkbox lists consistent by updating a parent from the states of its children, and can optionally cascade a parent change down to them. The sync direction, the interpretation of symbols and support for ordered and unordered lists are configurable, and the hierarchy is read from indentation.

```cue
plugin: {
    id:     "checkbox-sync"
    name:   "Checkbox Sync"
    author: "groldsf"
    repo:   "groldsf/obsidian_check_plugin"

    html_url:    "https://community.obsidian.md/plugins/checkbox-sync"
    github_url:  "https://github.com/groldsf/obsidian_check_plugin"
    description: "Automatically checks the parent checkbox if all child checkboxes are completed, and unchecks it otherwise."
    about:       "Sync checkbox states across nested lists. Update parent checkboxes from child states and optionally cascade parent changes to children, with configurable sync direction, symbol interpretation, support for ordered/unordered lists, and respect for indentation-based hierarchies."

    stats: {
        downloads:  2576
        updated_at: 1754648295000
    }
}
```

[^template]: [[Obsidian plugin]]
