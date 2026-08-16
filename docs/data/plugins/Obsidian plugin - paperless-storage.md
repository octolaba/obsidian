---
uid: fc1ab3e4-514e-59df-92b5-5b7c8c79f4c5
xid:
  - paperless-storage
aliases:
  - paperless-storage
  - Paperless Storage
  - johannes-kaindl/paperless-storage
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/paperless-storage
alt:
  - https://github.com/johannes-kaindl/paperless-storage
downloads: 26
updated at: "2026-08-06T19:51:38Z"
related to:
  - "[[GitHub - 1325644667]]"
remind me:
---

# Paperless Storage

Embeds documents from a paperless-ngx instance in notes and renders PDFs inline with Obsidian's built-in viewer. Files are fetched with an API token rather than public share links, and inserted through a search modal. Documents saved as .paperless files open in full panes, stub titles are kept in sync, and PDFs are cached locally for offline reading, with a command to clear the cache.

```cue
plugin: {
    id:     "paperless-storage"
    name:   "Paperless Storage"
    author: "Johannes Kaindl"
    repo:   "johannes-kaindl/paperless-storage"

    html_url:    "https://community.obsidian.md/plugins/paperless-storage"
    github_url:  "https://github.com/johannes-kaindl/paperless-storage"
    description: "Embed documents from your paperless-ngx instance directly in your notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed documents from your paperless-ngx instance directly in notes and render inline PDFs with Obsidian's built-in viewer. Fetch files over an API token (not public share links), insert via a search modal, open .paperless files in full panes, sync stub titles, and cache PDFs locally for offline reading with a cache-clear command."

    stats: {
        downloads:  26
        updated_at: 1786045898000
    }
}
```

[^template]: [[Obsidian plugin]]
