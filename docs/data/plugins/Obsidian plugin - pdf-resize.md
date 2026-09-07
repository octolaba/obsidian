---
uid: 5c9858a1-ddf9-5d4d-b425-b21fff5eb65f
xid:
  - pdf-resize
aliases:
  - pdf-resize
  - PDF Resize
  - puhhh/pdf-resize
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pdf-resize
alt:
  - https://github.com/puhhh/pdf-resize
downloads: 46
updated at: "2026-07-30T07:10:10Z"
related to:
  - "[[GitHub - 1315912554]]"
remind me:
---

# PDF Resize

Applies a width to embedded PDF files using the same wiki-link size syntax that Obsidian accepts for images. Whole-number widths from 1 to 4096 pixels are honored, values below 100 render at 100 pixels, and an invalid width falls back to Obsidian's default. Embeds are capped at 100 percent of the available width so they stay responsive.

```cue
plugin: {
    id:     "pdf-resize"
    name:   "PDF Resize"
    author: "puhhh"
    repo:   "puhhh/pdf-resize"

    html_url:    "https://community.obsidian.md/plugins/pdf-resize"
    github_url:  "https://github.com/puhhh/pdf-resize"
    description: "Resize embedded PDF files with wiki-link dimensions. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Resize embedded PDFs with the same wiki-link width syntax used for images (e.g. ![[file.pdf|500]]). Apply whole-number widths from 1–4096 px (values under 100 render as 100px), keep embeds responsive with max-width:100%, and fall back to Obsidian's default for invalid widths."

    stats: {
        downloads:  46
        updated_at: 1785395410000
    }
}
```

[^template]: [[Obsidian plugin]]
