---
uid: e5c703f3-02c7-57f7-aa80-69c7db6eec99
xid:
  - zoom-mynotes-sync
aliases:
  - zoom-mynotes-sync
  - Zoom MyNotes Sync
  - script-repo/Zoom-MyNotes-Obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/zoom-mynotes-sync
alt:
  - https://github.com/script-repo/Zoom-MyNotes-Obsidian-plugin
downloads: 68
updated at: "2026-07-24T20:45:01Z"
related to:
  - "[[GitHub - 1308226661]]"
remind me:
---

# Zoom MyNotes Sync

Zoom MyNotes Sync brings Zoom AI Companion and My Notes transcripts into the vault by deploying and controlling a local Python and Playwright backend. It deploys a Python virtualenv, installs Playwright, registers OS background jobs, and runs a separate local sync script that the plugin itself installs and controls.

```cue
plugin: {
    id:     "zoom-mynotes-sync"
    name:   "Zoom MyNotes Sync"
    author: "Daemon Behr"
    repo:   "script-repo/Zoom-MyNotes-Obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/zoom-mynotes-sync"
    github_url:  "https://github.com/script-repo/Zoom-MyNotes-Obsidian-plugin"
    description: "Deploy and run Zoom Notes transcript sync into this vault (Python + Playwright backend). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Zoom AI Companion/My Notes transcripts into your vault by deploying and controlling a local Python + Playwright backend. Deploy a Python virtualenv, install Playwright, register OS background jobs, and run a separate local sync script (sync.py) that the plugin installs and controls."

    stats: {
        downloads:  68
        updated_at: 1784925901000
    }
}
```

[^template]: [[Obsidian plugin]]
