---
uid: 4426dbc9-e95e-594a-ad14-349c0b2a03f5
xid:
  - mega-sync
aliases:
  - mega-sync
  - MEGA Sync
  - ledokter/obsidian-mega-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mega-sync
alt:
  - https://github.com/ledokter/obsidian-mega-sync
downloads: 79
updated at: "2026-08-08T13:32:52Z"
related to:
  - "[[GitHub - 1325439668]]"
remind me:
---

# MEGA Sync

Synchronizes a vault with a folder on a MEGA.nz account in both directions, merging changes three ways against the snapshot of the last sync. A shared snapshot file records that state, conflicting versions are written out as separate copies, and deletions go to a reversible trash. Include and exclude filters limit what is synced, and a status bar item, ribbon icon and sync log report what happened.

```cue
plugin: {
    id:     "mega-sync"
    name:   "MEGA Sync"
    author: "Thomas "
    repo:   "ledokter/obsidian-mega-sync"

    html_url:    "https://community.obsidian.md/plugins/mega-sync"
    github_url:  "https://github.com/ledokter/obsidian-mega-sync"
    description: "Two-way sync between your Obsidian vault and your MEGA.nz cloud, inspired by Remotely Save. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with a folder on your MEGA.nz account using two-way synchronization and a three-way merge against the last-sync snapshot. Protect data with a shared _mega_sync_snapshot.json, conflict-file copies, reversible trash, include/exclude filters, and a status bar, ribbon icon and sync log."

    stats: {
        downloads:  79
        updated_at: 1786195972000
    }
}
```

[^template]: [[Obsidian plugin]]
