---
uid: ea3f5979-d434-5aba-9837-9f544bc16ffb
xid:
  - pdf-mermaid-fix
aliases:
  - pdf-mermaid-fix
  - MD Export Pro
  - alanqin888/obsidian-pdf-mermaid-fix
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pdf-mermaid-fix
alt:
  - https://github.com/alanqin888/obsidian-pdf-mermaid-fix
downloads: 33
updated at: "2026-07-28T11:09:18Z"
related to:
  - "[[GitHub - 1303519202]]"
remind me:
---

# MD Export Pro

Injects a print CSS rule during PDF export so wide Mermaid diagrams scale responsively instead of being truncated, and avoid page breaks. Export runs through Obsidian's own PDF dialog and produces correctly scaled diagrams for A4 and other page sizes.

```cue
plugin: {
    id:     "pdf-mermaid-fix"
    name:   "MD Export Pro"
    author: "alan"
    repo:   "alanqin888/obsidian-pdf-mermaid-fix"

    html_url:    "https://community.obsidian.md/plugins/pdf-mermaid-fix"
    github_url:  "https://github.com/alanqin888/obsidian-pdf-mermaid-fix"
    description: "Fixes Mermaid diagram truncation in PDF export, and adds Python-powered Word export. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Fix wide Mermaid diagram truncation when exporting to PDF by injecting a print CSS rule that makes Mermaid SVGs scale responsively and avoid page breaks. Use Obsidian's native PDF export dialog to produce properly scaled diagrams for A4 and other page sizes."

    stats: {
        downloads:  33
        updated_at: 1785236958000
    }
}
```

[^template]: [[Obsidian plugin]]
