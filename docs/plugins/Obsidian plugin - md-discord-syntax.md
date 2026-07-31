---
uid: ec0ae9a0-5cd0-57e2-8957-9e6e3f0acbfb
xid:
  - md-discord-syntax
aliases:
  - md-discord-syntax
  - Discord Syntax
  - edems-dev/md-discord-syntax
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/md-discord-syntax
alt:
  - https://github.com/edems-dev/md-discord-syntax
downloads: 30
updated at: "2026-07-23T18:25:11Z"
related to:
  - "[[GitHub - 1307815643]]"
remind me:
---

# Discord Syntax

Adds two Discord-style Markdown constructs to Obsidian: a passage wrapped in double pipes becomes a collapsible spoiler block, and a leading -# renders the line as small, muted subtext. Spoiler blocks mask sensitive or confidential text, while -# lines act as compact secondary annotations.

```cue
plugin: {
    id:     "md-discord-syntax"
    name:   "Discord Syntax"
    author: "edems"
    repo:   "edems-dev/md-discord-syntax"

    html_url:    "https://community.obsidian.md/plugins/md-discord-syntax"
    github_url:  "https://github.com/edems-dev/md-discord-syntax"
    description: "Discord-style ||spoiler|| and \"-# subtext\" markdown formatting extension - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Add Discord-style Markdown to Obsidian using ||spoiler|| for collapsible spoiler blocks and -# at line starts for small, muted subtext. Mask sensitive or confidential text behind ||spoiler|| blocks. Render -# lines as compact, secondary text for subtle annotations."

    stats: {
        downloads:  30
        updated_at: 1784831111000
    }
}
```

[^template]: [[Obsidian plugin]]
