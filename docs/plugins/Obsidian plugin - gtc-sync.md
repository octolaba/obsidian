---
uid: 715b228a-30bf-5f7e-8eda-65c92918e083
xid:
  - gtc-sync
aliases:
  - gtc-sync
  - GTC Sync
  - etudes-informatiques-et-services35/gtc-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gtc-sync
alt:
  - https://github.com/etudes-informatiques-et-services35/gtc-sync
downloads: 88
updated at: "2026-05-20T10:04:10Z"
related to:
  - "[[GitHub - 1228627151]]"
remind me:
---

# GTC Sync

Keeps a persistent WebSocket connection to a GTC-Sync server and synchronizes notes in both directions. A modified or renamed note is sent to the server only when it carries an IdNote value in its YAML and is the active file. Server commands can read, create, replace, move, find or open notes in the vault.

```cue
plugin: {
    id:     "gtc-sync"
    name:   "GTC Sync"
    author: "Etudes Informatiques et Services"
    repo:   "etudes-informatiques-et-services35/gtc-sync"

    html_url:    "https://community.obsidian.md/plugins/gtc-sync"
    github_url:  "https://github.com/etudes-informatiques-et-services35/gtc-sync"
    description: "Synchronizing notes with GTC. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Maintain a persistent WebSocket connection to a GTC-Sync server and synchronize notes bidirectionally. Send modified or renamed notes to the server only when the note has an IdNote in its YAML and is the active file. Execute server commands to read, create, replace, move, find, or open notes in the vault."

    stats: {
        downloads:  88
        updated_at: 1779271450000
    }
}
```

[^template]: [[Obsidian plugin]]
