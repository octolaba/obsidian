---
uid: cc8559f5-cfb1-5639-b690-2ecf49e98640
xid:
  - mcp-notes-tools
aliases:
  - mcp-notes-tools
  - MCP Notes Tools
  - msnp1381/mcp-notes-tools
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mcp-notes-tools
alt:
  - https://github.com/msnp1381/mcp-notes-tools
downloads: 154
updated at: "2026-07-04T08:23:55Z"
related to:
  - "[[GitHub - 1289003803]]"
remind me:
---

# MCP Notes Tools

MCP Notes Tools exposes a local MCP endpoint for the active vault so that MCP clients can search notes, read a note and append confirmed change notes. Search covers titles, vault-relative paths and note bodies, and a read returns the full Markdown. Appends add timestamped entries to a Change notes section and each write requires confirmation. It runs locally on desktop only.

```cue
plugin: {
    id:     "mcp-notes-tools"
    name:   "MCP Notes Tools"
    author: "msnp"
    repo:   "msnp1381/mcp-notes-tools"

    html_url:    "https://community.obsidian.md/plugins/mcp-notes-tools"
    github_url:  "https://github.com/msnp1381/mcp-notes-tools"
    description: "Expose local MCP tools to search, read, and append confirmed change notes in a project vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expose a local MCP endpoint for the active vault to let MCP clients search notes, read a note, and request confirmed append-only change notes. Search titles, vault-relative paths and bodies; return full Markdown; append timestamped entries to a Change notes section with per-write confirmation; run locally on desktop only."

    stats: {
        downloads:  154
        updated_at: 1783153435000
    }
}
```

[^template]: [[Obsidian plugin]]
