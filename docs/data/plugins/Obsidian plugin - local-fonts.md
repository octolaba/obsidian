---
uid: 4bb72fec-6d5b-5edf-9ec2-28c9e51fadbe
xid:
  - local-fonts
aliases:
  - local-fonts
  - Local Fonts
  - flowing-abyss/obsidian-local-fonts
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/local-fonts
alt:
  - https://github.com/flowing-abyss/obsidian-local-fonts
downloads: 269
updated at: "2026-07-31T17:54:33Z"
related to:
  - "[[GitHub - 1315693253]]"
remind me:
---

# Local Fonts

Loads font files kept in a folder inside the vault and applies them to note text, the interface, headings, monospace blocks and emoji. Files in TTF, OTF, WOFF and WOFF2 form are read, subfolders included, family and weight information comes from the file metadata, and only the weights a note needs are loaded. It works offline on desktop and mobile and reports diagnostics on weights and script coverage.

```cue
plugin: {
    id:     "local-fonts"
    name:   "Local Fonts"
    author: "flowing-abyss"
    repo:   "flowing-abyss/obsidian-local-fonts"

    html_url:    "https://community.obsidian.md/plugins/local-fonts"
    github_url:  "https://github.com/flowing-abyss/obsidian-local-fonts"
    description: "Load fonts from a folder in your vault and apply them to text, interface, headings, code and emoji. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Load fonts from a folder in your vault and apply them to note text, the interface, monospace blocks, headings and emoji. Read local .ttf/.otf/.woff/.woff2 files (including subfolders), use file metadata for families/weights, load only weights a note needs, work offline on desktop and mobile with diagnostics for weights and script coverage."

    stats: {
        downloads:  269
        updated_at: 1785520473000
    }
}
```

[^template]: [[Obsidian plugin]]
