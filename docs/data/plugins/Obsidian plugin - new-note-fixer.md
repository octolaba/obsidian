---
uid: 95bbfc9e-a163-584b-9114-fec3902333f9
xid:
  - new-note-fixer
aliases:
  - new-note-fixer
  - New Note Fixer
  - mnaoumov/obsidian-new-note-fixer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/new-note-fixer
alt:
  - https://github.com/mnaoumov/obsidian-new-note-fixer
downloads: 2830
updated at: "2026-08-08T19:04:00Z"
related to:
  - "[[GitHub - 913617310]]"
remind me:
---

# New Note Fixer

New Note Fixer unifies how notes are created from links that do not exist yet, so links carrying folder or relative paths respect the Default location for new notes setting. It also stops files being created outside the vault and removes the misleading Folder already exists error shown when opening a non-existent link.

```cue
plugin: {
    id:     "new-note-fixer"
    name:   "New Note Fixer"
    author: "Michael Naumov"
    repo:   "mnaoumov/obsidian-new-note-fixer"

    html_url:    "https://community.obsidian.md/plugins/new-note-fixer"
    github_url:  "https://github.com/mnaoumov/obsidian-new-note-fixer"
    description: "Unifies the way non-existing notes are created when clicking on their links."
    about:       "Fix new-note creation behavior so clicking links with folder or relative paths respects the Default location for new notes setting. Prevent creation of files outside the vault and remove misleading \"Folder already exists\" errors when opening non-existent links."

    stats: {
        downloads:  2830
        updated_at: 1786215840000
    }
}
```

[^template]: [[Obsidian plugin]]
