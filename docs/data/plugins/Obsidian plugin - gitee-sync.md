---
uid: 7e17c111-596a-54e9-aa02-a08ed28a94ef
xid:
  - gitee-sync
aliases:
  - gitee-sync
  - Gitee Sync
  - ericquan8/obsidian-gitee-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gitee-sync
alt:
  - https://github.com/ericquan8/obsidian-gitee-sync
downloads: 166
updated at: "2026-07-11T04:27:04Z"
related to:
  - "[[GitHub - 1295038913]]"
remind me:
---

# Gitee Sync

Syncs a vault to a private Gitee or GitHub repository as plain Markdown files through the platform's OpenAPI, with no server and no Git installation. Sync is bidirectional and incremental by content hash with per-file commits, conflicts are resolved by newest modification, and the full remote history is kept for recovery.

```cue
plugin: {
    id:     "gitee-sync"
    name:   "Gitee Sync"
    author: "eric"
    repo:   "ericquan8/obsidian-gitee-sync"

    html_url:    "https://community.obsidian.md/plugins/gitee-sync"
    github_url:  "https://github.com/ericquan8/obsidian-gitee-sync"
    description: "Sync your vault to a Gitee or GitHub repository. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault to a private Gitee or GitHub repository as plain Markdown files via the platform OpenAPI, with no server or git installation needed. Perform bidirectional, content-hash incremental sync with per-file commits, newest-modification conflict resolution, and full remote history for recovery."

    stats: {
        downloads:  166
        updated_at: 1783744024000
    }
}
```

[^template]: [[Obsidian plugin]]
