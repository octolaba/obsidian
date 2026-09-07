---
uid: 764da7de-140b-5453-9c3a-a14f5cfb9911
xid:
  - obsidian-vimrc-support
aliases:
  - obsidian-vimrc-support
  - Vimrc Support
  - esm7/obsidian-vimrc-support
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-vimrc-support
alt:
  - https://github.com/esm7/obsidian-vimrc-support
downloads: 151281
updated at: "2024-11-03T09:37:13Z"
related to:
  - "[[GitHub - 309078472]]"
remind me:
---

# Vimrc Support

Vim commands are loaded at startup from a .obsidian.vimrc file in the vault root, so keymaps and settings persist across sessions. Beyond keeping the built-in Vim mode configured consistently, it adds Obsidian-aware extras such as mapping Ex commands to Obsidian commands and yanking to the system clipboard.

```cue
plugin: {
    id:     "obsidian-vimrc-support"
    name:   "Vimrc Support"
    author: "esm7"
    repo:   "esm7/obsidian-vimrc-support"

    html_url:    "https://community.obsidian.md/plugins/obsidian-vimrc-support"
    github_url:  "https://github.com/esm7/obsidian-vimrc-support"
    description: "Auto-load a startup file with Vim commands."
    about:       "Load Vim commands from a .obsidian.vimrc file in your vault root to persist Vim keymaps and settings across sessions. Keep Obsidian's built-in Vim mode configured consistently and add Obsidian-aware extras like Ex-to-command mappings and system clipboard yanks."

    stats: {
        downloads:  151281
        updated_at: 1730626633000
    }
}
```

[^template]: [[Obsidian plugin]]
