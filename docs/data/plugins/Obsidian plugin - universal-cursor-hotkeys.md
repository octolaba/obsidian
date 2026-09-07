---
uid: 4182e27e-9bfe-54e9-b4f5-6ea2f14c8cc7
xid:
  - universal-cursor-hotkeys
aliases:
  - universal-cursor-hotkeys
  - Universal Cursor Hotkeys
  - shichishima/obsidian-universal-cursor-hotkeys
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/universal-cursor-hotkeys
alt:
  - https://github.com/shichishima/obsidian-universal-cursor-hotkeys
downloads: 1017
updated at: "2026-08-02T14:47:18Z"
related to:
  - "[[GitHub - 1131717071]]"
remind me:
---

# Universal Cursor Hotkeys

Restores cursor movement that Live Preview breaks inside Markdown tables. Emacs-style navigation and Kill and Yank keep working both inside and outside table cells on macOS and Windows, instead of skipping over tables or stopping once the cursor is in one. Vim mode motions h, j, k, l, w, b, e, gg and G are likewise made to work inside table cells.

```cue
plugin: {
    id:     "universal-cursor-hotkeys"
    name:   "Universal Cursor Hotkeys"
    author: "shichishima"
    repo:   "shichishima/obsidian-universal-cursor-hotkeys"

    html_url:    "https://community.obsidian.md/plugins/universal-cursor-hotkeys"
    github_url:  "https://github.com/shichishima/obsidian-universal-cursor-hotkeys"
    description: "Full cursor navigation for Markdown — whether in tables or out, either on macOS or Windows, be it Emacs keybindings or Vim mode. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Obsidian's Live Preview breaks cursor behavior inside Markdown tables — whether you use Emacs keybindings or the built-in Vim mode. On macOS, Emacs shortcuts like Ctrl+P and Ctrl+N move the cursor anywhere in your notes — except inside tables, where they skip over them entirely from outside and stop working once you're in. This plugin fixes that — cursor navigation and Kill & Yank inside and outside tables, for macOS and Windows — and it also fixes Vim mode's h/j/k/l/w/b/e/gg/G inside table cells."

    stats: {
        downloads:  1017
        updated_at: 1785682038000
    }
}
```

[^template]: [[Obsidian plugin]]
