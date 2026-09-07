---
uid: 600a71d5-c765-57e0-8088-2498ab72891d
xid:
  - mybox-sync
aliases:
  - mybox-sync
  - MYBOX Sync
  - choihc/mybox-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mybox-sync
alt:
  - https://github.com/choihc/mybox-sync
downloads: 2
updated at: "2026-08-11T07:31:25Z"
related to:
  - "[[GitHub - 1330565953]]"
remind me:
---

# MYBOX Sync

Pushes a single mapped vault folder to NAVER MYBOX one way, propagating local file creations, edits, renames, moves and deletions automatically. Remote changes are pulled on demand. A NAVER account and a MYBOX Personal Access Token are required, and transfers run over the MYBOX Open API.

```cue
plugin: {
    id:     "mybox-sync"
    name:   "MYBOX Sync"
    author: "Hyeoncheol Choi"
    repo:   "choihc/mybox-sync"

    html_url:    "https://community.obsidian.md/plugins/mybox-sync"
    github_url:  "https://github.com/choihc/mybox-sync"
    description: "Automatically sync a mapped folder to NAVER MYBOX (upload/rename/move/trash) with a manual pull, via the MYBOX Open API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync a single mapped vault folder to NAVER MYBOX with one-way automatic push of local file creations, edits, renames, moves and deletions. Pull remote changes on demand. Provide a NAVER account and a MYBOX Personal Access Token (PAT) to enable sync."

    stats: {
        downloads:  2
        updated_at: 1786433485000
    }
}
```

[^template]: [[Obsidian plugin]]
