---
uid: 70379ab2-a194-5f6e-9cc9-5c2365ad5019
xid:
  - mcp-rest
aliases:
  - mcp-rest
  - MCP REST
  - swarogan/obsidian-mcp-rest
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mcp-rest
alt:
  - https://github.com/swarogan/obsidian-mcp-rest
downloads: 2207
updated at: "2026-03-13T21:45:32Z"
related to:
  - "[[GitHub - 1178086717]]"
remind me:
---

# MCP REST

MCP REST is an MCP server that connects AI assistants to a vault through the local Obsidian REST API, and it can run standalone or as an Obsidian plugin with a settings interface. It offers full vault create, read, update and delete operations, search, templates and active-file operations, and it discovers prompt templates automatically. Targeted PATCH edits address headings, blocks and frontmatter with search and replace, UTF-8 is preserved, and fetched web pages are converted from HTML to Markdown.

```cue
plugin: {
    id:     "mcp-rest"
    name:   "MCP REST"
    author: "swarogan"
    repo:   "swarogan/obsidian-mcp-rest"

    html_url:    "https://community.obsidian.md/plugins/mcp-rest"
    github_url:  "https://github.com/swarogan/obsidian-mcp-rest"
    description: "MCP server that connects AI assistants to your vault via the local REST API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expose Obsidian vault operations through a lightweight MCP server that wraps the Obsidian REST API and can run standalone or as an Obsidian plugin with a settings UI. Perform full vault CRUD, search, templates and active-file operations; auto-discover prompt templates; apply precise PATCH v3 edits (headings, blocks, frontmatter) with search-replace; preserve UTF-8 and convert HTML to Markdown on web fetch."

    stats: {
        downloads:  2207
        updated_at: 1773438332000
    }
}
```

[^template]: [[Obsidian plugin]]
