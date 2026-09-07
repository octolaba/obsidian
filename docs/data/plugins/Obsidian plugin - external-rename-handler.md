---
uid: 2ab486df-d8b9-5008-8113-b551c38466d0
xid:
  - external-rename-handler
aliases:
  - external-rename-handler
  - External Rename Handler
  - mnaoumov/obsidian-external-rename-handler
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/external-rename-handler
alt:
  - https://github.com/mnaoumov/obsidian-external-rename-handler
downloads: 4822
updated at: "2026-08-08T18:08:44Z"
related to:
  - "[[GitHub - 908742831]]"
remind me:
---

# External Rename Handler

External Rename Handler treats a rename made outside the app as a single rename event rather than as separate create and delete actions. It acts only while Obsidian is running and only for tracked files and folders inside the vault. Dot-prefixed items and changes outside the vault are skipped.

```cue
plugin: {
    id:     "external-rename-handler"
    name:   "External Rename Handler"
    author: "Michael Naumov"
    repo:   "mnaoumov/obsidian-external-rename-handler"

    html_url:    "https://community.obsidian.md/plugins/external-rename-handler"
    github_url:  "https://github.com/mnaoumov/obsidian-external-rename-handler"
    description: "Handles renames made outside of the app."
    about:       "Handle renames performed outside Obsidian by treating them as single rename events instead of separate create/delete actions. Operate only while Obsidian is running and only for tracked files and folders inside the vault, skipping dot-prefixed items and changes outside the vault."

    stats: {
        downloads:  4822
        updated_at: 1786212524000
    }
}
```

[^template]: [[Obsidian plugin]]
