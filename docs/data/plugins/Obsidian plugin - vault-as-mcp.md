---
uid: 634e2636-4378-5466-94db-30bcf9cb8685
xid:
  - vault-as-mcp
aliases:
  - vault-as-mcp
  - Vault as MCP
  - ebullient/obsidian-vault-mcp
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-as-mcp
alt:
  - https://github.com/ebullient/obsidian-vault-mcp
downloads: 6080
updated at: "2026-07-30T16:37:44Z"
related to:
  - "[[GitHub - 1076932350]]"
remind me:
---

# Vault as MCP

Runs a Model Context Protocol server in the vault so external LLM tools such as Open WebUI or Claude Desktop can reach notes over HTTP or through the included stdio bridge. The exposed operations read, search, list, create, append, update and delete notes, expand embeds, list templates and resolve periodic note paths, with server status shown in the status bar. The recorded About states that data stays local and that the plugin runs on desktop only.

```cue
plugin: {
    id:     "vault-as-mcp"
    name:   "Vault as MCP"
    author: "ebullient"
    repo:   "ebullient/obsidian-vault-mcp"

    html_url:    "https://community.obsidian.md/plugins/vault-as-mcp"
    github_url:  "https://github.com/ebullient/obsidian-vault-mcp"
    description: "MCP server connecting Open WebUI, Claude Desktop, and other LLMs to your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run an MCP (Model Context Protocol) server in your vault to let external LLM tools access and manipulate notes over HTTP or via the included stdio bridge. Show server status in the status bar and expose operations to read, search, list, create, append, update, delete, expand embeds, list templates, and get periodic note paths. Keep all data local and run only on desktop environments."

    stats: {
        downloads:  6080
        updated_at: 1785429464000
    }
}
```

[^template]: [[Obsidian plugin]]
