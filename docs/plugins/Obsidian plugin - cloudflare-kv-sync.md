---
uid: 3dd3644b-0cbc-5b1b-a955-bd0614714e5f
xid:
  - cloudflare-kv-sync
aliases:
  - cloudflare-kv-sync
  - Cloudflare KV Sync
  - alexmensch/obsidian-cloudflare-kv-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloudflare-kv-sync
alt:
  - https://github.com/alexmensch/obsidian-cloudflare-kv-sync
downloads: 149
updated at: "2026-05-30T12:53:22Z"
related to:
  - "[[GitHub - 1035511939]]"
remind me:
---

# Cloudflare KV Sync

Syncs Markdown files marked by frontmatter flags to Cloudflare KV storage, assigning unique ids and detecting and correcting duplicate KV keys during a full sync. Optional collection prefixes organize the keys, a changed collection removes the old keys automatically, and errors are written to a persistent log file in the vault. Uploads are debounced to limit API calls, and ribbon and command controls drive runs on demand.

```cue
plugin: {
    id:     "cloudflare-kv-sync"
    name:   "Cloudflare KV Sync"
    author: "alexmensch"
    repo:   "alexmensch/obsidian-cloudflare-kv-sync"

    html_url:    "https://community.obsidian.md/plugins/cloudflare-kv-sync"
    github_url:  "https://github.com/alexmensch/obsidian-cloudflare-kv-sync"
    description: "Automatically sync tagged Markdown files to Cloudflare KV storage. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Markdown files to Cloudflare KV using frontmatter flags, auto-assign unique IDs, and detect/auto-correct duplicate KV keys during full sync. Organize keys with optional collection prefixes, handle collection changes and remove old keys automatically, and log errors to a persistent file in your vault. Debounce uploads to prevent excessive API calls and provide manual ribbon/command controls for on-demand operations."

    stats: {
        downloads:  149
        updated_at: 1780145602000
    }
}
```

[^template]: [[Obsidian plugin]]
