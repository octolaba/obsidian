---
uid: d47b7193-4e05-56c3-a8b4-93152af6d3bf
xid:
  - desmos-live
aliases:
  - desmos-live
  - Desmos Live
  - notnilc-n/obsidian-desmos-live
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/desmos-live
alt:
  - https://github.com/notnilc-n/obsidian-desmos-live
downloads: 119
updated at: "2026-06-08T02:53:27Z"
related to:
remind me:
---

# Desmos Live

Embeds an interactive Desmos graph from a fenced code block carrying the desmos-live modifier and a state object obtained from the Desmos calculator. Expressions, viewport and sliders from that state are preserved, and the graph height is set in the plugin settings. The directory text also relays the author's note that commercial use should be taken up with the Desmos partners page.

```cue
plugin: {
    id:     "desmos-live"
    name:   "Desmos Live"
    author: "notnilcn"
    repo:   "notnilc-n/obsidian-desmos-live"

    html_url:    "https://community.obsidian.md/plugins/desmos-live"
    github_url:  "https://github.com/notnilc-n/obsidian-desmos-live"
    description: "Embed live interactive Desmos graphs using desmos-live code blocks. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Please go visit desmos.com/partners if you are interested in using desmos for commercial because that's what desmos support told me to do when I asked them if there're any licensing issues. Embed interactive Desmos graphs by pasting a Calc.getState() JSON object into a fenced code block with the desmos-live modifier. Preserve expressions, viewport and sliders, and adjust the graph height in plugin settings."

    stats: {
        downloads:  119
        updated_at: 1780887207000
    }
}
```

[^template]: [[Obsidian plugin]]
