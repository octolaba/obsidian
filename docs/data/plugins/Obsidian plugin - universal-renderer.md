---
uid: 53e5ff0b-7c71-5367-983c-bd0b745e7a21
xid:
  - universal-renderer
aliases:
  - universal-renderer
  - Universal renderer
  - dgudim/obsidian-universal-renderer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/universal-renderer
alt:
  - https://github.com/dgudim/obsidian-universal-renderer
downloads: 1098
updated at: "2024-04-16T18:57:37Z"
related to:
  - "[[GitHub - 623837771]]"
remind me:
---

# Universal renderer

Renders diagrams from fenced code blocks by calling native system packages rather than a bundled library. Graphviz dot, LaTeX, ditaa, blockdiag, AsciiDoc, PlantUML and Typst are supported, along with the refgraph and dynamic-svg types for generated SVG output. The fence language selects the renderer.

```cue
plugin: {
    id:     "universal-renderer"
    name:   "Universal renderer"
    author: "dgudim"
    repo:   "dgudim/obsidian-universal-renderer"

    html_url:    "https://community.obsidian.md/plugins/universal-renderer"
    github_url:  "https://github.com/dgudim/obsidian-universal-renderer"
    description: "Render various diagrams using system native packages"
    about:       "Render diagrams and generate dynamic SVGs directly in Obsidian using native system executables for faster, local rendering. Support Graphviz (dot), LaTeX, ditaa, blockdiag, AsciiDoc, PlantUML, Typst and special types like refgraph and dynamic-svg. Create fenced code blocks with the diagram language to embed diagrams inline."

    stats: {
        downloads:  1098
        updated_at: 1713293857000
    }
}
```

[^template]: [[Obsidian plugin]]
