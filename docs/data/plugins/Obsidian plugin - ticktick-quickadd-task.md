---
uid: c70fe1cc-ab2d-58bb-b4f9-0e05e3163e2f
xid:
  - ticktick-quickadd-task
aliases:
  - ticktick-quickadd-task
  - TickTick Quick Add Task
  - heymoosh/ticktick-quick-add-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ticktick-quickadd-task
alt:
  - https://github.com/heymoosh/ticktick-quick-add-obsidian
downloads: 1273
updated at: "2026-06-05T16:22:57Z"
related to:
  - "[[GitHub - 953745612]]"
remind me:
---

# TickTick Quick Add Task

TickTick Quick Add Task creates a TickTick task from the current block of text with a keyboard shortcut, and prepends a ticktick tag to mark what has been sent. A unique block anchor is appended and turned into a clickable Advanced URI link that reopens the note at that exact block, which is why the Advanced URI plugin is required. Authentication uses OAuth PKCE with automatic token refresh.

```cue
plugin: {
    id:     "ticktick-quickadd-task"
    name:   "TickTick Quick Add Task"
    author: "heymoosh"
    repo:   "heymoosh/ticktick-quick-add-obsidian"

    html_url:    "https://community.obsidian.md/plugins/ticktick-quickadd-task"
    github_url:  "https://github.com/heymoosh/ticktick-quick-add-obsidian"
    description: "Instantly creates a TickTick task from the current block of text using a keyboard shortcut."
    about:       "Create TickTick tasks from a selected paragraph and prepend a #ticktick tag to mark sent items. Append a unique block anchor and create a clickable Advanced URI link that opens the note at that exact block, using secure OAuth PKCE with automatic token refresh. Requires Advanced URI plugin."

    stats: {
        downloads:  1273
        updated_at: 1780676577000
    }
}
```

[^template]: [[Obsidian plugin]]
