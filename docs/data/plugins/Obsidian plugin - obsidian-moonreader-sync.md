---
uid: 436ce60a-9de1-5bb6-8850-8b221b6972c1
xid:
  - obsidian-moonreader-sync
aliases:
  - obsidian-moonreader-sync
  - MoonReader Note Sync
  - seeyou2n1ght/obsidian-MoonReaderNoteSync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-moonreader-sync
alt:
  - https://github.com/seeyou2n1ght/obsidian-MoonReaderNoteSync
downloads: 58
updated at: "2026-07-06T09:15:05Z"
related to:
  - "[[GitHub - 1245522256]]"
remind me:
---

# MoonReader Note Sync

This plugin syncs Moon+ Reader highlights and notes from WebDAV into the vault, parsing .an files directly with PROPFIND-based incremental updates and an offline cache. WebDAV credentials are encrypted with a local AES key stored outside the vault. The zlib-compressed .an files are parsed into Markdown highlights and notes, and the output is designed with a drag-and-drop template builder and a live preview. The Plugin Index records that this plugin has not been manually reviewed by Obsidian staff.

```cue
plugin: {
    id:     "obsidian-moonreader-sync"
    name:   "MoonReader Note Sync"
    author: "seeyou2night"
    repo:   "seeyou2n1ght/obsidian-MoonReaderNoteSync"

    html_url:    "https://community.obsidian.md/plugins/obsidian-moonreader-sync"
    github_url:  "https://github.com/seeyou2n1ght/obsidian-MoonReaderNoteSync"
    description: "Sync MoonReader reading notes via WebDAV and parse .an files directly into your Vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Moon+ Reader (.an) highlights and notes from WebDAV into your Vault with smart PROPFIND-based incremental updates and offline cache. Encrypt WebDAV credentials with a local AES key stored outside the Vault, parse zlib-compressed .an files to extract highlights/notes into Markdown, and design output with a drag-and-drop template builder and live preview."

    stats: {
        downloads:  58
        updated_at: 1783329305000
    }
}
```

[^template]: [[Obsidian plugin]]
