---
uid: 7e9add17-0f9c-57d5-9a9d-233173dcd3a3
xid:
  - canvas-drag-fix
aliases:
  - canvas-drag-fix
  - Canvas Drag Fix
  - an2io/obsidian-canvas-drag-fix
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/canvas-drag-fix
alt:
  - https://github.com/an2io/obsidian-canvas-drag-fix
downloads: 204
updated at: "2026-05-16T07:23:30Z"
related to:
  - "[[GitHub - 1226815750]]"
remind me:
---

# Canvas Drag Fix

Canvas Drag Fix restores Canvas drag-and-drop on Linux when Chromium or Electron misclassifies a regular mouse as a pen device, which the inputs attribute to VMware and VirtualBox guests, ChromeOS Crostini and some Wayland setups. It normalizes pointer events so that card dragging, side resizing, region selection and arrow connections work again, without breaking clicks or keyboard moves.

```cue
plugin: {
    id:     "canvas-drag-fix"
    name:   "Canvas Drag Fix"
    author: "an2io"
    repo:   "an2io/obsidian-canvas-drag-fix"

    html_url:    "https://community.obsidian.md/plugins/canvas-drag-fix"
    github_url:  "https://github.com/an2io/obsidian-canvas-drag-fix"
    description: "Fixes Canvas drag-and-drop on Linux when Chromium misclassifies the mouse as a pen device. Common in VMware/VirtualBox guests, ChromeOS Crostini, and some Wayland setups. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Fix Canvas drag-and-drop on Linux when Chromium/Electron mislabels a regular mouse as \"pen\", restoring card dragging, side-resize, region selection, and arrow connections. Normalize pointer events so click-drag works again without breaking clicks or keyboard moves."

    stats: {
        downloads:  204
        updated_at: 1778916210000
    }
}
```

[^template]: [[Obsidian plugin]]
