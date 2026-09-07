---
uid: f04675be-aa4c-523f-8860-1a6665a337ff
xid:
  - script-launcher
aliases:
  - script-launcher
  - Script Launcher
  - alessandroruggiero/script-launcher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/script-launcher
alt:
  - https://github.com/alessandroruggiero/script-launcher
downloads: 9473
updated at: "2026-06-06T09:29:32Z"
related to:
  - "[[GitHub - 524474191]]"
remind me:
---

# Script Launcher

Script Launcher registers paths to scripts written in any language and launches them from the bottom bar or the command palette. The vault path and the active file path are passed to the script as $1 and $2, exit codes and output are surfaced as in-app notices, and a script can be set to run at startup.

```cue
plugin: {
    id:     "script-launcher"
    name:   "Script Launcher"
    author: "alessandroruggiero"
    repo:   "alessandroruggiero/script-launcher"

    html_url:    "https://community.obsidian.md/plugins/script-launcher"
    github_url:  "https://github.com/alessandroruggiero/script-launcher"
    description: "Add scripts shortcuts on your bottom bar and launch them."
    about:       "Launch scripts written in any language directly from Obsidian by registering script paths and invoking them from the bottom bar or the command palette. Pass the vault path and active file path to scripts as $1 and $2, view exit codes and output as in-app notices, and enable scripts to run at startup."

    stats: {
        downloads:  9473
        updated_at: 1780738172000
    }
}
```

[^template]: [[Obsidian plugin]]
