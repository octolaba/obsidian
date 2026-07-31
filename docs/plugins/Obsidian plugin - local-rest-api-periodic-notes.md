---
uid: a7d5364b-6192-544c-b320-222c784e41b5
xid:
  - local-rest-api-periodic-notes
aliases:
  - local-rest-api-periodic-notes
  - Local REST API - Periodic Notes
  - coddingtonbear/obsidian-local-rest-api-periodic-notes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/local-rest-api-periodic-notes
alt:
  - https://github.com/coddingtonbear/obsidian-local-rest-api-periodic-notes
downloads:
updated at:
related to:
  - "[[GitHub - 1311647352]]"
remind me:
---

# Local REST API - Periodic Notes

Adds periodic-note endpoints for daily, weekly, monthly, quarterly and yearly notes to the Local REST API, covering read, create, append, patch and delete, including targeting a heading or a block through trailing path segments. An MCP tool returns or creates the vault-relative path of the current periodic note. Folder, format and template logic is delegated to the Daily Notes and Periodic Notes plugins.

```cue
plugin: {
    id:     "local-rest-api-periodic-notes"
    name:   "Local REST API - Periodic Notes"
    author: "Adam Coddington"
    repo:   "coddingtonbear/obsidian-local-rest-api-periodic-notes"

    html_url:    "https://community.obsidian.md/plugins/local-rest-api-periodic-notes"
    github_url:  "https://github.com/coddingtonbear/obsidian-local-rest-api-periodic-notes"
    description: "Add periodic note endpoints for daily, weekly, monthly, quarterly, and yearly notes to the Local REST API, with an MCP tool for resolving the current note's path. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Restore periodic-note REST routes to Local REST API to read, create, append, patch, or delete daily, weekly, monthly, quarterly, and yearly notes, including targeting headings or blocks via trailing path segments. Provide an MCP tool to return or create the vault-relative path for the current periodic note and delegate folder/format/template logic to Daily Notes and Periodic Notes plugins."
}
```

[^template]: [[Obsidian plugin]]
