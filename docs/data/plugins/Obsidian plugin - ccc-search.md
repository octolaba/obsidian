---
uid: e36accaf-afb3-52e1-8192-542aade64cb6
xid:
  - ccc-search
aliases:
  - ccc-search
  - CCC Semantic Search
  - junzh0u/obsidian-ccc-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ccc-search
alt:
  - https://github.com/junzh0u/obsidian-ccc-search
downloads: 19
updated at: "2026-07-31T19:21:42Z"
related to:
  - "[[GitHub - 1301974643]]"
remind me:
---

# CCC Semantic Search

Adds a quick-switcher modal that searches the vault by meaning, backed by cocoindex-code (ccc) and its local AST and embedding index. Queries run locally by spawning the ccc executable; the plugin itself makes no network requests, though ccc may call external APIs depending on how it is configured.

```cue
plugin: {
    id:     "ccc-search"
    name:   "CCC Semantic Search"
    author: "Jun Zhou"
    repo:   "junzh0u/obsidian-ccc-search"

    html_url:    "https://community.obsidian.md/plugins/ccc-search"
    github_url:  "https://github.com/junzh0u/obsidian-ccc-search"
    description: "Semantic search of your vault via ccc (cocoindex-code). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Search your vault by meaning with a quick-switcher modal powered by cocoindex-code (ccc) and a local AST/embedding index. Run queries locally by spawning the ccc executable; the plugin makes no network requests itself, though ccc may call external APIs if configured."

    stats: {
        downloads:  19
        updated_at: 1785525702000
    }
}
```

[^template]: [[Obsidian plugin]]
