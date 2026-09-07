---
uid: a9d4dcb5-ca9f-5313-8612-25010dc2ae0b
xid:
  - hermes-rvault
aliases:
  - hermes-rvault
  - Hermes R2 Vault
  - ivana331100/VPS-R2-Obsidian-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/hermes-rvault
alt:
  - https://github.com/ivana331100/VPS-R2-Obsidian-sync
downloads: 31
updated at: "2026-08-02T08:41:52Z"
related to:
  - "[[GitHub - 1309556535]]"
remind me:
---

# Hermes R2 Vault

Encrypts the vault on the client with XChaCha20-Poly1305 and Argon2id key derivation, then publishes it to Cloudflare R2 for Hermes. Sync is bidirectional with last-writer-wins conflict resolution over content-addressable storage, keeping revision history. It also provides safe garbage collection, retention planning, integrity scanning and point-in-time recovery.

```cue
plugin: {
    id:     "hermes-rvault"
    name:   "Hermes R2 Vault"
    author: "Ivan"
    repo:   "ivana331100/VPS-R2-Obsidian-sync"

    html_url:    "https://community.obsidian.md/plugins/hermes-rvault"
    github_url:  "https://github.com/ivana331100/VPS-R2-Obsidian-sync"
    description: "Encrypts Obsidian notes locally and publishes them to Cloudflare R2 for Hermes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt and sync your Obsidian vault to Cloudflare R2 with client-side XChaCha20-Poly1305 and Argon2id key derivation. Use bidirectional sync with Last-Writer-Wins conflict resolution, content-addressable storage, revision history, safe garbage collection, retention planning, integrity scanning and point-in-time recovery."

    stats: {
        downloads:  31
        updated_at: 1785660112000
    }
}
```

[^template]: [[Obsidian plugin]]
