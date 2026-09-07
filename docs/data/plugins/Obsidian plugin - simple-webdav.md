---
uid: d975d716-19b0-5f19-8dd6-c8be7866631c
xid:
  - simple-webdav
aliases:
  - simple-webdav
  - Simple WebDAV Sync
  - gghyoo/simple-webdav
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-webdav
alt:
  - https://github.com/gghyoo/simple-webdav
downloads: 227
updated at: "2026-04-12T14:25:36Z"
related to:
  - "[[GitHub - 1208314441]]"
remind me:
---

# Simple WebDAV Sync

Simple WebDAV Sync synchronizes a vault over WebDAV, comparing ETag and SHA-256 values three ways rather than relying on timestamps or server time drift. It performs two-way, real-time and scheduled sync, preserving both versions when a conflict arises and moving deletions to a .sync_trash folder for recovery. Its recorded inputs also state zero dependencies, crash-safe state persistence and a bilingual English and Chinese interface.

```cue
plugin: {
    id:     "simple-webdav"
    name:   "Simple WebDAV Sync"
    author: "gghyoo"
    repo:   "gghyoo/simple-webdav"

    html_url:    "https://community.obsidian.md/plugins/simple-webdav"
    github_url:  "https://github.com/gghyoo/simple-webdav"
    description: "A lightweight WebDAV sync plugin with ETag + SHA-256 three-way comparison. Zero dependencies, bilingual (EN/ZH). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault with WebDAV using ETag and SHA-256 three-way comparison to avoid relying on timestamps or server time drift. Perform two-way, real-time and scheduled sync with conflict safety that preserves both versions, safe-delete recovery to .sync_trash, crash-safe state persistence and bilingual EN/ZH support."

    stats: {
        downloads:  227
        updated_at: 1776003936000
    }
}
```

[^template]: [[Obsidian plugin]]
