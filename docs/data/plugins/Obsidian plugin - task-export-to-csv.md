---
uid: 8326be92-40c1-581d-8112-ce09fb7dd213
xid:
  - task-export-to-csv
aliases:
  - task-export-to-csv
  - Task Export Tool
  - tailormade-eu/obsidian-task-export-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/task-export-to-csv
alt:
  - https://github.com/tailormade-eu/obsidian-task-export-plugin
downloads: 102
updated at: "2025-11-21T18:56:29Z"
related to:
  - "[[GitHub - 1096377323]]"
remind me:
---

# Task Export Tool

Task Export Tool exports the outstanding tasks of a vault to CSV for time-tracking integration, with ManicTime named as the target. Project folders can be watched so an export runs when a file changes, and an export can also be started from the command palette. Folder monitoring is selective, updates are debounced, and processing is asynchronous.

```cue
plugin: {
    id:     "task-export-to-csv"
    name:   "Task Export Tool"
    author: "tailormade-eu"
    repo:   "tailormade-eu/obsidian-task-export-plugin"

    html_url:    "https://community.obsidian.md/plugins/task-export-to-csv"
    github_url:  "https://github.com/tailormade-eu/obsidian-task-export-plugin"
    description: "Export outstanding tasks to CSV for time tracking integration (e.g. ManicTime). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Export outstanding tasks from your Obsidian vault to CSV for ManicTime integration. Watch project folders and export on file changes, with command-palette export, selective folder monitoring, debounced updates and async processing for fast, reliable output."

    stats: {
        downloads:  102
        updated_at: 1763751389000
    }
}
```

[^template]: [[Obsidian plugin]]
