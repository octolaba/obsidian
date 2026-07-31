---
uid: cb59bab0-37d4-5b19-9d16-c6c831411805
xid:
  - obsidian-local-images
aliases:
  - obsidian-local-images
  - Local images
  - aleksey-rezvov/obsidian-local-images
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-local-images
alt:
  - https://github.com/aleksey-rezvov/obsidian-local-images
downloads: 43980
updated at: "2021-10-17T14:27:47Z"
related to:
  - "[[GitHub - 408438420]]"
remind me:
---

# Local images

This plugin finds links to external images in notes, downloads them and saves them locally, then adjusts the links to point at the saved files. Images are stored in a media folder, and either the active note or the entire vault can be processed. It can also run automatically when external images are pasted, keeping copied web images local and avoiding broken links.

```cue
plugin: {
    id:     "obsidian-local-images"
    name:   "Local images"
    author: "aleksey-rezvov"
    repo:   "aleksey-rezvov/obsidian-local-images"

    html_url:    "https://community.obsidian.md/plugins/obsidian-local-images"
    github_url:  "https://github.com/aleksey-rezvov/obsidian-local-images"
    description: "Find all links to external images in your notes, download and save images locally, and adjust the image links in your notes to point to the saved image files."
    about:       "Download external image links into your vault and replace remote URLs with local files stored in a media folder. Process the active note or the entire vault and run automatically when pasting external images to keep copied web images local and avoid broken links."

    stats: {
        downloads:  43980
        updated_at: 1634480867000
    }
}
```

[^template]: [[Obsidian plugin]]
