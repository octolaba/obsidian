---
uid: 4dc84d4a-06e3-5e18-b820-0e464a59812b
xid:
  - linux-image-rendering-fix
aliases:
  - linux-image-rendering-fix
  - Linux Image Loading Fix
  - evgene-kopylov/linux-image-rendering-fix
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/linux-image-rendering-fix
alt:
  - https://github.com/evgene-kopylov/linux-image-rendering-fix
downloads: 574
updated at: "2026-06-01T12:42:54Z"
related to:
  - "[[GitHub - 1241053897]]"
remind me:
---

# Linux Image Loading Fix

Addresses image rendering on Linux by reading local image files out of the vault and replacing broken app protocol paths with blob URLs, so images display on Ubuntu and other distributions. PNG, JPG, GIF, WebP, SVG, and BMP files are loaded automatically when a page opens, and a reprocess command refreshes images on demand.

```cue
plugin: {
    id:     "linux-image-rendering-fix"
    name:   "Linux Image Loading Fix"
    author: "evgene-kopylov"
    repo:   "evgene-kopylov/linux-image-rendering-fix"

    html_url:    "https://community.obsidian.md/plugins/linux-image-rendering-fix"
    github_url:  "https://github.com/evgene-kopylov/linux-image-rendering-fix"
    description: "Fixes image rendering issues on Linux. Ensures images display correctly on Ubuntu and other Linux distributions. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Fix image rendering in Obsidian on Linux by reading local image files from the vault and replacing broken app:// paths with blob: URLs. Load PNG, JPG, GIF, WebP, SVG and BMP automatically on page open and run a reprocess command to refresh images."

    stats: {
        downloads:  574
        updated_at: 1780317774000
    }
}
```

[^template]: [[Obsidian plugin]]
