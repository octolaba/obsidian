---
uid: 0bbd829b-d34d-5404-97c6-6628ef51fd42
xid:
  - obsidian-filename-heading-sync
aliases:
  - obsidian-filename-heading-sync
  - Filename Heading Sync
  - dvcrn/obsidian-filename-heading-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-filename-heading-sync
alt:
  - https://github.com/dvcrn/obsidian-filename-heading-sync
downloads: 68593
updated at: "2026-03-03T00:02:47Z"
related to:
  - "[[GitHub - 333091916]]"
remind me:
---

# Filename Heading Sync

Keeps a file's name and its first heading in sync in both directions, so renaming the file updates the heading and editing the heading renames the file. A heading is inserted when one is missing and the sync also runs on file open, which the recorded inputs flag as a warning that opening a file will overwrite its top heading.

```cue
plugin: {
    id:     "obsidian-filename-heading-sync"
    name:   "Filename Heading Sync"
    author: "dvcrn"
    repo:   "dvcrn/obsidian-filename-heading-sync"

    html_url:    "https://community.obsidian.md/plugins/obsidian-filename-heading-sync"
    github_url:  "https://github.com/dvcrn/obsidian-filename-heading-sync"
    description: "Keep the filename with the first heading of a file in sync."
    about:       "Sync filename and first heading bidirectionally: renaming a file updates its first heading, and changing the first heading renames the file. Insert a heading if missing and update on file open — warning: opening a file will overwrite its top heading."

    stats: {
        downloads:  68593
        updated_at: 1772496167000
    }
}
```

[^template]: [[Obsidian plugin]]
