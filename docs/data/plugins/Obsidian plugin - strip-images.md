---
uid: 496ecda8-0de2-5ea0-9c00-382136bf5f29
xid:
  - strip-images
aliases:
  - strip-images
  - Strip Images
  - dwsun/obs-StripImages
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/strip-images
alt:
  - https://github.com/dwsun/obs-StripImages
downloads:
updated at:
related to:
  - "[[GitHub - 1331823066]]"
remind me:
---

# Strip Images

Removes image embeds from a note through a right-click command, detecting wiki-style and Markdown embeds as well as network URLs. Images referenced only by that note are moved to .trash with their folder paths preserved, while images used elsewhere are kept and only the embed text is removed for network or unresolvable images. A confirmation modal reports how many embeds and files are affected.

```cue
plugin: {
    id:     "strip-images"
    name:   "Strip Images"
    author: "dwSun"
    repo:   "dwsun/obs-StripImages"

    html_url:    "https://community.obsidian.md/plugins/strip-images"
    github_url:  "https://github.com/dwsun/obs-StripImages"
    description: "Right-click a note to remove all image embeds; delete image files that are referenced only by that note (moved to .trash). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Strip image embeds from a note via the right‑click \"移除图片\" command, detecting wiki ![[...]] and Markdown ![](...) embeds as well as network URLs. Move images used only in that note to .trash (preserving folder paths); keep files used elsewhere and remove only embed text for network/unresolvable images, with a confirmation modal showing embed and file counts."
}
```

[^template]: [[Obsidian plugin]]
