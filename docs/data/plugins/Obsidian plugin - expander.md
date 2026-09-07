---
uid: 7fe3b03d-f97e-57af-96c6-457ffce92f36
xid:
  - expander
aliases:
  - expander
  - Expander
  - dsebastien/obsidian-expander
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/expander
alt:
  - https://github.com/dsebastien/obsidian-expander
downloads: 317
updated at: "2026-07-29T07:44:32Z"
related to:
  - "[[GitHub - 1142225878]]"
remind me:
---

# Expander

Replaces variables across the vault that are marked with HTML comment markers, substituting key-value pairs with static values or with the result of a function expression such as a formatted current date. Update modes cover automatic, manual, once, and once-and-eject behaviour, folders can be filtered, replacements run from commands or editor buttons, and badges show the current mode.

```cue
plugin: {
    id:     "expander"
    name:   "Expander"
    author: "Sébastien Dubois"
    repo:   "dsebastien/obsidian-expander"

    html_url:    "https://community.obsidian.md/plugins/expander"
    github_url:  "https://github.com/dsebastien/obsidian-expander"
    description: "Replace variables across your vault using HTML comment markers. Supports static values and dynamic functions. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Replace variables across your vault using HTML comment markers and key–value pairs, inserting static or dynamic values with function expressions like now().format(\"YYYY-MM-DD\"). Control update modes (auto, manual, once, once-and-eject), filter folders, run replacements via commands or editor buttons, and view mode badges."

    stats: {
        downloads:  317
        updated_at: 1785311072000
    }
}
```

[^template]: [[Obsidian plugin]]
