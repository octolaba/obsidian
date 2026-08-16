---
uid: 3cf3d829-b566-54b7-9592-78fcd511db80
xid:
  - convert-base64-to-png
aliases:
  - convert-base64-to-png
  - Convert Base64 to PNG
  - nykkolin/obsidian-convert-base64-to-png
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/convert-base64-to-png
alt:
  - https://github.com/nykkolin/obsidian-convert-base64-to-png
downloads: 1429
updated at: "2025-04-30T11:55:47Z"
related to:
  - "[[GitHub - 964435296]]"
remind me:
---

# Convert Base64 to PNG

This plugin converts base64-encoded images embedded in notes into local PNG files, which shrinks the Markdown and improves portability. Detected base64 images are decoded into a chosen folder and the links in the note are updated. It can process the current file or the entire vault, and can convert automatically on paste.

```cue
plugin: {
    id:     "convert-base64-to-png"
    name:   "Convert Base64 to PNG"
    author: "nykkolin"
    repo:   "nykkolin/obsidian-convert-base64-to-png"

    html_url:    "https://community.obsidian.md/plugins/convert-base64-to-png"
    github_url:  "https://github.com/nykkolin/obsidian-convert-base64-to-png"
    description: "Convert base64-encoded images in notes to local PNG images."
    about:       "Convert base64-encoded images in your notes into local PNG files to shrink markdown size and improve portability. Detect base64 images automatically and save decoded PNGs to a chosen folder while updating links in your notes. Process the current file or the entire vault and enable automatic conversion on paste."

    stats: {
        downloads:  1429
        updated_at: 1746014147000
    }
}
```

[^template]: [[Obsidian plugin]]
