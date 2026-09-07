---
uid: e9457844-cb6e-56da-819f-d38426a327ff
xid:
  - autolinks
aliases:
  - autolinks
  - Auto Links
  - devxoul/obsidian-autolinks
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/autolinks
alt:
  - https://github.com/devxoul/obsidian-autolinks
downloads: 300
updated at: "2026-06-03T16:11:02Z"
related to:
  - "[[GitHub - 1135425414]]"
remind me:
---

# Auto Links

Auto Links turns text matching a full regex pattern into a clickable link in Reading View and Live Preview, with capture groups feeding the URL template. Code blocks, inline code, existing links, wikilinks and frontmatter are skipped, patterns are enabled or disabled individually, changes apply in real time, and overlapping matches are resolved first-match-wins.

```cue
plugin: {
    id:     "autolinks"
    name:   "Auto Links"
    author: "devxoul"
    repo:   "devxoul/obsidian-autolinks"

    html_url:    "https://community.obsidian.md/plugins/autolinks"
    github_url:  "https://github.com/devxoul/obsidian-autolinks"
    description: "Auto-convert regex patterns to clickable links. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert full regex patterns into clickable links in Reading View and Live Preview, supporting capture groups ($1-$9) for URL templates. Skip code blocks, inline code, existing links, wikilinks and frontmatter; enable or disable patterns individually, apply changes in real time, and prevent overlaps with first-match-wins."

    stats: {
        downloads:  300
        updated_at: 1780503062000
    }
}
```

[^template]: [[Obsidian plugin]]
