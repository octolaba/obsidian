---
uid: 7b68c100-8adf-5f35-9014-feb97246b458
xid:
  - create-note-in-folder
aliases:
  - create-note-in-folder
  - Create Note in Folder
  - mara-li/obsidian-create-note-in-folder
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/create-note-in-folder
alt:
  - https://github.com/mara-li/obsidian-create-note-in-folder
downloads: 15375
updated at: "2026-05-20T07:56:41Z"
related to:
  - "[[GitHub - 600896354]]"
remind me:
---

# Create Note in Folder

Create Note in Folder adds commands that create a note directly in a specified folder path. Each configured folder can carry its own filename and template through Templater, use a placeholder for the current file path, and decide where the new note opens and whether it takes focus. The commands can also be surfaced in the file menu and the quick switcher.

```cue
plugin: {
    id:     "create-note-in-folder"
    name:   "Create Note in Folder"
    author: "Mara"
    repo:   "mara-li/obsidian-create-note-in-folder"

    html_url:    "https://community.obsidian.md/plugins/create-note-in-folder"
    github_url:  "https://github.com/mara-li/obsidian-create-note-in-folder"
    description: "Add commands to create a note in a specific folder."
    about:       "Create notes directly in specified folder paths with a dedicated command. Configure per-folder behavior: set filenames and templates (Templater), use {{current}} for the current file path, choose where to open and focus notes, and expose commands in the file menu or quick-switcher."

    stats: {
        downloads:  15375
        updated_at: 1779263801000
    }
}
```

[^template]: [[Obsidian plugin]]
