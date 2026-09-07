---
uid: 0e8b3c0f-ec96-553a-9b73-237381364db5
xid:
  - task-matrix
aliases:
  - task-matrix
  - TaskMatrix
  - jmerryman-eng/Eisenhower-Obsidian-PlugIn
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/task-matrix
alt:
  - https://github.com/jmerryman-eng/Eisenhower-Obsidian-PlugIn
downloads: 243
updated at: "2026-06-05T22:22:02Z"
related to:
  - "[[GitHub - 1258541936]]"
remind me:
---

# TaskMatrix

TaskMatrix scans the vault for tagged Markdown checkbox lines and arranges them in an Eisenhower grid of do, schedule, delegate and delete quadrants alongside a backlog. Quadrant state is written back into the files as tags, so dragging a task between quadrants edits its source line. Checkboxes can be clicked to cycle status, a task jumps to its source line, and the writes are atomic and conflict-checked.

```cue
plugin: {
    id:     "task-matrix"
    name:   "TaskMatrix"
    author: "jmerryman-eng"
    repo:   "jmerryman-eng/Eisenhower-Obsidian-PlugIn"

    html_url:    "https://community.obsidian.md/plugins/task-matrix"
    github_url:  "https://github.com/jmerryman-eng/Eisenhower-Obsidian-PlugIn"
    description: "Eisenhower-matrix view for #task lines across your vault. Drag tasks between Do / Schedule / Delegate / Delete quadrants; status changes write back to the source markdown. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Organize tasks into an Eisenhower 2×2 Do/Schedule/Delegate grid plus a backlog by scanning your vault for #task markdown checkbox lines. Write quadrant state back to files using #tm/qN tags, drag tasks between quadrants, click checkboxes to cycle status, jump to source lines, and rely on atomic, conflict-checked writes."

    stats: {
        downloads:  243
        updated_at: 1780698122000
    }
}
```

[^template]: [[Obsidian plugin]]
