---
uid: 9661cfdb-b26a-5600-9463-2df168b163b5
xid:
  - tiff-viewer
aliases:
  - tiff-viewer
  - Tiff Viewer
  - ullmannjan/obsidian-tiff-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tiff-viewer
alt:
  - https://github.com/ullmannjan/obsidian-tiff-viewer
downloads: 1866
updated at: "2024-04-15T16:15:27Z"
related to:
  - "[[GitHub - 753054683]]"
remind me:
---

# Tiff Viewer

Tiff Viewer converts linked .tif and .tiff images into .png duplicates written beside the originals so the images display in Obsidian. Links in the editor are renamed to point at the .png versions, commands revert those links or delete the generated files, and a file-explorer action creates a PNG copy on demand.

```cue
plugin: {
    id:     "tiff-viewer"
    name:   "Tiff Viewer"
    author: "ullmannjan"
    repo:   "ullmannjan/obsidian-tiff-viewer"

    html_url:    "https://community.obsidian.md/plugins/tiff-viewer"
    github_url:  "https://github.com/ullmannjan/obsidian-tiff-viewer"
    description: "View .tif(f) files by generating duplicates in form of .tif(f).png"
    about:       "Convert linked .tif/.tiff images to .png and create PNG copies beside the originals so images display in Obsidian. Rename file links in the editor to point to the .png versions, offer commands to revert links or delete generated .png files, and add a file-explorer action to create a PNG copy."

    stats: {
        downloads:  1866
        updated_at: 1713197727000
    }
}
```

[^template]: [[Obsidian plugin]]
