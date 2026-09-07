---
uid: 669242d4-46e6-5a87-9bd8-6407ef48e2ad
xid:
  - termux-terminal
aliases:
  - termux-terminal
  - Termux Terminal
  - glaysia/termux-terminal
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/termux-terminal
alt:
  - https://github.com/glaysia/termux-terminal
downloads: 3
updated at: "2026-08-11T11:15:21Z"
related to:
  - "[[GitHub - 1200152926]]"
remind me:
---

# Termux Terminal

Runs a native Termux shell inside Obsidian on Android, opening terminals as ordinary Obsidian tabs. A local Rust bridge owns the PTY and the process lifecycle, starts fresh interactive Bash sessions, and connects over localhost with token-based authentication. It is not an SSH or remote shell.

```cue
plugin: {
    id:     "termux-terminal"
    name:   "Termux Terminal"
    author: "Harry Lee"
    repo:   "glaysia/termux-terminal"

    html_url:    "https://community.obsidian.md/plugins/termux-terminal"
    github_url:  "https://github.com/glaysia/termux-terminal"
    description: "A real interactive Termux terminal inside Obsidian on Android. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run a native Termux shell inside Obsidian on Android. Open terminals as Obsidian tabs powered by a local Rust bridge that owns the PTY and process lifecycle, starts fresh interactive Bash sessions, and connects over localhost with token-based authentication (not an SSH or remote shell)."

    stats: {
        downloads:  3
        updated_at: 1786446921000
    }
}
```

[^template]: [[Obsidian plugin]]
