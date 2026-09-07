---
uid: 5c151941-7267-5d13-aa7b-4a0b064ce5d4
xid:
  - source-mode-inline-images
aliases:
  - source-mode-inline-images
  - Source Mode Image Renderer
  - hiforrest/source-mode-inline-images
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/source-mode-inline-images
alt:
  - https://github.com/hiforrest/source-mode-inline-images
downloads: 184
updated at: "2026-06-12T08:29:36Z"
related to:
  - "[[GitHub - 1259383630]]"
remind me:
---

# Source Mode Image Renderer

Image previews are rendered directly below image embeds while the editor is in Source mode, honoring the width suffix an embed carries. A missing image file produces an explicit message instead of a preview, and Live Preview and Reading view are left unchanged.

```cue
plugin: {
    id:     "source-mode-inline-images"
    name:   "Source Mode Image Renderer"
    author: "Forrest"
    repo:   "hiforrest/source-mode-inline-images"

    html_url:    "https://community.obsidian.md/plugins/source-mode-inline-images"
    github_url:  "https://github.com/hiforrest/source-mode-inline-images"
    description: "Render image previews below image links in Source mode. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render image previews directly below Obsidian image embeds in Source mode, honoring width syntax like ![[image.png|300]]. Display a clear message when the image file is missing and leave Live Preview and Reading View unchanged."

    stats: {
        downloads:  184
        updated_at: 1781252976000
    }
}
```

[^template]: [[Obsidian plugin]]
