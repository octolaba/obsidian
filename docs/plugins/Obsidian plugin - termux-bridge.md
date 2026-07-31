---
uid: 3d7f2237-c65b-57f4-8010-20d2f26484ce
xid:
  - termux-bridge
aliases:
  - termux-bridge
  - Termux Bridge
  - abduznik/obsidian-shell-termux
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/termux-bridge
alt:
  - https://github.com/abduznik/obsidian-shell-termux
downloads: 135
updated at: "2026-05-16T14:17:35Z"
related to:
  - "[[GitHub - 1119444086]]"
remind me:
---

# Termux Bridge

Termux Bridge connects Obsidian to Termux through a local HTTP bridge so shell commands run on an Android device from notes. Commands are sent and their output retrieved silently over localhost with bi-directional responses, and a generated security token guards the bridge against unauthorized access.

```cue
plugin: {
    id:     "termux-bridge"
    name:   "Termux Bridge"
    author: "abduznik"
    repo:   "abduznik/obsidian-shell-termux"

    html_url:    "https://community.obsidian.md/plugins/termux-bridge"
    github_url:  "https://github.com/abduznik/obsidian-shell-termux"
    description: "Execute Termux commands directly via a local HTTP bridge. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect Obsidian to Termux via a local HTTP bridge and run shell commands on your Android device directly from notes. Send commands and retrieve output silently over localhost with bi-directional responses and a generated security token to prevent unauthorized access."

    stats: {
        downloads:  135
        updated_at: 1778941055000
    }
}
```

[^template]: [[Obsidian plugin]]
