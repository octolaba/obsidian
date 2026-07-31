---
uid: 08d470da-e25f-5b64-aa46-86cc4195336e
xid:
  - task-tree
aliases:
  - task-tree
  - Task Tree
  - aldorithm392/obsidian-task-tree
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/task-tree
alt:
  - https://github.com/aldorithm392/obsidian-task-tree
downloads: 1
updated at: "2026-07-24T05:15:54Z"
related to:
  - "[[GitHub - 1310575236]]"
remind me:
---

# Task Tree

Task Tree shows Markdown tasks as a nested tree and as a Kanban board at once, with a parent's progress rolling up from its children. Everything stays a plain Markdown checklist, and changes are limited to files that opt in through a task-tree type field. Only minimal metadata is written: the status, a block identifier, and inline override and blocked-by fields.

```cue
plugin: {
    id:     "task-tree"
    name:   "Task Tree"
    author: "Hypnotist6979"
    repo:   "aldorithm392/obsidian-task-tree"

    html_url:    "https://community.obsidian.md/plugins/task-tree"
    github_url:  "https://github.com/aldorithm392/obsidian-task-tree"
    description: "See your Markdown tasks as a tree and a Kanban board at once. Break projects into nested subtasks; a parent's progress rolls up from its children. Plain Markdown, agent-ready. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create deeply nested task trees and view the same items as a Kanban board while keeping everything as plain Markdown checklists. Limit changes to opt-in files (type: task-tree) and write only minimal metadata: status, ^id, [tt-override:: …], and [tt-blocked-by:: …]."

    stats: {
        downloads:  1
        updated_at: 1784870154000
    }
}
```

[^template]: [[Obsidian plugin]]
