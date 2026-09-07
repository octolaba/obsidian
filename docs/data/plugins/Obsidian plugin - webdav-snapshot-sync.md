---
uid: 3bd5daca-290c-554b-baf5-bb55bf4a61e4
xid:
  - webdav-snapshot-sync
aliases:
  - webdav-snapshot-sync
  - WebDAV Snapshot Sync
  - pengggxp/webdav_sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/webdav-snapshot-sync
alt:
  - https://github.com/pengggxp/webdav_sync
downloads: 136
updated at: "2026-06-27T09:21:04Z"
related to:
  - "[[GitHub - 1260198413]]"
remind me:
---

# WebDAV Snapshot Sync

Packs the vault into a manual zip snapshot and uploads or downloads it over WebDAV, tracking metadata and an index alongside it. Restoring first uploads a backup of the current state, then deletes the scoped local files and writes the remote content, preserving creation and modification times where the server supports it. Ignore rules decide what is included, and old snapshots are pruned by hand.

```cue
plugin: {
    id:     "webdav-snapshot-sync"
    name:   "WebDAV Snapshot Sync"
    author: "pengGgxp"
    repo:   "pengggxp/webdav_sync"

    html_url:    "https://community.obsidian.md/plugins/webdav-snapshot-sync"
    github_url:  "https://github.com/pengggxp/webdav_sync"
    description: "通过 WebDAV 手动上传和恢复整个库的快照包，恢复前会强制创建安全备份。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create manual zip snapshots of your vault and upload or download them to WebDAV, with metadata and index tracking. Upload a before-download backup before restoring a selected snapshot, delete scoped local files then write remote content (preserve ctime/mtime when supported), honor ignore rules, and manually prune old snapshots."

    stats: {
        downloads:  136
        updated_at: 1782552064000
    }
}
```

[^template]: [[Obsidian plugin]]
