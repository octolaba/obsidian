---
uid: f5c57d67-ce92-5f1a-a531-32b57ad1a00a
xid:
  - agentcairn
aliases:
  - agentcairn
  - ccf/agentcairn-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/agentcairn
alt:
  - https://github.com/ccf/agentcairn-obsidian
downloads: 161
updated at: "2026-06-21T16:27:43Z"
related to:
  - "[[GitHub - 1270688166]]"
remind me:
---

# agentcairn

agentcairn is a read-only window onto an AI coding agent's long-term memory, which it stores as plain Markdown in a vault you own. A Memory view shows a force-directed graph of related memories colored by project and sized by importance, a filterable list, and a provenance panel recording where a memory came from and whether it is still current. It reads only note frontmatter, never note bodies, never writes to the vault and makes no network requests. It pairs with the agentcairn CLI and MCP server so one vault serves as shared memory across MCP hosts.

```cue
plugin: {
    id:     "agentcairn"
    name:   "agentcairn"
    author: "Charles C. Figueiredo"
    repo:   "ccf/agentcairn-obsidian"

    html_url:    "https://community.obsidian.md/plugins/agentcairn"
    github_url:  "https://github.com/ccf/agentcairn-obsidian"
    description: "See and navigate your AI agent's long-term memory — a graph of memories with provenance and currency. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "agentcairn stores your AI coding agent's long-term memory as plain Markdown in a vault you own, and this plugin is the window into it: an interactive Memory view with a force-directed graph of related memories (colored by project, sized by importance), a filterable list, and a provenance panel showing where each memory came from and whether it's still current. It's read-only and local-only — it reads only your notes' frontmatter, never your note bodies, never writes to your vault, and makes no network requests. It pairs with the agentcairn CLI and MCP server, so one vault is the shared memory across Claude Code, Codex, Cursor, and any MCP host. Free and open source, Apache-2.0."

    stats: {
        downloads:  161
        updated_at: 1782059263000
    }
}
```

[^template]: [[Obsidian plugin]]
