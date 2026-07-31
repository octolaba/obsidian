---
uid: 0fe15eb3-2d0e-5661-a477-3d3c78b683d5
xid:
  - claude-code-bridge
aliases:
  - claude-code-bridge
  - Claude Code Bridge
  - radical7vii/obsidian-claude-code-bridge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/claude-code-bridge
alt:
  - https://github.com/radical7vii/obsidian-claude-code-bridge
downloads: 204
updated at: "2026-06-04T09:46:35Z"
related to:
  - "[[GitHub - 1252082419]]"
remind me:
---

# Claude Code Bridge

Mirrors the text selected in a note into the adjacent Claude Code CLI terminal in real time, reporting the selected line count and file the way the VS Code integration does. A local WebSocket server is started and a discovery lock file written, so Claude Code finds the bridge on its own and then receives JSON-RPC selection_changed notifications as the selection moves.

```cue
plugin: {
    id:     "claude-code-bridge"
    name:   "Claude Code Bridge"
    author: "othnielsu"
    repo:   "radical7vii/obsidian-claude-code-bridge"

    html_url:    "https://community.obsidian.md/plugins/claude-code-bridge"
    github_url:  "https://github.com/radical7vii/obsidian-claude-code-bridge"
    description: "Bridge selected text to Claude Code CLI for real-time context sharing. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bridge selected text from Obsidian to Claude Code CLI in real time, mirroring selections as \"Selected N lines from <file>\" in the adjacent Claude terminal just like VS Code. Start a local WebSocket server and write a discovery lock file so Claude Code auto-discovers and receives JSON-RPC selection_changed notifications."

    stats: {
        downloads:  204
        updated_at: 1780566395000
    }
}
```

[^template]: [[Obsidian plugin]]
