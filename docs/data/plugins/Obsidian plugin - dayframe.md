---
uid: 1e17a743-2bf9-5422-8c8d-80ac71d75384
xid:
  - dayframe
aliases:
  - dayframe
  - Dayframe
  - ganesshkumar/obsidian-dayframe
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/dayframe
alt:
  - https://github.com/ganesshkumar/obsidian-dayframe
downloads: 1298
updated at: "2026-08-08T18:03:02Z"
related to:
  - "[[GitHub - 979912101]]"
remind me:
---

# Dayframe

Injects a configurable prefix and suffix around daily notes named in YYYY-MM-DD form, rendered only in preview mode so the source files stay unchanged. The frame is defined by a template containing a {{DAYFRAME}} placeholder, and links, embeds and Markdown inside it are rendered normally. The injected content disappears in source mode and when navigating away from the note.

```cue
plugin: {
    id:     "dayframe"
    name:   "Dayframe"
    author: "Ganessh Kumar R P"
    repo:   "ganesshkumar/obsidian-dayframe"

    html_url:    "https://community.obsidian.md/plugins/dayframe"
    github_url:  "https://github.com/ganesshkumar/obsidian-dayframe"
    description: "like a picture frame but for your daily notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Inject a customizable prefix and suffix around YYYY-MM-DD daily notes in preview mode, rendering links, embeds, and markdown while keeping the source files clean. Define the frame with a template using a {{DAYFRAME}} placeholder so the added content appears only in preview and is removed in source or when navigating away."

    stats: {
        downloads:  1298
        updated_at: 1786212182000
    }
}
```

[^template]: [[Obsidian plugin]]
