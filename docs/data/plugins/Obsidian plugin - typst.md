---
uid: 2a7f1e98-f897-50ac-89b6-25ddea6e9019
xid:
  - typst
aliases:
  - typst
  - Typst Renderer
  - fenjalien/obsidian-typst
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/typst
alt:
  - https://github.com/fenjalien/obsidian-typst
downloads: 12856
updated at: "2024-03-19T01:31:23Z"
related to:
  - "[[GitHub - 618440185]]"
remind me:
---

# Typst Renderer

Renders typst code blocks and math blocks to images by compiling Typst to WASM, producing PNG, SVG or PDF output with paths kept relative to the vault. Packages from the preview and local namespaces are managed with automatic downloads, and reusable preambles can be prepended for consistent styling and imports.

```cue
plugin: {
    id:     "typst"
    name:   "Typst Renderer"
    author: "fenjalien"
    repo:   "fenjalien/obsidian-typst"

    html_url:    "https://community.obsidian.md/plugins/typst"
    github_url:  "https://github.com/fenjalien/obsidian-typst"
    description: "Render `typst` code blocks and math blocks to images with Typst."
    about:       "Render Typst code blocks and optional math blocks as PNG, SVG, or PDF images using Typst compiled to WASM, keeping paths relative to your vault. Manage packages from @preview and @local with automatic downloads, and prepend reusable preambles for consistent styling and imports."

    stats: {
        downloads:  12856
        updated_at: 1710811883000
    }
}
```

[^template]: [[Obsidian plugin]]
