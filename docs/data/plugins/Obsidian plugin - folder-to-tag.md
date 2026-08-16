---
uid: a59c0393-2316-5901-9a32-466507907be2
xid:
  - folder-to-tag
aliases:
  - folder-to-tag
  - Folder to Tag
  - merijnvervoorn/obsidian-folder-to-tag
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/folder-to-tag
alt:
  - https://github.com/merijnvervoorn/obsidian-folder-to-tag
downloads: 308
updated at: "2026-06-18T22:15:44Z"
related to:
  - "[[GitHub - 1089479932]]"
remind me:
---

# Folder to Tag

Derives a tag from the folder a note sits in and writes it into the note's frontmatter. The tag is updated when the note is created, moved or renamed, and every other frontmatter field is preserved. Folder depth and tag formatting are configurable, with an optional prefix or suffix.

```cue
plugin: {
    id:     "folder-to-tag"
    name:   "Folder to Tag"
    author: "merijnvervoorn"
    repo:   "merijnvervoorn/obsidian-folder-to-tag"

    html_url:    "https://community.obsidian.md/plugins/folder-to-tag"
    github_url:  "https://github.com/merijnvervoorn/obsidian-folder-to-tag"
    description: "Automatically adds or updates a tag based on the folder a note is in. Updates both on creation and file move. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Tag notes based on their folder path by adding folder-derived tags to each note's frontmatter. Update tags automatically when notes move or are renamed, preserve all other frontmatter fields, and configure folder depth and tag formatting with optional prefix or suffix."

    stats: {
        downloads:  308
        updated_at: 1781820944000
    }
}
```

[^template]: [[Obsidian plugin]]
