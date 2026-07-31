---
uid: cdea72a5-2be0-5831-92d8-b7b8c069385e
xid:
  - obsidian-trash-explorer
aliases:
  - obsidian-trash-explorer
  - Trash Explorer
  - proog/obsidian-trash-explorer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-trash-explorer
alt:
  - https://github.com/proog/obsidian-trash-explorer
downloads: 62502
updated at: "2026-01-10T20:16:58Z"
related to:
  - "[[GitHub - 552270897]]"
remind me:
---

# Trash Explorer

Files and folders in the vault's .trash folder are listed, restored to their matching vault paths, or permanently deleted, and the trash can be emptied in one action. Only Obsidian's own .trash is handled, not the system trash. Because Obsidian may place trashed files at the trash root, the original parent folders are not always preserved.

```cue
plugin: {
    id:     "obsidian-trash-explorer"
    name:   "Trash Explorer"
    author: "proog"
    repo:   "proog/obsidian-trash-explorer"

    html_url:    "https://community.obsidian.md/plugins/obsidian-trash-explorer"
    github_url:  "https://github.com/proog/obsidian-trash-explorer"
    description: "Restore and delete files from the Obsidian .trash folder."
    about:       "List, restore, and permanently delete files and folders in your vault's .trash folder. Restore items back to their matching vault paths or empty the trash to delete all trashed items. Work only with Obsidian's .trash (not the system trash); Obsidian may place trashed files at the trash root, so original parent folders may not be preserved."

    stats: {
        downloads:  62502
        updated_at: 1768076218000
    }
}
```

[^template]: [[Obsidian plugin]]
