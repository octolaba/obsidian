---
uid: c00ab421-4d33-54d5-99e3-fd9be4fbbb47
xid:
  - local-rest-api-second-brain-mcp-extension
aliases:
  - local-rest-api-second-brain-mcp-extension
  - Local REST API Second Brain MCP Extension
  - ziadloo/obsidian-local-rest-api-second-brain-mcp-extension
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/local-rest-api-second-brain-mcp-extension
alt:
  - https://github.com/ziadloo/obsidian-local-rest-api-second-brain-mcp-extension
downloads: 4311
updated at: "2026-05-31T06:16:59Z"
related to:
  - "[[GitHub - 1249848670]]"
remind me:
---

# Local REST API Second Brain MCP Extension

Extends the Local REST API with a Model Context Protocol endpoint that opens the vault to LLM clients as a second brain. Local semantic embeddings and breadth-first traversal of links and backlinks build what the recorded text calls token-efficient, context-rich results, served through the query_wiki, get_wiki and wiki_card tools.

```cue
plugin: {
    id:     "local-rest-api-second-brain-mcp-extension"
    name:   "Local REST API Second Brain MCP Extension"
    author: "Mehran Ziadloo"
    repo:   "ziadloo/obsidian-local-rest-api-second-brain-mcp-extension"

    html_url:    "https://community.obsidian.md/plugins/local-rest-api-second-brain-mcp-extension"
    github_url:  "https://github.com/ziadloo/obsidian-local-rest-api-second-brain-mcp-extension"
    description: "Extension for Local REST API to add second brain MCP server - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expose a Model Context Protocol (MCP) endpoint to turn your vault into an AI-ready second brain. Use local semantic embeddings and BFS traversal of links and backlinks to return token-efficient, context-rich results for LLMs via query_wiki, get_wiki, and wiki_card."

    stats: {
        downloads:  4311
        updated_at: 1780208219000
    }
}
```

[^template]: [[Obsidian plugin]]
