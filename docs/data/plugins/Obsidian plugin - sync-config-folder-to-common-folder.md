---
uid: cbd8b522-b6fd-5941-b8f3-57514c52ffbc
xid:
  - sync-config-folder-to-common-folder
aliases:
  - sync-config-folder-to-common-folder
  - Sync config folder to common folder
  - codeonquer/obsidian-sync-config-folder-to-common-folder
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sync-config-folder-to-common-folder
alt:
  - https://github.com/codeonquer/obsidian-sync-config-folder-to-common-folder
downloads: 1162
updated at: "2024-12-16T09:54:28Z"
related to:
  - "[[GitHub - 777613913]]"
remind me:
---

# Sync config folder to common folder

Copies the contents of the vault's dot-prefixed Obsidian config folder into an ordinary folder, for backup or other purposes, and restores them again. The recorded About text names Sync and Restore commands for the two directions. The target folder is given either as a path relative to the vault root or as an absolute path.

```cue
plugin: {
    id:     "sync-config-folder-to-common-folder"
    name:   "Sync config folder to common folder"
    author: "codeonquer"
    repo:   "codeonquer/obsidian-sync-config-folder-to-common-folder"

    html_url:    "https://community.obsidian.md/plugins/sync-config-folder-to-common-folder"
    github_url:  "https://github.com/codeonquer/obsidian-sync-config-folder-to-common-folder"
    description: "Sync contents from config folder to common folder for backup or other purposes."
    about:       "Sync the Vault's dot-prefixed Obsidian config folder to a normal folder and restore it back with Sync and Restore commands. Specify the common folder with a relative path (from the Vault root) or an absolute path."

    stats: {
        downloads:  1162
        updated_at: 1734342868000
    }
}
```

[^template]: [[Obsidian plugin]]
