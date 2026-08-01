---
uid: a4566771-a5b6-5960-b19c-025ddfb0e181
xid:
  - mcp-vault-bridge
aliases:
  - mcp-vault-bridge
  - MCP Vault Bridge
  - allexcd/obsidian-mcp
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mcp-vault-bridge
alt:
  - https://github.com/allexcd/obsidian-mcp
downloads: 231
updated at: "2026-06-20T19:22:33Z"
related to:
  - "[[GitHub - 1223446965]]"
remind me:
---

# MCP Vault Bridge

MCP Vault Bridge connects a vault to MCP clients such as Claude Desktop and LM Studio in a read-only, token-gated mode, so notes can be served without write, delete or command access. Privacy is controlled by exclusion-based rules, and hidden or system folders are always denied. Semantic search is optional and runs against local embedding endpoints, which the recorded description presents as keeping the data local.

```cue
plugin: {
    id:     "mcp-vault-bridge"
    name:   "MCP Vault Bridge"
    author: "allexcd"
    repo:   "allexcd/obsidian-mcp"

    html_url:    "https://community.obsidian.md/plugins/mcp-vault-bridge"
    github_url:  "https://github.com/allexcd/obsidian-mcp"
    description: "Read-only, exclusion-based local bridge for using vault notes through MCP clients. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect your Obsidian vault to MCP clients like Claude Desktop and LM Studio in read-only, token-gated mode to serve notes without write, delete, or command access. Control privacy with exclusion-based rules and always-deny hidden/system folders; enable optional semantic search via local embedding endpoints to keep data local."

    stats: {
        downloads:  231
        updated_at: 1781983353000
    }
}
```

[^template]: [[Obsidian plugin]]
