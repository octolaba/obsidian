---
uid: 4000e394-0dee-57ea-88a6-dc38b7b8540f
xid:
  - simple-storage-sync-and-backup
aliases:
  - simple-storage-sync-and-backup
  - "S3 Sync + Backup"
  - ceilaolabs/obsidian-s3-sync-and-backup
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-storage-sync-and-backup
alt:
  - https://github.com/ceilaolabs/obsidian-s3-sync-and-backup
downloads: 842
updated at: "2026-07-19T13:00:58Z"
related to:
  - "[[GitHub - 1123049111]]"
remind me:
---

# S3 Sync + Backup

S3 Sync + Backup synchronizes a vault across devices over S3-compatible storage such as AWS S3, Cloudflare R2 or RustFS, reconciling three ways and detecting local changes from per-file SHA-256 baselines. It also takes scheduled backup snapshots and can encrypt data end to end. Conflicts are preserved as LOCAL_ and REMOTE_ copies, and status is shown in the status bar in real time.

```cue
plugin: {
    id:     "simple-storage-sync-and-backup"
    name:   "S3 Sync + Backup"
    author: "Sathindu"
    repo:   "ceilaolabs/obsidian-s3-sync-and-backup"

    html_url:    "https://community.obsidian.md/plugins/simple-storage-sync-and-backup"
    github_url:  "https://github.com/ceilaolabs/obsidian-s3-sync-and-backup"
    description: "Vault synchronization and scheduled backups across devices using S3-compatible storage (AWS S3, Cloudflare R2, RustFS, etc.) with optional end-to-end encryption. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault across devices via S3-compatible storage with bi-directional three-way reconciliation and per-file SHA-256 baselines to detect changes locally. Backup scheduled snapshots, optionally encrypt data end-to-end, preserve conflicts as LOCAL_ and REMOTE_ copies, and display real-time status in the status bar."

    stats: {
        downloads:  842
        updated_at: 1784466058000
    }
}
```

[^template]: [[Obsidian plugin]]
