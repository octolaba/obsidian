---
uid: fcba6420-1525-51c2-b8c9-b697f695ec37
xid:
  - seafile-continued
aliases:
  - seafile-continued
  - Seafile Sync
  - ryanravn/obsidian-seafile-continued
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/seafile-continued
alt:
  - https://github.com/ryanravn/obsidian-seafile-continued
downloads: 450
updated at: "2026-07-02T15:41:17Z"
related to:
  - "[[GitHub - 1231320333]]"
remind me:
---

# Seafile Sync

Seafile Sync synchronizes notes across devices through Seafile, using delta uploads and downloads. Encrypted repositories in the enc v2 and v4 formats are supported with a prompted passphrase that is never stored in plaintext, and a Sync now command triggers an immediate sync. Files larger than 50 MB should not be synced, because of Obsidian API limits.

```cue
plugin: {
    id:     "seafile-continued"
    name:   "Seafile Sync"
    author: "ryanravn"
    repo:   "ryanravn/obsidian-seafile-continued"

    html_url:    "https://community.obsidian.md/plugins/seafile-continued"
    github_url:  "https://github.com/ryanravn/obsidian-seafile-continued"
    description: "Sync notes across devices using Seafile. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync notes across devices with Seafile for fast delta uploads and downloads. Protect encrypted repositories (enc v2/v4) with a prompted passphrase never stored in plaintext; trigger immediate sync via the Sync now command. Avoid syncing large files (>50 MB) due to Obsidian API limits."

    stats: {
        downloads:  450
        updated_at: 1783006877000
    }
}
```

[^template]: [[Obsidian plugin]]
