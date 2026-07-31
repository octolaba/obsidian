---
uid: 73f7dfba-8694-577d-a906-f769d6fe3a94
xid:
  - claude-code-sync
aliases:
  - claude-code-sync
  - Claude Code Sync
  - mattbirchler/claude-code-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/claude-code-sync
alt:
  - https://github.com/mattbirchler/claude-code-obsidian
downloads: 173
updated at: "2026-07-10T02:12:30Z"
related to:
  - "[[GitHub - 1292756579]]"
remind me:
---

# Claude Code Sync

Mirrors Claude Code sessions into the vault as Markdown by pointing the plugin at the Claude Code projects folder. Each session becomes one dated note inside its project folder, carrying session metadata and collapsed callouts for tool and thinking output. The notes are read-only mirrors and are regenerated when the underlying session changes.

```cue
plugin: {
    id:     "claude-code-sync"
    name:   "Claude Code Sync"
    author: "mattbirchler"
    repo:   "mattbirchler/claude-code-obsidian"

    html_url:    "https://community.obsidian.md/plugins/claude-code-sync"
    github_url:  "https://github.com/mattbirchler/claude-code-obsidian"
    description: "Mirror Claude Code sessions into your vault as Markdown notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Mirror every Claude Code session into your vault as readable, searchable Markdown notes by pointing it at your Claude Code projects folder. Save each session as a single dated note inside its project folder with session metadata and collapsed tool/thinking callouts, kept as read-only mirrors that regenerate when sessions change."

    stats: {
        downloads:  173
        updated_at: 1783649550000
    }
}
```

[^template]: [[Obsidian plugin]]
