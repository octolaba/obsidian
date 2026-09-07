---
uid: 2b5f5094-f848-5608-8020-5d382d7ef55b
xid:
  - lan-vault-sync
aliases:
  - lan-vault-sync
  - LAN Vault Sync
  - senjanson/lan-vault-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/lan-vault-sync
alt:
  - https://github.com/senjanson/lan-vault-sync
downloads: 629
updated at: "2026-04-02T11:43:35Z"
related to:
  - "[[GitHub - 1195345437]]"
remind me:
---

# LAN Vault Sync

Synchronizes the vault in real time across a local network, without a cloud service, server or subscription. Concurrent text edits are merged at character level with Yjs CRDT so they do not conflict, attachments are synced by comparing hashes, and peers are discovered automatically over the LAN.

```cue
plugin: {
    id:     "lan-vault-sync"
    name:   "LAN Vault Sync"
    author: "senjanson"
    repo:   "senjanson/lan-vault-sync"

    html_url:    "https://community.obsidian.md/plugins/lan-vault-sync"
    github_url:  "https://github.com/senjanson/lan-vault-sync"
    description: "Real-time vault synchronization over LAN using Yjs CRDT for conflict-free merging. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault in real time across your local network with no cloud, server, or subscription. Merge concurrent text edits at the character level with Yjs CRDT to avoid conflicts, sync attachments via hash comparison, and auto-discover peers over LAN."

    stats: {
        downloads:  629
        updated_at: 1775130215000
    }
}
```

[^template]: [[Obsidian plugin]]
