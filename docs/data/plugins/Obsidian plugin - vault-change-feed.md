---
uid: 8484d384-5d9b-5132-9b04-a80f2c9a3a2c
xid:
  - vault-change-feed
aliases:
  - vault-change-feed
  - Vault Change Feed
  - kains2866/vault-change-feed
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-change-feed
alt:
  - https://github.com/kains2866/vault-change-feed
downloads: 35
updated at: "2026-07-27T11:19:47Z"
related to:
  - "[[GitHub - 1313547330]]"
remind me:
---

# Vault Change Feed

Records every vault change as a machine-readable event feed with independent per-reader cursors, so an AI assistant pulls only new events instead of rescanning the whole vault. Line-level diffs are computed, renames are detected by content hash, and the state is reconciled at startup. The feed and its snapshots are stored locally.

```cue
plugin: {
    id:     "vault-change-feed"
    name:   "Vault Change Feed"
    author: "kains"
    repo:   "kains2866/vault-change-feed"

    html_url:    "https://community.obsidian.md/plugins/vault-change-feed"
    github_url:  "https://github.com/kains2866/vault-change-feed"
    description: "Records vault changes as a machine-readable feed with per-reader cursors, so AI assistants can incrementally catch up on what you changed. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Record every vault change as a machine-readable event feed with independent read cursors so AI agents pull only new events without rescanning the whole vault. Compute line-level diffs, detect renames by content hash, reconcile at startup, and keep the feed and snapshots stored locally."

    stats: {
        downloads:  35
        updated_at: 1785151187000
    }
}
```

[^template]: [[Obsidian plugin]]
