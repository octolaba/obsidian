---
uid: 25014eb7-3d75-50ca-b0e8-912327e74bfd
xid:
  - yeet
aliases:
  - yeet
  - yeet.md
  - davidvkimball/obsidian-yeet
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/yeet
alt:
  - https://github.com/davidvkimball/obsidian-yeet
downloads: 90
updated at: "2026-05-30T19:48:58Z"
related to:
  - "[[GitHub - 1218299138]]"
remind me:
---

# yeet.md

Publishes the current note to yeet.md with a single hotkey, creating an immutable snapshot at its own URL. A delete token is stored per snapshot so it can be unpublished later, published links are copied, all snapshots of the vault are listed, and a status-bar indicator marks notes that are published or have drifted from their snapshot.

```cue
plugin: {
    id:     "yeet"
    name:   "yeet.md"
    author: "David V. Kimball"
    repo:   "davidvkimball/obsidian-yeet"

    html_url:    "https://community.obsidian.md/plugins/yeet"
    github_url:  "https://github.com/davidvkimball/obsidian-yeet"
    description: "Publish current note's contents as a snapshot to yeet.md. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish the current note to yeet.md with a single hotkey and create immutable snapshots at unique /s/<id> URLs. Store per-snapshot delete tokens to unpublish later, copy published links, list all vault snapshots, and show a status-bar indicator for published or drifted notes."

    stats: {
        downloads:  90
        updated_at: 1780170538000
    }
}
```

[^template]: [[Obsidian plugin]]
