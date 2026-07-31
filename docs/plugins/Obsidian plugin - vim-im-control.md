---
uid: 5cd6c880-8d4b-5e51-8889-8ac2fe1f6e12
xid:
  - vim-im-control
aliases:
  - vim-im-control
  - Vim IM Control
  - hideakitai/obsidian-vim-im-control
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vim-im-control
alt:
  - https://github.com/hideakitai/obsidian-vim-im-control
downloads: 4088
updated at: "2026-04-05T05:45:21Z"
related to:
  - "[[GitHub - 716401471]]"
remind me:
---

# Vim IM Control

Vim IM Control switches the system input method on InsertLeave and InsertEnter, restoring the previous method when insert mode is entered again. macOS, Windows and Linux are supported through common controllers such as im-select, fcitx5-remote, fcitx-remote and ibus, or through a custom command. Linux Snap and Flatpak installs are not supported.

```cue
plugin: {
    id:     "vim-im-control"
    name:   "Vim IM Control"
    author: "hideakitai"
    repo:   "hideakitai/obsidian-vim-im-control"

    html_url:    "https://community.obsidian.md/plugins/vim-im-control"
    github_url:  "https://github.com/hideakitai/obsidian-vim-im-control"
    description: "Switch input method when `InsertLeave` and `InsertEnter`. Supports macOS, Windows, and Linux."
    about:       "Switch input method automatically when entering and leaving Vim insert mode, restoring the previous IM on return. Support macOS, Windows, and Linux with common controllers (im-select, fcitx5-remote, fcitx-remote, ibus) and custom commands; Linux Snap/Flatpak installs are not supported."

    stats: {
        downloads:  4088
        updated_at: 1775367921000
    }
}
```

[^template]: [[Obsidian plugin]]
