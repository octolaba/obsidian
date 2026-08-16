---
uid: c3d8bcd8-8b61-572c-94eb-1ba865d6efe0
xid:
  - vim-reading-nav
aliases:
  - vim-reading-nav
  - Vim Reading Navigation
  - ds-argus/obsidian-vim-scrolling
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vim-reading-nav
alt:
  - https://github.com/ds-argus/obsidian-vim-scrolling
downloads: 36
updated at: "2026-07-27T13:29:26Z"
related to:
  - "[[GitHub - 1272051465]]"
remind me:
---

# Vim Reading Navigation

Adds vim-style scrolling to reading mode when Obsidian's Vim key bindings are enabled: j and k move by line, Ctrl+D and Ctrl+U or d and u scroll half a page, and gg and G jump to the start or end. Pressing f enters a Vimium-style link-hint mode for focusing and following links. Scrolling is instant rather than animated so key repeat stays responsive, the editor cursor is synced to the visible content afterwards, and pop-out windows are supported.

```cue
plugin: {
    id:     "vim-reading-nav"
    name:   "Vim Reading Navigation"
    author: "Argus"
    repo:   "ds-argus/obsidian-vim-scrolling"

    html_url:    "https://community.obsidian.md/plugins/vim-reading-nav"
    github_url:  "https://github.com/ds-argus/obsidian-vim-scrolling"
    description: "Adds vim-style scrolling (j/k, Ctrl+D/U or d/u, gg, G) and Vimium-style link hints (f) in reading mode when vim key bindings are enabled. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bring vim-style scrolling and Vimium-style link hints to reading mode when Vim key bindings are enabled, adding j/k line moves, d/u half-page scrolls, gg/G jumps and an f link-hint mode to focus and follow links. Sync the editor cursor to visible content after scrolling, use instant non-animated scrolling for responsive key-repeat, and support pop-out windows."

    stats: {
        downloads:  36
        updated_at: 1785158966000
    }
}
```

[^template]: [[Obsidian plugin]]
