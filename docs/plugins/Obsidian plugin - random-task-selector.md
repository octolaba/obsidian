---
uid: 15eade59-7be7-5e04-b418-f62b6753a09a
xid:
  - random-task-selector
aliases:
  - random-task-selector
  - Random Task Selector
  - jaidetree/obsidian-random-task
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/random-task-selector
alt:
  - https://github.com/jaidetree/obsidian-random-task
downloads: 31
updated at: "2026-07-03T22:54:00Z"
related to:
  - "[[GitHub - 1286555922]]"
remind me:
---

# Random Task Selector

Draws a random unchecked task from the Markdown checklist at the cursor and marks it active with a start glyph and a selected-at timestamp. On completion the task is stamped with a completed glyph and a completed-at timestamp. One active task is kept per checklist, unchecking allows reactivation, and a draw is refused when no candidate exists.

```cue
plugin: {
    id:     "random-task-selector"
    name:   "Random Task Selector"
    author: "Jay"
    repo:   "jaidetree/obsidian-random-task"

    html_url:    "https://community.obsidian.md/plugins/random-task-selector"
    github_url:  "https://github.com/jaidetree/obsidian-random-task"
    description: "Randomly draws a task from the checklist at your cursor and stamps tasks with selected-at / completed-at datetimes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Select a random unchecked task from the Markdown checklist at your cursor and mark it active with a start glyph and a selected-at timestamp. Stamp tasks on completion with a completed glyph and completed-at timestamp, keep one active per checklist, allow reactivation by unchecking, and refuse draws when no candidates exist."

    stats: {
        downloads:  31
        updated_at: 1783119240000
    }
}
```

[^template]: [[Obsidian plugin]]
