---
uid: 178cd04d-0af1-5695-92b6-92c70f361a0d
xid:
  - foldercanvas
aliases:
  - foldercanvas
  - Folder Canvas
  - nancyel/obsidian-foldercanvas-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/foldercanvas
alt:
  - https://github.com/nancyel/obsidian-foldercanvas-plugin
downloads: 3157
updated at: "2025-07-01T07:31:32Z"
related to:
  - "[[GitHub - 886531874]]"
remind me:
---

# Folder Canvas

Generates a Canvas view from the first-level Markdown files of a folder and saves it as a canvas file in the parent folder, incrementing the filename to avoid conflicts. Nested folders are ignored, and a node's content is narrowed to a selected heading when one is available. A watched folder keeps the latest Canvas file synced with changes.

```cue
plugin: {
    id:     "foldercanvas"
    name:   "Folder Canvas"
    author: "nancyel"
    repo:   "nancyel/obsidian-foldercanvas-plugin"

    html_url:    "https://community.obsidian.md/plugins/foldercanvas"
    github_url:  "https://github.com/nancyel/obsidian-foldercanvas-plugin"
    description: "Generate a Canvas view of your folder structure."
    about:       "Generate a Canvas view from a folder's first-level Markdown files and save it as a .canvas file in the parent folder, auto-incrementing filenames to avoid conflicts. Ignore nested folders and display node content narrowed to a selected heading when available. Watch a folder to keep the latest Canvas file synced with changes."

    stats: {
        downloads:  3157
        updated_at: 1751355092000
    }
}
```

[^template]: [[Obsidian plugin]]
