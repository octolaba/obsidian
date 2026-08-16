---
uid: 95b4ad36-3b0f-52e0-9119-92e8b4736f07
xid:
  - akbun-notion-sync
aliases:
  - akbun-notion-sync
  - Akbun Notion Sync
  - choisungwook/obsidian-plugins
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/akbun-notion-sync
alt:
  - https://github.com/choisungwook/obsidian-plugins
downloads: 62
updated at: "2026-07-19T05:47:33Z"
related to:
  - "[[GitHub - 1301783515]]"
remind me:
---

# Akbun Notion Sync

Syncs every Markdown note in the vault to Notion as child pages under a chosen parent page. Notes are hashed with SHA-256 to detect new, changed and deleted files, so Notion pages are created, updated or archived accordingly, with API calls throttled and progress shown. Authentication uses an integration token or OAuth, with credentials stored outside the vault.

```cue
plugin: {
    id:     "akbun-notion-sync"
    name:   "Akbun Notion Sync"
    author: "choisungwook"
    repo:   "choisungwook/obsidian-plugins"

    html_url:    "https://community.obsidian.md/plugins/akbun-notion-sync"
    github_url:  "https://github.com/choisungwook/obsidian-plugins"
    description: "Sync your vault's markdown notes to Notion pages. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync every Markdown note in your vault to Notion as child pages under a chosen parent page. Hash notes with SHA-256 to detect new, changed, or deleted files and create, update, or archive Notion pages; throttle API calls and show progress. Authenticate via integration token or OAuth with credentials stored outside the vault for safety."

    stats: {
        downloads:  62
        updated_at: 1784440053000
    }
}
```

[^template]: [[Obsidian plugin]]
