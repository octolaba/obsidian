---
uid: 7db6c387-8e83-5cde-80b0-b3e1ac7d14d1
xid:
  - confluence-vault-uploader
aliases:
  - confluence-vault-uploader
  - Confluence Vault Uploader
  - stephenkall/obsidian-confluence-vault-uploader
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/confluence-vault-uploader
alt:
  - https://github.com/stephenkall/obsidian-confluence-vault-uploader
downloads: 99
updated at: "2026-06-12T18:13:57Z"
related to:
  - "[[GitHub - 1266663231]]"
remind me:
---

# Confluence Vault Uploader

Confluence Vault Uploader pushes an entire vault into a chosen Confluence parent page through the REST API, mapping the folder structure onto nested pages. Wiki links become working Confluence links, callouts become panels, and code blocks become syntax-highlighted macros. The sync is incremental and runs in two phases, creating the pages first and wiring the links afterwards.

```cue
plugin: {
    id:     "confluence-vault-uploader"
    name:   "Confluence Vault Uploader"
    author: "stephenkall"
    repo:   "stephenkall/obsidian-confluence-vault-uploader"

    html_url:    "https://community.obsidian.md/plugins/confluence-vault-uploader"
    github_url:  "https://github.com/stephenkall/obsidian-confluence-vault-uploader"
    description: "Push an entire Obsidian vault into a custom Confluence parent page using Confluence REST API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault to Confluence and preserve folder structure as nested pages. Convert wiki links to working Confluence links, turn callouts into panels, convert code blocks to syntax-highlighted macros, and run incremental two-phase sync to create pages then wire links."

    stats: {
        downloads:  99
        updated_at: 1781288037000
    }
}
```

[^template]: [[Obsidian plugin]]
