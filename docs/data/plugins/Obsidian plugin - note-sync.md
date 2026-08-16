---
uid: f2708a2f-6f15-5b0b-828f-864b877bac96
xid:
  - note-sync
aliases:
  - note-sync
  - Note Sync
  - zigholding/obsidian-notesync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/note-sync
alt:
  - https://github.com/zigholding/obsidian-notesync-plugin
downloads: 943
updated at: "2026-08-08T15:55:48Z"
related to:
  - "[[GitHub - 790213931]]"
remind me:
---

# Note Sync

Copies notes, embedded attachments and folder structure from one vault to another, overwriting a target file only when the source is newer. Plugins can be exported with an optional data.json, notes can be exported as a README with asset and metadata options, and files or folders can be downloaded from configured Git repositories by selecting individual items or all of them.

```cue
plugin: {
    id:     "note-sync"
    name:   "Note Sync"
    author: "zigholding"
    repo:   "zigholding/obsidian-notesync-plugin"

    html_url:    "https://community.obsidian.md/plugins/note-sync"
    github_url:  "https://github.com/zigholding/obsidian-notesync-plugin"
    description: "Sync notes or plugins between vaults."
    about:       "Sync files and folders to another vault, copying notes, embedded attachments and folder structure while overwriting only if the source is newer. Export plugins (with optional data.json) and export notes as README with asset and metadata options; download files or folders from configured Git repositories by selecting items or \"all\"."

    stats: {
        downloads:  943
        updated_at: 1786204548000
    }
}
```

[^template]: [[Obsidian plugin]]
