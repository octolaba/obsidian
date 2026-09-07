---
uid: c15a01b1-373f-5b71-bba1-408f2acf8b00
xid:
  - atoms
aliases:
  - atoms
  - Atoms
  - taihartman/obsidian-atoms
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/atoms
alt:
  - https://github.com/taihartman/obsidian-atoms
downloads: 186
updated at: "2026-08-11T00:12:13Z"
related to:
  - "[[GitHub - 1301943572]]"
remind me:
---

# Atoms

Classifies the bullets of past daily notes as atom, task or noise and writes each atom out as a permanent file in a flat Atoms folder. Person hubs are created with links and backlinks, and processed bullets receive a marker so they are not handled twice. Classification runs through the Anthropic API with a supplied key, and existing atom files are never overwritten.

```cue
plugin: {
    id:     "atoms"
    name:   "Atoms"
    author: "Tai Hartman"
    repo:   "taihartman/obsidian-atoms"

    html_url:    "https://community.obsidian.md/plugins/atoms"
    github_url:  "https://github.com/taihartman/obsidian-atoms"
    description: "Classify past daily-note captures into linked atomic notes via the Anthropic API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "tryatoms.app Turn past daily-note bullets into a flat, linked knowledge graph by classifying each bullet as atom, task, or noise and writing permanent atom files in a flat Atoms/ folder. Create person hubs with links and backlinks, append markers to avoid reprocessing, and optionally use your Anthropic API key to power classification without overwriting existing atom files."

    stats: {
        downloads:  186
        updated_at: 1786407133000
    }
}
```

[^template]: [[Obsidian plugin]]
