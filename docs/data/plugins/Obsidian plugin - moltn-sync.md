---
uid: 0f6707df-da39-58d1-93bf-a07428015f4c
xid:
  - moltn-sync
aliases:
  - moltn-sync
  - Moltn Sync
  - affluency-dev/obsidian-moltn-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/moltn-sync
alt:
  - https://github.com/affluency-dev/obsidian-moltn-sync
downloads: 36
updated at: "2026-07-08T07:52:16Z"
related to:
  - "[[GitHub - 1292322345]]"
remind me:
---

# Moltn Sync

Moltn Sync pulls finished notes from a Moltn installation into the vault, writing them into a target folder and adding a numeric suffix on a name clash rather than overwriting an existing file. A chosen folder can be pushed back to Moltn as context. The plugin polls Moltn at startup and at intervals and acknowledges queued notes so that Moltn removes them.

```cue
plugin: {
    id:     "moltn-sync"
    name:   "Moltn Sync"
    author: "zeniadev"
    repo:   "affluency-dev/obsidian-moltn-sync"

    html_url:    "https://community.obsidian.md/plugins/moltn-sync"
    github_url:  "https://github.com/affluency-dev/obsidian-moltn-sync"
    description: "Pulls finished notes from your Moltn install into this vault, and (optionally) shares chosen notes back as context. Your files stay yours. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Pull finished notes from your Moltn install into your vault and write them into a target folder without overwriting existing files (adds numeric suffix on name clashes). Push a chosen folder back to Moltn as context and poll Moltn on startup and at intervals, acknowledging queued notes so Moltn removes them."

    stats: {
        downloads:  36
        updated_at: 1783497136000
    }
}
```

[^template]: [[Obsidian plugin]]
