---
uid: 6234dfee-46d6-5b30-a476-39ff0e89098c
xid:
  - kaos
aliases:
  - kaos
  - Kaos
  - ferusnet/kaos-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/kaos
alt:
  - https://github.com/ferusnet/kaos-plugin
downloads: 27
updated at: "2026-08-07T11:41:29Z"
related to:
  - "[[GitHub - 1322026443]]"
remind me:
---

# Kaos

Renders live operational dashboards from a Ferusnet tenant inside Obsidian, with a tabbed pane per service and widgets drawn as tables, badges, bar charts and status tiles. The data stays in Azure, and nothing is written to the vault unless read/write access is enabled. A Ferusnet tenant account and a KAOS API key are required.

```cue
plugin: {
    id:     "kaos"
    name:   "Kaos"
    author: "Ferusnet"
    repo:   "ferusnet/kaos-plugin"

    html_url:    "https://community.obsidian.md/plugins/kaos"
    github_url:  "https://github.com/ferusnet/kaos-plugin"
    description: "Korwin Analytical Operating System — analytical layer over the Ferus ecosystem. Data stays in Azure; Obsidian is the display. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render live operational dashboards from your Ferusnet tenant inside Obsidian, with tabbed panes for each service and widgets shown as tables, badges, bar charts and status tiles. Keep all data in Azure and avoid writing to the vault unless you enable read/write access; require a Ferusnet tenant account and a KAOS API key."

    stats: {
        downloads:  27
        updated_at: 1786102889000
    }
}
```

[^template]: [[Obsidian plugin]]
