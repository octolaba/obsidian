---
uid: 6402d067-60ee-55d8-bc21-e46dfa74abff
xid:
  - advanced-debug-mode
aliases:
  - advanced-debug-mode
  - Advanced Debug Mode
  - mnaoumov/obsidian-advanced-debug-mode
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/advanced-debug-mode
alt:
  - https://github.com/mnaoumov/obsidian-advanced-debug-mode
downloads: 4859
updated at: "2026-07-21T01:30:33Z"
related to:
  - "[[GitHub - 953921532]]"
remind me:
---

# Advanced Debug Mode

Advanced Debug Mode toggles Obsidian's debug mode while keeping the inline source maps of loaded plugins intact. Long stack traces are preserved across timers, promises, event handlers and other async boundaries, so the deeper call chain behind an error stays visible.

```cue
plugin: {
    id:     "advanced-debug-mode"
    name:   "Advanced Debug Mode"
    author: "Michael Naumov"
    repo:   "mnaoumov/obsidian-advanced-debug-mode"

    html_url:    "https://community.obsidian.md/plugins/advanced-debug-mode"
    github_url:  "https://github.com/mnaoumov/obsidian-advanced-debug-mode"
    description: "Enhances debugging experience."
    about:       "Toggle Obsidian debug mode on and off and keep inline source maps from loaded plugins intact. Preserve long stack traces across timers, promises, event handlers and other async boundaries to reveal deeper call chains for easier error diagnosis."

    stats: {
        downloads:  4859
        updated_at: 1784597433000
    }
}
```

[^template]: [[Obsidian plugin]]
