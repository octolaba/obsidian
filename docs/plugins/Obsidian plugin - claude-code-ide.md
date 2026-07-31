---
uid: 6a1ab8cd-5609-59dc-b7d1-5c6f68ed99b0
xid:
  - claude-code-ide
aliases:
  - claude-code-ide
  - Claude Code IDE
  - petersolopov/obsidian-claude-ide
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/claude-code-ide
alt:
  - https://github.com/petersolopov/obsidian-claude-ide
downloads: 11341
updated at: "2026-06-04T10:46:30Z"
related to:
  - "[[GitHub - 1174711953]]"
remind me:
---

# Claude Code IDE

Shares editor context with the Claude Code CLI over a local WebSocket MCP bridge, exposing the active file, the open files and the selected text in real time. Selected text can also be handed over from the command palette. Connections stay on the local machine, use per-session tokens and expose read-only context, and the plugin is chosen as the IDE from Claude Code's own menu once enabled.

```cue
plugin: {
    id:     "claude-code-ide"
    name:   "Claude Code IDE"
    author: "petersolopov"
    repo:   "petersolopov/obsidian-claude-ide"

    html_url:    "https://community.obsidian.md/plugins/claude-code-ide"
    github_url:  "https://github.com/petersolopov/obsidian-claude-ide"
    description: "Connect your vault to Claude Code and share editor context with the CLI. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Lets Claude Code read your current editor context through a local WebSocket MCP bridge. It shares the active file, open files, and selected text in real time, so Claude can answer questions about what you are editing and receive selected text from the command palette. Connections stay local to your machine, use per-session tokens, and expose read-only context only. After enabling the plugin, choose the IDE from Claude Code's /ide menu."

    stats: {
        downloads:  11341
        updated_at: 1780569990000
    }
}
```

[^template]: [[Obsidian plugin]]
