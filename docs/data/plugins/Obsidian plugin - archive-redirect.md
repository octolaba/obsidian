---
uid: 5955452d-b541-5f33-b034-519832db76af
xid:
  - archive-redirect
aliases:
  - archive-redirect
  - Archive Redirect
  - semsevens/obsidian-archive-redirect
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/archive-redirect
alt:
  - https://github.com/semsevens/obsidian-archive-redirect
downloads: 417
updated at: "2026-08-02T00:53:17Z"
related to:
  - "[[GitHub - 1236485516]]"
remind me:
---

# Archive Redirect

Downloads remote images, video and audio referenced in Markdown into a local content-addressed cache and serves the cached copies when a note renders in Reading view and Live Preview. The Markdown itself is left unchanged and identical URLs are deduplicated by hash. If the local copy is missing, rendering falls back to the remote URL.

```cue
plugin: {
    id:     "archive-redirect"
    name:   "Archive Redirect"
    author: "semsevens"
    repo:   "semsevens/obsidian-archive-redirect"

    html_url:    "https://community.obsidian.md/plugins/archive-redirect"
    github_url:  "https://github.com/semsevens/obsidian-archive-redirect"
    description: "Archive remote URLs from markdown locally and serve from local cache on render. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Archive remote images, video, and audio referenced in Markdown to a local content-addressed cache and serve the cached files when notes render in Reading and Live Preview. Keep the original Markdown unchanged, dedupe identical URLs by hash, and fall back to the remote URL if the local copy is missing."

    stats: {
        downloads:  417
        updated_at: 1785631997000
    }
}
```

[^template]: [[Obsidian plugin]]
