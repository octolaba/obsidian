---
uid: 113a51e2-55a7-5260-945b-1b12f6ecf570
xid:
  - permalink-opener
aliases:
  - permalink-opener
  - Permalink Opener
  - kepano/obsidian-permalink-opener
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/permalink-opener
alt:
  - https://github.com/kepano/obsidian-permalink-opener
downloads: 4401
updated at: "2026-05-12T01:37:21Z"
related to:
  - "[[GitHub - 666168384]]"
remind me:
---

# Permalink Opener

Permalink Opener opens the published URL of the current note from a permalink or slug recorded in the note properties. It switches between live and development base URLs and is invoked from the command palette or a hotkey. When no permalink is present the title is slugified to kebab-case, which the recorded description ties to static site generators such as Jekyll, Hugo and Eleventy.

```cue
plugin: {
    id:     "permalink-opener"
    name:   "Permalink Opener"
    author: "kepano"
    repo:   "kepano/obsidian-permalink-opener"

    html_url:    "https://community.obsidian.md/plugins/permalink-opener"
    github_url:  "https://github.com/kepano/obsidian-permalink-opener"
    description: "Open URLs based on a permalink or slug in the note properties. Useful with static site generators such as Jekyll, Hugo, Eleventy, etc."
    about:       "Open the published URL for the current note using a permalink or frontmatter slug. Switch between live and development base URLs and open via command palette or hotkey; slugify the title to kebab-case when no permalink exists."

    stats: {
        downloads:  4401
        updated_at: 1778549841000
    }
}
```

[^template]: [[Obsidian plugin]]
