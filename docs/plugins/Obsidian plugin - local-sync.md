---
uid: e18826ac-d80a-58b8-ab1d-50fb7cdda90a
xid:
  - local-sync
aliases:
  - local-sync
  - Local Sync
  - liuboacean/obsidian-local-sync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/local-sync
alt:
  - https://github.com/liuboacean/obsidian-local-sync-plugin
downloads: 154
updated at: "2026-07-07T02:16:46Z"
related to:
  - "[[GitHub - 1285896313]]"
remind me:
---

# Local Sync

Synchronizes vaults bidirectionally across a LAN over peer-to-peer WebSocket connections, with no cloud dependency. Text edits are merged automatically with Yjs CRDTs to prevent conflicts, transfers are authenticated with a pre-shared key, and peers are discovered over UDP or by QR pairing. Folders and file types can be excluded from the sync.

```cue
plugin: {
    id:     "local-sync"
    name:   "Local Sync"
    author: "Liu Bo"
    repo:   "liuboacean/obsidian-local-sync-plugin"

    html_url:    "https://community.obsidian.md/plugins/local-sync"
    github_url:  "https://github.com/liuboacean/obsidian-local-sync-plugin"
    description: "LAN bidirectional vault sync — CRDT auto-merge, PSK auth, UDP discovery - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Obsidian vaults over your LAN via peer-to-peer WebSocket connections with no cloud dependency. Automatically merge text edits using Yjs CRDT to prevent conflicts, secure transfers with PSK authentication, discover peers via UDP or QR pairing, and selectively exclude folders or file types."

    stats: {
        downloads:  154
        updated_at: 1783390606000
    }
}
```

[^template]: [[Obsidian plugin]]
