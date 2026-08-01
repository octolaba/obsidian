---
uid: b044defc-167d-57fd-afd4-c9d296a9ca17
xid:
  - rofi-helper
aliases:
  - rofi-helper
  - Rofi Helper
  - digitalsignalperson/obsidian-rofi-helper
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/rofi-helper
alt:
  - https://github.com/digitalsignalperson/obsidian-rofi-helper
downloads: 3357
updated at: "2023-02-21T13:00:04Z"
related to:
  - "[[GitHub - 604584256]]"
remind me:
---

# Rofi Helper

Rofi Helper adds leaf id and filename parameters to the Obsidian URI protocol so an open tab can be switched to directly. A sample obsidian-rofi.py script is included that lists open tabs with their unique leaf ids, so a tab can be selected in Rofi and jumped to through the switch URI.

```cue
plugin: {
    id:     "rofi-helper"
    name:   "Rofi Helper"
    author: "digitalsignalperson"
    repo:   "digitalsignalperson/obsidian-rofi-helper"

    html_url:    "https://community.obsidian.md/plugins/rofi-helper"
    github_url:  "https://github.com/digitalsignalperson/obsidian-rofi-helper"
    description: "Add a leaf ID parameter to the URI protocol for switching between open tabs with Rofi. A sample Rofi script is included."
    about:       "Add leaf id and filename URI parameters to Obsidian to switch directly to open tabs from Rofi. Include a sample obsidian-rofi.py script that lists open tabs with unique leaf ids so you can select and jump to any tab via the obsidian://switch URI."

    stats: {
        downloads:  3357
        updated_at: 1676984404000
    }
}
```

[^template]: [[Obsidian plugin]]
