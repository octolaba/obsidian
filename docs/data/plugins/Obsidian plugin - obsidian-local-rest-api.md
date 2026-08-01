---
uid: 1e0ac88e-1097-5c01-bd4d-486abeb80a27
xid:
  - obsidian-local-rest-api
aliases:
  - obsidian-local-rest-api
  - Local REST API with MCP
  - coddingtonbear/obsidian-local-rest-api
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-local-rest-api
alt:
  - https://github.com/coddingtonbear/obsidian-local-rest-api
downloads: 606431
updated at: "2026-07-11T02:32:19Z"
related to:
  - "[[GitHub - 451732769]]"
remind me:
---

# Local REST API with MCP

This plugin exposes a secure local REST API over HTTPS so the vault can be driven by automation. It offers full CRUD on vault files including binaries, surgical edits of headings, block references and frontmatter, vault search, access to active or periodic notes, command execution and opening notes in the UI. Other plugins can register custom API routes, and requests require API-key authentication.

```cue
plugin: {
    id:     "obsidian-local-rest-api"
    name:   "Local REST API with MCP"
    author: "Adam Coddington"
    repo:   "coddingtonbear/obsidian-local-rest-api"

    html_url:    "https://community.obsidian.md/plugins/obsidian-local-rest-api"
    github_url:  "https://github.com/coddingtonbear/obsidian-local-rest-api"
    description: "Unlock your automation needs by interacting with your notes over a secure REST API."
    about:       "Expose a secure local REST API over HTTPS for full CRUD on vault files (including binaries) and surgical edits of headings, block refs, and frontmatter. Search the vault, access active or periodic notes, run commands, open notes in the UI, and let other plugins register custom API routes while requiring API-key authentication."

    stats: {
        downloads:  606431
        updated_at: 1783737139000
    }
}
```

[^template]: [[Obsidian plugin]]
