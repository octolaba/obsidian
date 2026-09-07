---
uid: 4659c8cb-09b1-5805-81ff-ab41d95841a2
xid:
  - nox-sync
aliases:
  - nox-sync
  - NoX Sync
  - mapherez/nox-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nox-sync
alt:
  - https://github.com/mapherez/nox-sync
downloads: 101
updated at: "2026-08-07T16:50:15Z"
related to:
  - "[[GitHub - 1237913025]]"
remind me:
---

# NoX Sync

Synchronizes vaults with a self-hosted backend on demand, with the synchronization run manually rather than continuously. Several remote vaults can be managed through manifest-based uploads and downloads with SHA-256 validation, staged commits, conflict handling and safe trashing of deleted files, and access uses per-user API keys with a Google-authenticated dashboard. The recorded description states that a user-run NoX Sync backend is required.

```cue
plugin: {
    id:     "nox-sync"
    name:   "NoX Sync"
    author: "Mapherez"
    repo:   "mapherez/nox-sync"

    html_url:    "https://community.obsidian.md/plugins/nox-sync"
    github_url:  "https://github.com/mapherez/nox-sync"
    description: "Manual self-hosted sync for your vaults. Requires a user-run NoX Sync backend. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Obsidian vaults to a private, self-hosted backend with manual, on-demand synchronization, Google-authenticated dashboard access, and per-user API keys. Manage multiple remote vaults with manifest-based uploads/downloads, SHA-256 validation, staged commits, conflict handling, and safe trashing of deleted files."

    stats: {
        downloads:  101
        updated_at: 1786121415000
    }
}
```

[^template]: [[Obsidian plugin]]
