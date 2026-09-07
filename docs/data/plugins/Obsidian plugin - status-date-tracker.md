---
uid: bbc413dc-5433-5c50-907e-ea563892f06d
xid:
  - status-date-tracker
aliases:
  - status-date-tracker
  - Status Date Tracker
  - whiletruegeek/status-date-tracker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/status-date-tracker
alt:
  - https://github.com/whiletruegeek/status-date-tracker
downloads: 41
updated at: "2026-07-10T11:01:57Z"
related to:
  - "[[GitHub - 1296361343]]"
remind me:
---

# Status Date Tracker

When a tracked property of a note changes value, a date property in year-month-day form is written and named after the new status. Earlier status-date properties stay in the note, leaving a compact transition history. The tracked property can be changed, and statuses can be marked final or a preserve-first-date option enabled, so initial dates stay fixed while other status dates update when a status is entered again.

```cue
plugin: {
    id:     "status-date-tracker"
    name:   "Status Date Tracker"
    author: "WhileTrueGeek"
    repo:   "whiletruegeek/status-date-tracker"

    html_url:    "https://community.obsidian.md/plugins/status-date-tracker"
    github_url:  "https://github.com/whiletruegeek/status-date-tracker"
    description: "Add dates when a tracked property changes value. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Record a YYYY-MM-DD date property when a note's status changes, naming the property after the new status (e.g. in-progress: 2026-07-10). Keep a compact transition history as previous status-date properties remain in the note. Change the tracked property and mark final statuses (or enable preserve-first-date) to keep initial dates permanent while other status dates update on re-entry."

    stats: {
        downloads:  41
        updated_at: 1783681317000
    }
}
```

[^template]: [[Obsidian plugin]]
