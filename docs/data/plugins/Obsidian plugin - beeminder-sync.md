---
uid: 8398820c-2f41-56ab-aeff-a01ff403831b
xid:
  - beeminder-sync
aliases:
  - beeminder-sync
  - Beeminder Task Sync
  - leonstaufer/obsidian-beeminder-task-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/beeminder-sync
alt:
  - https://github.com/leonstaufer/obsidian-beeminder-task-sync
downloads: 100
updated at: "2026-05-16T12:40:08Z"
related to:
  - "[[GitHub - 1215304397]]"
remind me:
---

# Beeminder Task Sync

Beeminder Task Sync sends task completions to Beeminder goals. A checklist item tagged with the bee marker submits a datapoint when it is checked and removes it when unchecked, with the goal name and an optional inline value that defaults to one, assisted by goal autocomplete. It works with plain Markdown checkboxes and with the Tasks plugin.

```cue
plugin: {
    id:     "beeminder-sync"
    name:   "Beeminder Task Sync"
    author: "Leon Staufer"
    repo:   "leonstaufer/obsidian-beeminder-task-sync"

    html_url:    "https://community.obsidian.md/plugins/beeminder-sync"
    github_url:  "https://github.com/leonstaufer/obsidian-beeminder-task-sync"
    description: "Sync task completions to Beeminder goals. Works with the Tasks plugin. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync task completions to Beeminder goals by tagging checklist items with a 🐝 marker; checking a task sends a datapoint and unchecking removes it. Insert goal names or an =value inline (defaults to 1) and use goal autocomplete—works with plain Markdown checkboxes and the Tasks plugin."

    stats: {
        downloads:  100
        updated_at: 1778935208000
    }
}
```

[^template]: [[Obsidian plugin]]
