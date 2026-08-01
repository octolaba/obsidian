---
uid: 56d17f2d-cf14-5d9d-a488-47e63de88317
xid:
  - ical-task-sync
aliases:
  - ical-task-sync
  - iCal Task Sync
  - skyleret/obsidian-ical-task-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ical-task-sync
alt:
  - https://github.com/skyleret/obsidian-ical-task-sync
downloads: 116
updated at: "2026-06-01T00:10:21Z"
related to:
  - "[[GitHub - 1199516085]]"
remind me:
---

# iCal Task Sync

iCal Task Sync pulls events from an iCal URL into a Tasks header as Markdown checkboxes, optionally with links and date tags. Manually written tasks and indented sub-tasks are left intact, and a local manifest prevents an event from being added twice.

```cue
plugin: {
    id:     "ical-task-sync"
    name:   "iCal Task Sync"
    author: "skyleret"
    repo:   "skyleret/obsidian-ical-task-sync"

    html_url:    "https://community.obsidian.md/plugins/ical-task-sync"
    github_url:  "https://github.com/skyleret/obsidian-ical-task-sync"
    description: "Sync and sort iCal events into a Markdown task list. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync iCal events into a Tasks header as Markdown checkboxes with optional links and date tags. Keep manual tasks and indented sub-tasks intact, prevent duplicate re-adds with a local manifest, and fetch events directly from any iCal URL."

    stats: {
        downloads:  116
        updated_at: 1780272621000
    }
}
```

[^template]: [[Obsidian plugin]]
