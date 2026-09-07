---
uid: 56db7de8-a4bd-58a7-ae46-11a0c8c4f682
xid:
  - zettlab-sync
aliases:
  - zettlab-sync
  - Zettlab Sync
  - wyc7758775/zettlab-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/zettlab-sync
alt:
  - https://github.com/wyc7758775/zettlab-sync
downloads: 31
updated at: "2026-08-04T10:41:12Z"
related to:
  - "[[GitHub - 1305459802]]"
remind me:
---

# Zettlab Sync

Synchronizes the vault with Zettlab Memo over WebDAV, leaving notes as plaintext Markdown on both sides. Authentication is Basic or Digest, connections can be tested from the settings, and syncing runs manually, periodically, or optionally after each save. Conflicts are resolved by keeping the newer or the larger file, files can be excluded by size or path, and credentials stay local with no telemetry sent.

```cue
plugin: {
    id:     "zettlab-sync"
    name:   "Zettlab Sync"
    author: "yoran"
    repo:   "wyc7758775/zettlab-sync"

    html_url:    "https://community.obsidian.md/plugins/zettlab-sync"
    github_url:  "https://github.com/wyc7758775/zettlab-sync"
    description: "Sync your Markdown vault with Zettlab Memo over WebDAV. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with Zettlab Memo over WebDAV while keeping notes as plaintext Markdown for indexing and use. Authenticate via Basic or Digest, run manual or periodic syncs (optional after-save), test connections, resolve conflicts by keeping newer or larger files, and exclude files by size or path; credentials stay local and no telemetry is sent."

    stats: {
        downloads:  31
        updated_at: 1785840072000
    }
}
```

[^template]: [[Obsidian plugin]]
