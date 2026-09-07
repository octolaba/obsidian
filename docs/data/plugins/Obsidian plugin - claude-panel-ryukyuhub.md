---
uid: b857afba-feab-5f2a-a9a7-12397d1e4fd8
xid:
  - claude-panel-ryukyuhub
aliases:
  - claude-panel-ryukyuhub
  - Claude Panel
  - ryukyuhub/obsidian-claude-panel-ryukyuhub
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/claude-panel-ryukyuhub
alt:
  - https://github.com/ryukyuhub/obsidian-claude-panel-ryukyuhub
downloads: 736
updated at: "2026-07-26T11:48:05Z"
related to:
  - "[[GitHub - 1228570407]]"
remind me:
---

# Claude Panel

Adds a right-sidebar chat panel that spawns the claude CLI as a subprocess with the vault as its working directory, so reading, writing, searching and running commands against the notes happen in the editor. Responses stream with tool-use pills and per-turn cost and duration, the active note is mentioned automatically, clipboard images can be pasted in, editor and preview selections are captured, and sessions resume across turns. Slash commands, project-level MCP servers declared in a project file and a live account and rate-limit panel are included. It is desktop only, needs the claude CLI installed and signed in, uses file, subprocess and clipboard access, and follows the editor's English or Japanese language setting.

```cue
plugin: {
    id:     "claude-panel-ryukyuhub"
    name:   "Claude Panel"
    author: "Ryukyu HUB Inc."
    repo:   "ryukyuhub/obsidian-claude-panel-ryukyuhub"

    html_url:    "https://community.obsidian.md/plugins/claude-panel-ryukyuhub"
    github_url:  "https://github.com/ryukyuhub/obsidian-claude-panel-ryukyuhub"
    description: "Right-sidebar chat panel powered by Claude Code. Runs the `claude` CLI as a subprocess with the active vault as the working directory. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Adds a right-sidebar chat panel powered by Claude Code. The plugin spawns the `claude` CLI as a subprocess with your vault as its working directory, so reading, writing, searching, and running commands against your notes all happen in the editor. Features: streaming responses with tool-use pills and per-turn cost / duration, auto @-mention of the active note, paste-to-attach for clipboard images, captured editor / preview selections, session resume across turns, slash commands (/clear, /help, /model, /think, /mcp, /usage, /login), project-level MCP servers via `.mcp.json`, and a live account & rate-limit usage panel. Desktop only. Requires the `claude` CLI installed and signed in (Claude Pro / Max subscription, or an Anthropic API key). Uses `fs`, `child_process`, and clipboard access to run the CLI and capture pasted images. UI follows the editor's language setting (English or Japanese)."

    stats: {
        downloads:  736
        updated_at: 1785066485000
    }
}
```

[^template]: [[Obsidian plugin]]
