---
uid: 641de39a-67ec-5b32-915c-bf6e5f140c7f
xid:
  - obsidian-remember-file-state
aliases:
  - obsidian-remember-file-state
  - Remember File State
  - ludovicchabant/obsidian-remember-file-state
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-remember-file-state
alt:
  - https://github.com/ludovicchabant/obsidian-remember-file-state
downloads: 14608
updated at: "2023-11-22T01:25:34Z"
related to:
  - "[[GitHub - 457224841]]"
remind me:
---

# Remember File State

This plugin remembers cursor position, selection and scrolling for each file and restores them when switching between files. The editor state is persisted to disk, so the positions come back after Obsidian restarts. It works on file open and close rather than by background polling.

```cue
plugin: {
    id:     "obsidian-remember-file-state"
    name:   "Remember File State"
    author: "ludovicchabant"
    repo:   "ludovicchabant/obsidian-remember-file-state"

    html_url:    "https://community.obsidian.md/plugins/obsidian-remember-file-state"
    github_url:  "https://github.com/ludovicchabant/obsidian-remember-file-state"
    description: "Remember cursor position, selection, scrolling, and more for each file."
    about:       "Restore cursor and scroll positions when switching between files. Persist editor state to disk so positions return after restarting Obsidian, working only on file open/close to avoid background polling."

    stats: {
        downloads:  14608
        updated_at: 1700616334000
    }
}
```

[^template]: [[Obsidian plugin]]
