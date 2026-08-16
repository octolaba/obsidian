---
uid: 54160d44-8d07-5be1-8d0a-edfd9fa64ccb
xid:
  - custom-publish
aliases:
  - custom-publish
  - Custom Publish
  - danyim/obsidian-custom-publish
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/custom-publish
alt:
  - https://github.com/danyim/obsidian-custom-publish
downloads: 89
updated at: "2026-02-20T05:01:50Z"
related to:
  - "[[GitHub - 1162270461]]"
remind me:
---

# Custom Publish

Adds command palette actions that set, unset or toggle the frontmatter properties controlling whether a note is published and visible. A further command copies a note's public URL to the clipboard from a URL template in which a page placeholder is replaced by the slugified filename.

```cue
plugin: {
    id:     "custom-publish"
    name:   "Custom Publish"
    author: "danyim"
    repo:   "danyim/obsidian-custom-publish"

    html_url:    "https://community.obsidian.md/plugins/custom-publish"
    github_url:  "https://github.com/danyim/obsidian-custom-publish"
    description: "Command palette actions to manage frontmatter publish and visibility properties, with a copy-URL command for published pages. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Set, unset, or toggle frontmatter flags to control publishing and visibility of notes from the command palette. Copy a note's public URL to the clipboard using a URL template with ${PAGE} replaced by a slugified filename."

    stats: {
        downloads:  89
        updated_at: 1771563710000
    }
}
```

[^template]: [[Obsidian plugin]]
