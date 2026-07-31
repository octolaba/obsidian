---
uid: cc3f16ba-437c-5123-bc4c-e608c9b266a3
xid:
  - context-command-hider
aliases:
  - context-command-hider
  - Context Command Hider
  - mara-li/obsidian-context-menu-hider
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/context-command-hider
alt:
  - https://github.com/mara-li/obsidian-context-menu-hider
downloads: 3035
updated at: "2025-01-18T17:45:43Z"
related to:
  - "[[GitHub - 809924537]]"
remind me:
---

# Context Command Hider

Context Command Hider hides commands from Obsidian's right-click menus, matching them by exact name or by regular expression, including commands contributed by community plugins. Hides apply globally across every context menu, so identical command names cannot be targeted per menu, and changes take effect without a reload. Obsidian's native menu has to be disabled for the plugin to work.

```cue
plugin: {
    id:     "context-command-hider"
    name:   "Context Command Hider"
    author: "Mara"
    repo:   "mara-li/obsidian-context-menu-hider"

    html_url:    "https://community.obsidian.md/plugins/context-command-hider"
    github_url:  "https://github.com/mara-li/obsidian-context-menu-hider"
    description: "Hide any command from the right-click menu."
    about:       "Hide any context-menu command across Obsidian, including community-plugin commands, by exact name or by regex. Apply hides globally across all context menus (note, file explorer, etc.), cannot target identical command names per-menu, and see changes take effect instantly without reloading. Disable Obsidian's native menu to enable the plugin."

    stats: {
        downloads:  3035
        updated_at: 1737222343000
    }
}
```

[^template]: [[Obsidian plugin]]
