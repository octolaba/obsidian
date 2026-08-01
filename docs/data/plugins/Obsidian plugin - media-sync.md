---
uid: c7aea663-89bb-5edc-b9e9-b99521002b1a
xid:
  - media-sync
aliases:
  - media-sync
  - Media Sync
  - fnya/media-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/media-sync
alt:
  - https://github.com/fnya/media-sync
downloads: 6739
updated at: "2024-07-14T08:02:33Z"
related to:
  - "[[GitHub - 683923227]]"
remind me:
---

# Media Sync

Downloads media referenced by HTTPS URLs in notes, including images and PDFs, and stores the files locally in a dedicated resources folder. Markdown links are rewritten to point at the local copies. The run is started globally from the sidebar or per note from the right-click menu, and notes already downloaded are skipped on later runs.

```cue
plugin: {
    id:     "media-sync"
    name:   "Media Sync"
    author: "fnya"
    repo:   "fnya/media-sync"

    html_url:    "https://community.obsidian.md/plugins/media-sync"
    github_url:  "https://github.com/fnya/media-sync"
    description: "Download images from the image URLs in notes and display the content."
    about:       "Download media files (images, PDFs, etc.) referenced by HTTPS URLs in your notes and save them locally. Update Markdown links to local copies, store files in a _media-sync_resouces folder, and run globally from the sidebar or per-note via right-click; already-downloaded notes are skipped on subsequent runs."

    stats: {
        downloads:  6739
        updated_at: 1720944153000
    }
}
```

[^template]: [[Obsidian plugin]]
