---
uid: 6f65437b-69e0-5ade-b335-45d6c24f10c9
xid:
  - pumler
aliases:
  - pumler
  - Pumler Diagrams
  - pumler/plugin-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pumler
alt:
  - https://github.com/pumler/plugin-obsidian
downloads: 298
updated at: "2026-05-02T23:21:36Z"
related to:
  - "[[GitHub - 1226540931]]"
remind me:
---

# Pumler Diagrams

Renders PlantUML, Structurizr DSL and Mermaid diagrams from pumler fenced code blocks by sending the source to the Pumler API and inserting the returned SVG into the note. Themes are set per diagram as light, dark or auto, and rendering is debounced with on-disk caching of the 30 most recent SVGs. A collapsible summary row and a zoomable modal are used to preview a diagram.

```cue
plugin: {
    id:     "pumler"
    name:   "Pumler Diagrams"
    author: "pumler"
    repo:   "pumler/plugin-obsidian"

    html_url:    "https://community.obsidian.md/plugins/pumler"
    github_url:  "https://github.com/pumler/plugin-obsidian"
    description: "Render PlantUML, Structurizr and Mermaid diagrams from code blocks. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render PlantUML, Structurizr DSL, and Mermaid diagrams from pumler fenced code blocks by sending source to the Pumler API and inserting returned SVGs into your notes. Configure per-diagram light/dark/auto themes, use debounced rendering with on-disk caching of the 30 most recent SVGs, and preview diagrams via a collapsible summary row and a zoomable modal."

    stats: {
        downloads:  298
        updated_at: 1777764096000
    }
}
```

[^template]: [[Obsidian plugin]]
