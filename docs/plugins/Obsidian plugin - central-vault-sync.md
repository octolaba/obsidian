---
uid: f3302ffa-213f-5930-ba72-c5ea2c69f28d
xid:
  - central-vault-sync
aliases:
  - central-vault-sync
  - Central Vault Sync
  - picassio/central-vault-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/central-vault-sync
alt:
  - https://github.com/picassio/central-vault-sync
downloads: 46
updated at: "2026-07-17T06:58:29Z"
related to:
  - "[[GitHub - 1298807909]]"
remind me:
---

# Central Vault Sync

Central Vault Sync synchronizes a vault with a self-hosted WebObsidian server, keeping stable entry ids, revisions, hashes and an ordered journal on both sides. Durable local operations are published before a pull, independent text edits are merged three-way deterministically, and overlapping or binary changes produce conflict copies. Every transfer is verified by SHA-256, and remote renames or deletions are deferred while the affected files still carry unsaved edits or pending local work.

```cue
plugin: {
    id:     "central-vault-sync"
    name:   "Central Vault Sync"
    author: "WebObsidian contributors"
    repo:   "picassio/central-vault-sync"

    html_url:    "https://community.obsidian.md/plugins/central-vault-sync"
    github_url:  "https://github.com/picassio/central-vault-sync"
    description: "Revision-safe synchronization with a self-hosted authoritative vault server. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault with a self-hosted WebObsidian server using revision-safe two-way synchronization that preserves stable entry IDs, revisions, hashes, and an ordered journal. Publish durable local operations before pulling, apply deterministic three-way merges for independent text edits, and create conflict copies for overlapping or binary changes. Verify every transfer by SHA-256 and defer remote renames or deletions while affected files have unsaved edits or pending local work."

    stats: {
        downloads:  46
        updated_at: 1784271509000
    }
}
```

[^template]: [[Obsidian plugin]]
