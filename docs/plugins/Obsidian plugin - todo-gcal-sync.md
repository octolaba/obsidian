---
uid: 8f8e328c-e55e-5f5c-a00b-3cc8ce2fc8e1
xid:
  - todo-gcal-sync
aliases:
  - todo-gcal-sync
  - CalSync
  - jash101/calsync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/todo-gcal-sync
alt:
  - https://github.com/jash101/calsync
downloads: 114
updated at: "2026-02-18T00:14:07Z"
related to:
  - "[[GitHub - 1156132729]]"
remind me:
---

# CalSync

CalSync syncs todo items carrying time estimates from notes to Google Calendar as timed events of the matching duration, stacking incomplete tasks one after another from a 10:30 start. When a todo is completed the event description records estimated against actual time, and deleting a todo removes its event. A Google account and desktop OAuth are required.

```cue
plugin: {
    id:     "todo-gcal-sync"
    name:   "CalSync"
    author: "jash101"
    repo:   "jash101/calsync"

    html_url:    "https://community.obsidian.md/plugins/todo-gcal-sync"
    github_url:  "https://github.com/jash101/calsync"
    description: "Sync todo items with time estimates to Google Calendar. Tracks estimated vs actual time on completion. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync todos from notes to Google Calendar as timed events with correct durations, stacking incomplete tasks sequentially from a 10:30 AM start. Update event descriptions for completed todos with estimated vs actual time, remove events for deleted todos, and require a Google account with desktop OAuth."

    stats: {
        downloads:  114
        updated_at: 1771373647000
    }
}
```

[^template]: [[Obsidian plugin]]
