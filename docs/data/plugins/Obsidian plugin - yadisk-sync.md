---
uid: 5dbe155f-acd3-5ddc-b82e-7956b1bff39e
xid:
  - yadisk-sync
aliases:
  - yadisk-sync
  - Yandex Disk Sync
  - nikolay-eltsov/obsidian-yadisk-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/yadisk-sync
alt:
  - https://github.com/nikolay-eltsov/obsidian-yadisk-sync
downloads: 1809
updated at: "2026-07-27T11:57:15Z"
related to:
  - "[[GitHub - 1183188382]]"
remind me:
---

# Yandex Disk Sync

Synchronizes a vault with Yandex Disk in both directions, using a three-way merge to detect changes and resolving conflicts per file as local, remote or skip. Auto-sync reacts to create, edit, delete and rename events, one-way push or pull is available, and files are excluded by glob pattern or by size. It is described as working on iPad and iPhone as well.

```cue
plugin: {
    id:     "yadisk-sync"
    name:   "Yandex Disk Sync"
    author: "nikolay-eltsov"
    repo:   "nikolay-eltsov/obsidian-yadisk-sync"

    html_url:    "https://community.obsidian.md/plugins/yadisk-sync"
    github_url:  "https://github.com/nikolay-eltsov/obsidian-yadisk-sync"
    description: "Synchronize your vault with Yandex Disk. Supports bidirectional sync, conflict resolution, and works on mobile. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with Yandex Disk bidirectionally using a three-way merge to detect changes and resolve conflicts per file (choose local, remote, or skip). Enable auto-sync on create/edit/delete/rename, use one-way push/pull when needed, and skip files by glob patterns or size; works on iPad/iPhone."

    stats: {
        downloads:  1809
        updated_at: 1785153435000
    }
}
```

[^template]: [[Obsidian plugin]]
