---
uid: 92a8cef7-3ae3-533c-adf2-4e7d1891bd35
xid:
  - sankey
aliases:
  - sankey
  - Sankey
  - finnromaneessen/obsidian-sankey
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sankey
alt:
  - https://github.com/finnromaneessen/obsidian-sankey
downloads: 1021
updated at: "2026-03-01T18:30:07Z"
related to:
  - "[[GitHub - 890608393]]"
remind me:
---

# Sankey

Sankey renders Sankey diagrams from sankey code blocks in notes. Links and nodes are defined in YAML, where a link carries source, target and value, and a value written as a question mark is calculated by conserving flow across nodes, with an error shown when it cannot be resolved. Node entries set colors, and nodes that are not listed are inferred from the links.

```cue
plugin: {
    id:     "sankey"
    name:   "Sankey"
    author: "finnromaneessen"
    repo:   "finnromaneessen/obsidian-sankey"

    html_url:    "https://community.obsidian.md/plugins/sankey"
    github_url:  "https://github.com/finnromaneessen/obsidian-sankey"
    description: "Create Sankey diagrams in your notes."
    about:       "Create Sankey diagrams in Obsidian with sankey code blocks. Define links and nodes in YAML; links use source, target and value, and a value of ? is auto-calculated by conserving flow across nodes, with an error shown if unresolved. Add node entries to set colors; unspecified nodes are inferred from links."

    stats: {
        downloads:  1021
        updated_at: 1772389807000
    }
}
```

[^template]: [[Obsidian plugin]]
