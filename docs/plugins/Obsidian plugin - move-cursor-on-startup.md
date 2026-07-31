---
uid: 4a4d9ad7-66f0-5d76-b731-2da59777ba97
xid:
  - move-cursor-on-startup
aliases:
  - move-cursor-on-startup
  - Move Cursor On Startup
  - treadder/move-cursor-on-startup
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/move-cursor-on-startup
alt:
  - https://github.com/treadder/move-cursor-on-startup
downloads: 266
updated at: "2025-07-27T21:43:10Z"
related to:
  - "[[GitHub - 977397884]]"
remind me:
---

# Move Cursor On Startup

Moves the cursor briefly right and then back left in the first note opened at startup. The recorded text gives the reason as making DataView expressions evaluate on their own instead of waiting for user interaction, so embedded DataView blocks do not fail to render.

```cue
plugin: {
    id:     "move-cursor-on-startup"
    name:   "Move Cursor On Startup"
    author: "treadder"
    repo:   "treadder/move-cursor-on-startup"

    html_url:    "https://community.obsidian.md/plugins/move-cursor-on-startup"
    github_url:  "https://github.com/treadder/move-cursor-on-startup"
    description: "Move cursor right then left briefly on startup --> first opened note. Makes DataView expressions 'activate' automatically instead of waiting for user interaction."
    about:       "Move the cursor briefly on startup to trigger DataView expressions to evaluate on the first opened note. Prevent embedded DataView blocks from failing to render by shifting the cursor right then back left during startup."

    stats: {
        downloads:  266
        updated_at: 1753652590000
    }
}
```

[^template]: [[Obsidian plugin]]
