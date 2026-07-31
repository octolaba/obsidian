---
uid: 39a92310-ac1c-5eb6-8c47-945d407a4233
xid:
  - folderer
aliases:
  - folderer
  - Folderer
  - alvaromateo/folderer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/folderer
alt:
  - https://github.com/alvaromateo/folderer
downloads: 167
updated at: "2026-05-31T16:07:32Z"
related to:
  - "[[GitHub - 1227096801]]"
remind me:
---

# Folderer

Monitors vault folders and runs custom rules when Markdown files are created, renamed or moved. A folder can carry several rules, each with triggers and condition groups combined as All, Any or None over filename, path or frontmatter, using contains, starts with, ends with, regex and exists checks. Actions such as prepending or appending text are chained, and rules are reordered to control execution.

```cue
plugin: {
    id:     "folderer"
    name:   "Folderer"
    author: "Alvaro Mateo"
    repo:   "alvaromateo/folderer"

    html_url:    "https://community.obsidian.md/plugins/folderer"
    github_url:  "https://github.com/alvaromateo/folderer"
    description: "Monitors folders for files added and runs custom actions based on user rules. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Watch vault folders and run rules when Markdown files are created, renamed, or moved. Attach multiple rules per folder with triggers, condition groups (All/Any/None) and conditions on filename, path or frontmatter (contains, starts with, ends with, regex, exists); chain actions like prepend or append text and reorder rules to control execution."

    stats: {
        downloads:  167
        updated_at: 1780243652000
    }
}
```

[^template]: [[Obsidian plugin]]
