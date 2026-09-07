---
uid: 070dc009-07d6-538b-9a42-61eca4aeaace
xid:
  - obsidian-plantuml
aliases:
  - obsidian-plantuml
  - PlantUML
  - joethei/obsidian-plantuml
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-plantuml
alt:
  - https://github.com/joethei/obsidian-plantuml
downloads: 152303
updated at: "2026-06-12T11:24:16Z"
related to:
  - "[[GitHub - 349654010]]"
remind me:
---

# PlantUML

This plugin generates PlantUML diagrams from fenced code blocks, rendering through an online server, a local PlantUML jar, or a self-hosted server. Separate block types produce the standard output, higher-resolution SVG, or ASCII art. Vault notes can be linked from a diagram, and external puml files included when rendering locally.

```cue
plugin: {
    id:     "obsidian-plantuml"
    name:   "PlantUML"
    author: "Johannes Theiner"
    repo:   "joethei/obsidian-plantuml"

    html_url:    "https://community.obsidian.md/plugins/obsidian-plantuml"
    github_url:  "https://github.com/joethei/obsidian-plantuml"
    description: "Generate PlantUML diagrams."
    about:       "Render PlantUML diagrams in Obsidian using an online server, a local PlantUML .jar, or a self‑hosted server. Create fenced code blocks with plantuml, plantuml-svg for higher-resolution SVGs, or plantuml-ascii for ASCII art; link vault notes with [[[Your other note]]] and include external .puml files when rendering locally."

    stats: {
        downloads:  152303
        updated_at: 1781263456000
    }
}
```

[^template]: [[Obsidian plugin]]
