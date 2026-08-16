---
uid: 82e83693-1245-5851-b5bf-2fd41ea77272
xid:
  - nextcloud-sync
aliases:
  - nextcloud-sync
  - Nextcloud Sync
  - siosig/obsidian-nextcloudsync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nextcloud-sync
alt:
  - https://github.com/siosig/obsidian-nextcloudsync
downloads: 6606
updated at: "2026-08-07T13:13:15Z"
related to:
  - "[[GitHub - 1262599623]]"
remind me:
---

# Nextcloud Sync

Nextcloud Sync keeps a vault and a Nextcloud account in step in both directions, detecting changes by hash and using Nextcloud's own APIs for checksums, file IDs, locking and chunked uploads. Renames are preserved, files can be recovered from the trash and version history browsed, and the plugin falls back to WebDAV when needed.

```cue
plugin: {
    id:     "nextcloud-sync"
    name:   "Nextcloud Sync"
    author: "Daisuke ITO"
    repo:   "siosig/obsidian-nextcloudsync"

    html_url:    "https://community.obsidian.md/plugins/nextcloud-sync"
    github_url:  "https://github.com/siosig/obsidian-nextcloudsync"
    description: "Bidirectional sync between Obsidian and Nextcloud using hash-based change detection. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with Nextcloud bidirectionally using Nextcloud's APIs for checksums, file IDs, locking and chunked uploads for safe, accurate sync. Preserve renames, recover from trash, browse version history and fall back to WebDAV when needed."

    stats: {
        downloads:  6606
        updated_at: 1786108395000
    }
}
```

[^template]: [[Obsidian plugin]]
