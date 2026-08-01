---
uid: 13886aba-ed81-59cc-b858-e2c83227477a
xid:
  - opencode-wsl
aliases:
  - opencode-wsl
  - OpenCode WSL
  - emmet24/obsidian-opencode-wsl
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/opencode-wsl
alt:
  - https://github.com/emmet24/obsidian-opencode-wsl
downloads: 184
updated at: "2026-07-08T06:18:31Z"
related to:
  - "[[GitHub - 1290885452]]"
remind me:
---

# OpenCode WSL

OpenCode WSL embeds the OpenCode web UI in the Obsidian sidebar through a WSL bridge. Instead of bridging a PTY with xterm.js and node-pty, it starts opencode serve inside WSL and loads the web UI in an iframe over plain HTTP, which needs no extra dependencies. The server starts with the panel and stops with Obsidian, PATH is resolved WSL-natively, the vault directory is used automatically, and a health check and taskkill cleanup guard against lingering processes. It requires Windows 10 or 11 with WSL2, the OpenCode CLI in WSL and Obsidian 1.7.2 or later, stays on 127.0.0.1 and reports no telemetry.

```cue
plugin: {
    id:     "opencode-wsl"
    name:   "OpenCode WSL"
    author: "emmet24"
    repo:   "emmet24/obsidian-opencode-wsl"

    html_url:    "https://community.obsidian.md/plugins/opencode-wsl"
    github_url:  "https://github.com/emmet24/obsidian-opencode-wsl"
    description: "Embed OpenCode web UI in the Obsidian sidebar via WSL bridge. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed OpenCode web UI in the Obsidian sidebar via WSL. Instead of a PTY bridge (xterm.js + node-pty), this plugin starts 'opencode serve' inside WSL and embeds the web UI in an iframe — no extra dependencies, just a clean HTTP bridge between Windows and WSL. Features: Web UI embedded in sidebar, auto-start server (configurable), lifecycle management (starts with panel, stops with Obsidian, no lingering processes), WSL-native PATH resolution, automatic vault directory, health check, taskkill cleanup. Requirements: Windows 10/11 + WSL2, OpenCode CLI in WSL, Obsidian v1.7.2+. Privacy: Local only (127.0.0.1), no telemetry, no external connections."

    stats: {
        downloads:  184
        updated_at: 1783491511000
    }
}
```

[^template]: [[Obsidian plugin]]
