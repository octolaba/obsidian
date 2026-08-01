---
uid: e3f143f7-b5f7-5ae8-8142-184efe564093
xid:
  - auto-gitkeep
aliases:
  - auto-gitkeep
  - Auto GitKeep
  - satosprod/auto-gitkeep
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-gitkeep
alt:
  - https://github.com/satosprod/auto-gitkeep
downloads: 55
updated at: "2026-07-03T14:29:53Z"
related to:
  - "[[GitHub - 1283163491]]"
remind me:
---

# Auto GitKeep

Auto GitKeep places a .gitkeep file in every folder so empty directories stay tracked by Git and survive a clone. It scans the vault on startup, watches for new or renamed folders, respects excluded paths, and offers manual add and remove actions plus a status panel counting folders and .gitkeep files.

```cue
plugin: {
    id:     "auto-gitkeep"
    name:   "Auto GitKeep"
    author: "SATOSprod"
    repo:   "satosprod/auto-gitkeep"

    html_url:    "https://community.obsidian.md/plugins/auto-gitkeep"
    github_url:  "https://github.com/satosprod/auto-gitkeep"
    description: "Automatically places a .gitkeep file in every folder of your vault so empty directories are tracked by Git. Scans existing folders on load and watches for new ones. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Add .gitkeep files to every folder to keep empty directories tracked by Git and preserved when cloning. Scan the vault on startup, watch new or renamed folders, respect excluded paths, and provide manual add/remove actions plus a status panel showing folders and .gitkeep counts."

    stats: {
        downloads:  55
        updated_at: 1783088993000
    }
}
```

[^template]: [[Obsidian plugin]]
