---
uid: 493f044f-9455-5e31-951e-9845772f825a
xid:
  - marp-inline-preview
aliases:
  - marp-inline-preview
  - Marp Inline Preview
  - sotetsuk/obsidian-marp-inline-preview-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/marp-inline-preview
alt:
  - https://github.com/sotetsuk/obsidian-marp-inline-preview-plugin
downloads: 200
updated at: "2026-05-18T06:58:21Z"
related to:
  - "[[GitHub - 1241432649]]"
remind me:
---

# Marp Inline Preview

Marp Inline Preview renders a Marp slide deck inline while editing, showing each slide beneath its separator, and displays the full deck as HTML in reading mode. It uses Marp Core 4 in pure JavaScript with KaTeX bundled, so it works offline and on mobile. Custom themes are read from a .marprc.yml file, and each slide's CSS is isolated in Shadow DOM.

```cue
plugin: {
    id:     "marp-inline-preview"
    name:   "Marp Inline Preview"
    author: "Sotetsu Koyamada"
    repo:   "sotetsuk/obsidian-marp-inline-preview-plugin"

    html_url:    "https://community.obsidian.md/plugins/marp-inline-preview"
    github_url:  "https://github.com/sotetsuk/obsidian-marp-inline-preview-plugin"
    description: "Render Marp slide decks inline in edit mode and as full HTML in reading mode. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render Marp slide decks inline beneath each --- slide separator while editing, and display the full deck in reading mode. Use Marp Core 4 in pure JavaScript with bundled KaTeX, support for .marprc.yml custom themes, and per‑slide CSS isolated in Shadow DOM for mobile and offline use."

    stats: {
        downloads:  200
        updated_at: 1779087501000
    }
}
```

[^template]: [[Obsidian plugin]]
