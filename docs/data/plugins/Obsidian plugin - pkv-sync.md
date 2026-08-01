---
uid: 28583927-d4ab-58a5-9cb5-17e9b90f88cf
xid:
  - pkv-sync
aliases:
  - pkv-sync
  - PKV Sync
  - cyberkurry/pkv-sync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pkv-sync
alt:
  - https://github.com/cyberkurry/pkv-sync-plugin
downloads: 111
updated at: "2026-06-16T16:14:01Z"
related to:
  - "[[GitHub - 1265373833]]"
remind me:
---

# PKV Sync

PKV Sync synchronises vaults across devices through a self-hosted, Git-backed PKV Sync server. Each file keeps a commit history with diffs and restores, conflicts are resolved through three-way merges and resolvable conflict files, and the whole vault can be rolled back. The recorded inputs also list multi-user and multi-vault setups with sub-second propagation, read-only git clone access, a built-in MCP server and an admin web interface.

```cue
plugin: {
    id:     "pkv-sync"
    name:   "PKV Sync"
    author: "cyberkurry"
    repo:   "cyberkurry/pkv-sync-plugin"

    html_url:    "https://community.obsidian.md/plugins/pkv-sync"
    github_url:  "https://github.com/cyberkurry/pkv-sync-plugin"
    description: "Self-hosted Obsidian vault synchronization with versioned backup. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vaults across devices via a self-hosted, Git-backed PKV Sync server. Keep per-file commit history with diffs and restores, perform three-way merges with resolvable .conflict files, use vault-level rollback, sync multi-user/multi-vault setups with sub-second propagation, and get read-only git clone access, a built-in MCP server, and an admin web UI."

    stats: {
        downloads:  111
        updated_at: 1781626441000
    }
}
```

[^template]: [[Obsidian plugin]]
