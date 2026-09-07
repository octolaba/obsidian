---
uid: 8914ba7b-2f34-5f39-a940-a228d9847255
xid:
  - contextual-sidecar
aliases:
  - contextual-sidecar
  - Contextual Sidecar
  - matthewturk/obsidian-sidecar-panel
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/contextual-sidecar
alt:
  - https://github.com/matthewturk/obsidian-sidecar-panel
downloads: 2188
updated at: "2025-05-30T13:34:27Z"
related to:
  - "[[GitHub - 756522981]]"
remind me:
---

# Contextual Sidecar

Contextual Sidecar shows a context-dependent panel beside a note, selected either by a sidecar-panel frontmatter property or by tag-to-panel mappings. Panel files are rendered as if they belonged to the active note, so widgets and INPUT bindings write to the parent file. Several panel files can be combined into a single sidecar.

```cue
plugin: {
    id:     "contextual-sidecar"
    name:   "Contextual Sidecar"
    author: "matthewturk"
    repo:   "matthewturk/obsidian-sidecar-panel"

    html_url:    "https://community.obsidian.md/plugins/contextual-sidecar"
    github_url:  "https://github.com/matthewturk/obsidian-sidecar-panel"
    description: "Add a context-dependent sidecar panel."
    about:       "Display a contextual sidebar for notes via a sidecar-panel frontmatter property or tag-to-panel mappings. Render panel files as if they belong to the active note so widgets and INPUT bindings modify the parent file. Combine multiple panel files into a single sidecar."

    stats: {
        downloads:  2188
        updated_at: 1748612067000
    }
}
```

[^template]: [[Obsidian plugin]]
