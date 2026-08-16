---
uid: 8d1bfbd4-112e-5edf-a754-6924e9ca3f18
xid:
  - rustshare-vault-sync
aliases:
  - rustshare-vault-sync
  - RustShare Vault Sync
  - zoorpha/rustshare-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/rustshare-vault-sync
alt:
  - https://github.com/zoorpha/rustshare-obsidian-plugin
downloads: 88
updated at: "2026-06-22T23:40:43Z"
related to:
  - "[[GitHub - 1270037242]]"
remind me:
---

# RustShare Vault Sync

RustShare Vault Sync synchronizes a local vault with a RustShare server, using SHA-256 change detection to drive full and incremental transfers. Conflicting edits produce conflict copies, offline changes are queued for later upload, deletions are tracked with tombstones, content-addressed storage deduplicates data, and sync status is shown in the status bar. The recorded description states that RustShare is not affiliated with, endorsed by, or sponsored by Dynalist Inc.

```cue
plugin: {
    id:     "rustshare-vault-sync"
    name:   "RustShare Vault Sync"
    author: "RustShare"
    repo:   "zoorpha/rustshare-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/rustshare-vault-sync"
    github_url:  "https://github.com/zoorpha/rustshare-obsidian-plugin"
    description: "Sync local vaults to RustShare. RustShare is not affiliated with, endorsed by, or sponsored by Dynalist Inc. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with a RustShare server using SHA-256 change detection for full and incremental transfers. Create conflict copies for edits, queue offline changes for later upload, track deletions with tombstones, deduplicate via content-addressed storage, and display real-time sync status in the status bar."

    stats: {
        downloads:  88
        updated_at: 1782171643000
    }
}
```

[^template]: [[Obsidian plugin]]
