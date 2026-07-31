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
downloads: 866
updated at: "2026-07-13T10:14:29Z"
related to:
  - "[[GitHub - 1131717071]]"
remind me:
---

# Universal Cursor Hotkeys

Provides Emacs-style cursor navigation and Kill and Yank for Markdown, inside and outside tables, on macOS and Windows. Its recorded text states that Live Preview breaks cursor behaviour inside tables, where shortcuts such as Ctrl+P and Ctrl+N skip a table from outside and stop working within it. Vim mode's h, j, k, l, w, b, e, gg and G are restored inside table cells as well.

```cue
plugin: {
    id:     "universal-cursor-hotkeys"
    name:   "Universal Cursor Hotkeys"
    author: "shichishima"
    repo:   "shichishima/obsidian-universal-cursor-hotkeys"

    html_url:    "https://community.obsidian.md/plugins/universal-cursor-hotkeys"
    github_url:  "https://github.com/shichishima/obsidian-universal-cursor-hotkeys"
    description: "Emacs keybindings for Markdown — cursor navigation and Kill & Yank, whether in tables or out, either on macOS or Windows. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Obsidian's Live Preview breaks cursor behavior inside Markdown tables — whether you use Emacs keybindings or the built-in Vim mode. On macOS, Emacs shortcuts like Ctrl+P and Ctrl+N move the cursor anywhere in your notes — except inside tables, where they skip over them entirely from outside and stop working once you're in. This plugin fixes that — cursor navigation and Kill & Yank inside and outside tables, for macOS and Windows — and it also fixes Vim mode's h/j/k/l/w/b/e/gg/G inside table cells."

    stats: {
        downloads:  866
        updated_at: 1783937669000
    }
}
```

[^template]: [[Obsidian plugin]]
