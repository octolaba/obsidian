---
uid: c7519bfc-bd60-598d-97a2-c6efb03f509b
xid:
  - render-api
aliases:
  - render-api
  - Render API
  - caesarloo/render-api
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/render-api
alt:
  - https://github.com/caesarloo/render-api
downloads: 234
updated at: "2026-07-04T16:01:44Z"
related to:
  - "[[GitHub - 1281809102]]"
remind me:
---

# Render API

Exposes Dataview, Tasks, and full Markdown rendering results from the vault over a local REST API, covering Dataview DQL, DataviewJS, and file post-processor output. A lightweight HTTP server bound to the loopback address returns HTML, plain text, or JSON, with optional API-key authentication and configurable CORS. It is desktop only, and the recorded description names programmatic access by AI tools as the intended use.

```cue
plugin: {
    id:     "render-api"
    name:   "Render API"
    author: "caesarloo"
    repo:   "caesarloo/render-api"

    html_url:    "https://community.obsidian.md/plugins/render-api"
    github_url:  "https://github.com/caesarloo/render-api"
    description: "Expose dataview/Tasks rendering results via REST API and MCP Server. Let AI tools access your vault's rendered content programmatically. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expose Dataview, Tasks, and full Markdown rendering from your vault via a local REST API, including Dataview DQL, DataviewJS, and file post-processor output. Run a lightweight desktop-only HTTP server (127.0.0.1) that returns HTML, plain text, or JSON with optional API-key auth and configurable CORS."

    stats: {
        downloads:  234
        updated_at: 1783180904000
    }
}
```

[^template]: [[Obsidian plugin]]
