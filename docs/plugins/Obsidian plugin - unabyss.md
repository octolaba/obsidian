---
uid: 3eb23e51-c8b9-583c-801f-a35cac08d6f3
xid:
  - unabyss
aliases:
  - unabyss
  - Unabyss
  - unabyss/obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/unabyss
alt:
  - https://github.com/unabyss/obsidian-plugin
downloads: 123
updated at: "2026-06-17T12:34:17Z"
related to:
  - "[[GitHub - 1268591002]]"
remind me:
---

# Unabyss

Syncs notes and exports between the vault and Unabyss in both directions, authenticating with OAuth2 and PKCE. Outbound sync is triggered by file changes with a five-second debounce and backed by an hourly bidirectional pass. Uploads are manifest-first and change-aware, sending only unknown hashes and skipping notes above one mebibyte, while exports are pulled into a chosen folder as slugified titles with configurable deletion handling.

```cue
plugin: {
    id:     "unabyss"
    name:   "Unabyss"
    author: "Unabyss"
    repo:   "unabyss/obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/unabyss"
    github_url:  "https://github.com/unabyss/obsidian-plugin"
    description: "Sync notes and exports between your Obsidian vault and Unabyss. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with Unabyss two-way via OAuth2+PKCE, using file-change outbound sync (5s debounce) plus an hourly bidirectional safety net. Push manifest-first, change-aware deltas that upload only unknown hashes and skip notes >1 MiB; pull exports into a chosen folder as slugified-title.md with configurable deletion handling."

    stats: {
        downloads:  123
        updated_at: 1781699657000
    }
}
```

[^template]: [[Obsidian plugin]]
