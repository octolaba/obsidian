---
uid: ff54c649-59c4-536f-b165-20d0cd039423
xid:
  - opencode-links-graph
aliases:
  - opencode-links-graph
  - OpenCode Links Graph
  - wlankasper/obsidian-opencode-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/opencode-links-graph
alt:
  - https://github.com/wlankasper/obsidian-opencode-plugin
downloads: 318
updated at: "2026-05-15T09:43:29Z"
related to:
  - "[[GitHub - 1239108355]]"
remind me:
---

# OpenCode Links Graph

OpenCode Links Graph treats raw @.opencode/ references in Markdown as internal Obsidian links so they appear in the graph and local graph views. It scans Markdown files, resolves the referenced targets to vault files and injects synthetic resolved-link metadata at runtime, leaving file contents unmodified.

```cue
plugin: {
    id:     "opencode-links-graph"
    name:   "OpenCode Links Graph"
    author: "Artur Smirnov"
    repo:   "wlankasper/obsidian-opencode-plugin"

    html_url:    "https://community.obsidian.md/plugins/opencode-links-graph"
    github_url:  "https://github.com/wlankasper/obsidian-opencode-plugin"
    description: "Treat raw @.opencode/... Markdown references as internal Obsidian links for the native graph view. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render OpenCode @.opencode/... references as edges in Obsidian's Graph and Local Graph. Scan Markdown files, resolve targets to vault files, and inject synthetic resolved-link metadata at runtime so relationships appear in graphs without modifying file contents."

    stats: {
        downloads:  318
        updated_at: 1778838209000
    }
}
```

[^template]: [[Obsidian plugin]]
