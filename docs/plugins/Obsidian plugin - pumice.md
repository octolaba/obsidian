---
uid: ecf6a86d-e450-5eec-a243-718c511ddd77
xid:
  - pumice
aliases:
  - pumice
  - Pumice
  - search5/pumice
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pumice
alt:
  - https://github.com/search5/pumice
downloads: 39
updated at: "2026-07-19T16:36:18Z"
related to:
  - "[[GitHub - 1190379982]]"
remind me:
---

# Pumice

Syncs the vault against a self-hosted pumice-server over gRPC-Web streaming, transferring files concurrently and delta-only. Sync history is browsed to recover files, local snapshots are kept under a retention setting, and chosen folders are published. Authentication uses a static token held in the OS keychain.

```cue
plugin: {
    id:     "pumice"
    name:   "Pumice"
    author: "Ji-ho Lee"
    repo:   "search5/pumice"

    html_url:    "https://community.obsidian.md/plugins/pumice"
    github_url:  "https://github.com/search5/pumice"
    description: "Sync, version, and publish your vault over your own self-hosted gRPC server. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault with a self-hosted pumice-server using gRPC‑Web streaming for concurrent, delta-only file transfers. Browse sync history and recover files, keep local snapshots with retention, publish chosen folders, and authenticate via a static token in the OS keychain."

    stats: {
        downloads:  39
        updated_at: 1784478978000
    }
}
```

[^template]: [[Obsidian plugin]]
