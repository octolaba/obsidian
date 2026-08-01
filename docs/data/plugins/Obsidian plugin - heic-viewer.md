---
uid: 5fa92be9-b837-56ac-ac5d-9fba7d05d80b
xid:
  - heic-viewer
aliases:
  - heic-viewer
  - HEIC Viewer
  - kiaraorq/heic-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/heic-viewer
alt:
  - https://github.com/kiaraorq/heic-viewer
downloads: 592
updated at: "2026-07-11T07:57:49Z"
related to:
  - "[[GitHub - 1243742008]]"
remind me:
---

# HEIC Viewer

HEIC Viewer converts HEIC and HEIF images to JPEG on the fly with a WebAssembly decoder and renders them inline, so embeds display like standard images. Images are decoded lazily as they are scrolled into view to avoid freezes. The recorded About states that conversion happens locally in memory, with no upload and no disk cache.

```cue
plugin: {
    id:     "heic-viewer"
    name:   "HEIC Viewer"
    author: "Kiara Orquera"
    repo:   "kiaraorq/heic-viewer"

    html_url:    "https://community.obsidian.md/plugins/heic-viewer"
    github_url:  "https://github.com/kiaraorq/heic-viewer"
    description: "Allows viewing of .heic and .heif images in Obsidian by converting them on the fly. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert HEIC and HEIF images to JPEG on the fly using a WebAssembly decoder and render them inline so embeds display like standard images. Load and decode images lazily as you scroll to avoid freezes, and perform all conversions locally in memory with no uploads or disk cache."

    stats: {
        downloads:  592
        updated_at: 1783756669000
    }
}
```

[^template]: [[Obsidian plugin]]
