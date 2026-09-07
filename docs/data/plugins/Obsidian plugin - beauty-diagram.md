---
uid: db8b9d1b-4b5e-5073-9c45-9eae4e8dcdc4
xid:
  - beauty-diagram
aliases:
  - beauty-diagram
  - Beauty Diagram
  - beauty-diagram/obsidian-beauty-diagram
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/beauty-diagram
alt:
  - https://github.com/beauty-diagram/obsidian-beauty-diagram
downloads: 1975
updated at: "2026-08-04T09:03:40Z"
related to:
  - "[[GitHub - 1244951835]]"
remind me:
---

# Beauty Diagram

Beauty Diagram replaces the built-in Mermaid rendering with themed diagrams and adds PlantUML support without a local Java or Graphviz install. It offers nine themes with dark-mode-friendly contrast and a per-block override through a bd:theme directive in a comment. Rendering goes through the external Beauty Diagram service; the recorded description states that free use is anonymous and watermarked while Pro and Premium users can opt in per page for watermark-free preview, and that an inject-embed-URLs command produces portable image references readable outside Obsidian.

```cue
plugin: {
    id:     "beauty-diagram"
    name:   "Beauty Diagram"
    author: "Beauty Diagram"
    repo:   "beauty-diagram/obsidian-beauty-diagram"

    html_url:    "https://community.obsidian.md/plugins/beauty-diagram"
    github_url:  "https://github.com/beauty-diagram/obsidian-beauty-diagram"
    description: "Beautify Mermaid and PlantUML diagrams with 9 polished themes. Dark-mode friendly, per-block theme override, portable image output. No setup. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Replace built-in mermaid rendering with slide-ready themed diagrams. Nine polished themes (Classic, Modern, Slate, Atlas, Obsidian, Brutalist, Atelier, Blueprint, Memphis), dark-mode-friendly contrast, per-block theme override via `%% bd:theme=` directive, and PlantUML support without local Java or Graphviz. Renders through the Beauty Diagram service (https://www.beauty-diagram.com). Free use is anonymous and watermarked; Pro/Premium users can opt in per-page (`bd-share: true` in front-matter) for watermark-free preview. The Inject embed URLs command produces portable `<img>` references that render anywhere markdown is read — GitHub, Notion, blog static sites."

    stats: {
        downloads:  1975
        updated_at: 1785834220000
    }
}
```

[^template]: [[Obsidian plugin]]
