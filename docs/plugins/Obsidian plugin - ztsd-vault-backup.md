---
uid: 0782f96a-e843-53c0-81b4-73aab0239096
xid:
  - ztsd-vault-backup
aliases:
  - ztsd-vault-backup
  - Ztsd Vault Backup
  - aplikofi/Obsidian-bckp-Plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ztsd-vault-backup
alt:
  - https://github.com/aplikofi/Obsidian-bckp-Plugin
downloads: 48
updated at: "2026-07-01T15:57:09Z"
related to:
  - "[[GitHub - 1286121269]]"
remind me:
---

# Ztsd Vault Backup

This plugin creates compressed, cryptographically verified backups of a vault using tar and Zstandard compression streams written in pure JS/TS, so no external binaries are needed. SHA-256 checksums are verified before a snapshot is restored, and restoration is non-destructive: the snapshot lands in a timestamped recovery folder. Retention is configurable and prunes old backups on a time-tiered GFS schedule.

```cue
plugin: {
    id:     "ztsd-vault-backup"
    name:   "Ztsd Vault Backup"
    author: "aplikofi"
    repo:   "aplikofi/Obsidian-bckp-Plugin"

    html_url:    "https://community.obsidian.md/plugins/ztsd-vault-backup"
    github_url:  "https://github.com/aplikofi/Obsidian-bckp-Plugin"
    description: "High-performance vault backups using native Zstandard compression streams, SHA256 integrity checks, and GFS time-tiered retention. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create compressed, cryptographically verified backups of your vault using tar and Zstandard in pure JS/TS with no external binaries. Verify SHA-256 checksums and restore snapshots non-destructively into timestamped recovery folders, with configurable retention to prune old backups."

    stats: {
        downloads:  48
        updated_at: 1782921429000
    }
}
```

[^template]: [[Obsidian plugin]]
