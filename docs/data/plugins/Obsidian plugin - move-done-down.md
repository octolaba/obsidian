---
uid: bdbf4e00-c021-574f-8a88-739d76e83f6c
xid:
  - move-done-down
aliases:
  - move-done-down
  - Move Done Down
  - mihanentalpo/obsidian-move-done-down
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/move-done-down
alt:
  - https://github.com/mihanentalpo/obsidian-move-done-down
downloads: 35
updated at: "2026-07-06T06:11:52Z"
related to:
  - "[[GitHub - 1289893333]]"
remind me:
---

# Move Done Down

Moves completed top-level Markdown task blocks to the bottom of the current note. Nested tasks stay with their parent and a parent moves only once all of its children are done; moved blocks are inserted before an existing completed-task tail. File formatting and non-task text are preserved, and custom completion markers are supported.

```cue
plugin: {
    id:     "move-done-down"
    name:   "Move Done Down"
    author: "Mihanentalpo@yandex.ru"
    repo:   "mihanentalpo/obsidian-move-done-down"

    html_url:    "https://community.obsidian.md/plugins/move-done-down"
    github_url:  "https://github.com/mihanentalpo/obsidian-move-done-down"
    description: "Move completed top-level Markdown task blocks down before the completed-task tail. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Move completed top-level tasks to the bottom of the current note for easier scanning. Keep nested tasks with their parent and only move a parent when all child tasks are done; insert moved blocks before an existing completed-task tail, preserve file formatting and non-task text, and support custom completion markers."

    stats: {
        downloads:  35
        updated_at: 1783318312000
    }
}
```

[^template]: [[Obsidian plugin]]
