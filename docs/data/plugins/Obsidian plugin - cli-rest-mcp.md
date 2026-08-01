---
uid: cca57978-e061-5793-8c64-dd7de1a1353a
xid:
  - cli-rest-mcp
aliases:
  - cli-rest-mcp
  - REST and MCP server
  - dsebastien/obsidian-cli-rest
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cli-rest-mcp
alt:
  - https://github.com/dsebastien/obsidian-cli-rest
downloads: 1891
updated at: "2026-07-17T07:32:29Z"
related to:
  - "[[GitHub - 1162702044]]"
remind me:
---

# REST and MCP server

Exposes Obsidian's CLI commands as a local HTTP API and as an MCP server, so notes can be created, read, searched and modified from scripts, other tools or AI assistants. Access is restricted to localhost by default, authenticated with an API key, and narrowed further by granular per-command controls.

```cue
plugin: {
    id:     "cli-rest-mcp"
    name:   "REST and MCP server"
    author: "Sébastien Dubois"
    repo:   "dsebastien/obsidian-cli-rest"

    html_url:    "https://community.obsidian.md/plugins/cli-rest-mcp"
    github_url:  "https://github.com/dsebastien/obsidian-cli-rest"
    description: "Exposes CLI commands as RESTful API endpoints and an MCP server for AI tool integration. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Control your Obsidian vault programmatically by exposing all CLI commands as a local HTTP API and MCP server. Automate creating, reading, searching, and modifying notes from scripts, tools, or AI assistants while keeping access localhost-only by default with API-key authentication and granular command controls."

    stats: {
        downloads:  1891
        updated_at: 1784273549000
    }
}
```

[^template]: [[Obsidian plugin]]
