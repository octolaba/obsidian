---
uid: 30906cea-b796-598e-b3eb-d80020c32631
xid:
  - link-with-alias
aliases:
  - link-with-alias
  - Link with alias
  - pvojtechovsky/obsidian-link-with-alias
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/link-with-alias
alt:
  - https://github.com/pvojtechovsky/obsidian-link-with-alias
downloads: 11044
updated at: "2025-02-25T16:23:22Z"
related to:
  - "[[GitHub - 641493856]]"
remind me:
---

# Link with alias

Creates links whose display text is also written into the target document's front-matter aliases, so that display text survives Obsidian's autocompletion. Target notes are created or updated automatically, aliases can be added for links that already exist, and the display-text alias of the last edited link can be toggled.

```cue
plugin: {
    id:     "link-with-alias"
    name:   "Link with alias"
    author: "pvojtechovsky"
    repo:   "pvojtechovsky/obsidian-link-with-alias"

    html_url:    "https://community.obsidian.md/plugins/link-with-alias"
    github_url:  "https://github.com/pvojtechovsky/obsidian-link-with-alias"
    description: "Create links and aliases in front matter of target document."
    about:       "Create links that add the link's display text into the target note's front-matter aliases and preserve that display text against Obsidian's autocompletion. Create or update target notes automatically, add aliases for existing links, and toggle the display text alias of the last edited link."

    stats: {
        downloads:  11044
        updated_at: 1740500602000
    }
}
```

[^template]: [[Obsidian plugin]]
