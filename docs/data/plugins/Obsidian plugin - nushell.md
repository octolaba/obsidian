---
uid: 490bbc24-2599-5b24-b20b-956c810ca5f7
xid:
  - nushell
aliases:
  - nushell
  - Nushell
  - christianlemer/obsidian-nushell
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nushell
alt:
  - https://github.com/christianlemer/obsidian-nushell
downloads: 124
updated at: "2026-04-13T18:54:43Z"
related to:
  - "[[GitHub - 1208667249]]"
remind me:
---

# Nushell

Renders .nuon data files as colored Nushell tables, including nested records and type-aware coloring, and syntax-highlights .nu scripts. Both can also be embedded as code blocks in notes. The work is done by the local Nushell installation, and the text falls back to raw when Nushell is not installed.

```cue
plugin: {
    id:     "nushell"
    name:   "Nushell"
    author: "christianlemer"
    repo:   "christianlemer/obsidian-nushell"

    html_url:    "https://community.obsidian.md/plugins/nushell"
    github_url:  "https://github.com/christianlemer/obsidian-nushell"
    description: "Render Nushell data files (.nuon) and syntax-highlight Nushell scripts (.nu) using the local Nushell installation. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render .nuon files as colored Nushell tables with nested records and type-aware coloring. Syntax-highlight .nu scripts and embed nuon/nu code blocks in notes using your local Nushell, with graceful fallback to raw text when Nushell isn't installed."

    stats: {
        downloads:  124
        updated_at: 1776106483000
    }
}
```

[^template]: [[Obsidian plugin]]
