---
uid: 804487cb-48d9-5960-9d95-41274798dbb6
xid:
  - unique-attachments
aliases:
  - unique-attachments
  - Unique attachments
  - dy-sh/obsidian-unique-attachments
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/unique-attachments
alt:
  - https://github.com/dy-sh/obsidian-unique-attachments
downloads: 14283
updated at: "2026-04-22T12:52:12Z"
related to:
  - "[[GitHub - 347434104]]"
remind me:
---

# Unique attachments

Renames attachments to content-based MD5 filenames, so identical files end up with the same name and different content with different names. Links across the notes are updated, duplicate files in the same folder can optionally be deleted, and renaming can be limited to linked or active attachments.

```cue
plugin: {
    id:     "unique-attachments"
    name:   "Unique attachments"
    author: "dy-sh"
    repo:   "dy-sh/obsidian-unique-attachments"

    html_url:    "https://community.obsidian.md/plugins/unique-attachments"
    github_url:  "https://github.com/dy-sh/obsidian-unique-attachments"
    description: "Rename attachments, making their names unique (based on hashing of file content)."
    about:       "Rename attachments to content-based MD5 filenames so identical files get the same name and different content gets unique names. Update links across notes, optionally delete duplicate files in the same folder, and restrict renaming to linked or active attachments."

    stats: {
        downloads:  14283
        updated_at: 1776862332000
    }
}
```

[^template]: [[Obsidian plugin]]
