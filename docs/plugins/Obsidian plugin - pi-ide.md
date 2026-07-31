---
uid: 4aba9a7b-c0b9-5ea0-9077-491ea3526399
xid:
  - pi-ide
aliases:
  - pi-ide
  - Pi IDE
  - 9963kk/obsidian-pi-ide
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pi-ide
alt:
  - https://github.com/9963kk/obsidian-pi-ide
downloads: 197
updated at: "2026-06-07T03:33:19Z"
related to:
  - "[[GitHub - 1261155335]]"
remind me:
---

# Pi IDE

Pi IDE connects Obsidian to the Pi Coding Agent through the pi-ide protocol, exposing the active file, cursor position and selection as ambient editor context. Write and edit tool calls from Pi are routed through an Obsidian confirmation dialog, with optional auto-accept for trusted local workflows. It also handles Pi-initiated diffs and detects the Pi-side package.

```cue
plugin: {
    id:     "pi-ide"
    name:   "Pi IDE"
    author: "Jenkins Chen"
    repo:   "9963kk/obsidian-pi-ide"

    html_url:    "https://community.obsidian.md/plugins/pi-ide"
    github_url:  "https://github.com/9963kk/obsidian-pi-ide"
    description: "Connect Obsidian to Pi Coding Agent via the pi-ide protocol: current file, cursor, selection, and edit confirmations. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect Obsidian to Pi Coding Agent via the pi-ide protocol and expose the active file, cursor position, and selection as ambient editor context. Route Pi write/edit tool calls through an Obsidian confirmation dialog or enable optional auto-accept for trusted local workflows, handle Pi-initiated diffs, and detect the Pi-side package."

    stats: {
        downloads:  197
        updated_at: 1780803199000
    }
}
```

[^template]: [[Obsidian plugin]]
