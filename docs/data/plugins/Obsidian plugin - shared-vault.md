---
uid: 1545609b-bf3a-51b0-952a-e7a2f020d988
xid:
  - shared-vault
aliases:
  - shared-vault
  - Shared Vault
  - fangface-hub/ObsidianSharedVault
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/shared-vault
alt:
  - https://github.com/fangface-hub/ObsidianSharedVault
downloads: 34
updated at: "2026-07-18T22:46:11Z"
related to:
  - "[[GitHub - 1304076095]]"
remind me:
---

# Shared Vault

Shared Vault adds a serverless, conflict-free collaboration layer by keeping Yjs-compatible operation logs, node registry entries and snapshots inside the vault itself. Per-device CRDT caches live under the Obsidian cache directory, keyed by vault, node and user, and remote changes arrive through background polling or a manual sync. The in-vault node registry shows which participants are active and which have expired.

```cue
plugin: {
    id:     "shared-vault"
    name:   "Shared Vault"
    author: "fangface-hub"
    repo:   "fangface-hub/ObsidianSharedVault"

    html_url:    "https://community.obsidian.md/plugins/shared-vault"
    github_url:  "https://github.com/fangface-hub/ObsidianSharedVault"
    description: "Serverless, conflict-free collaboration layer for shared vaults. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Enable serverless, conflict-free collaboration by storing Yjs-compatible operation logs, node registry entries, and snapshots inside the vault. Keep per-device CRDT caches in .obsidian/cache/{vault-id}/{node-id}/{user-id}/, apply remote changes via background polling or manual sync, and view the in-vault node registry to track active or expired participants."

    stats: {
        downloads:  34
        updated_at: 1784414771000
    }
}
```

[^template]: [[Obsidian plugin]]
