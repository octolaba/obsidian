---
uid: 7545c02c-0b4b-52f2-a614-a742bd569d01
xid:
  - vaultcrypt
aliases:
  - vaultcrypt
  - VaultCrypt
  - romejoe/VaultCrypt
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vaultcrypt
alt:
  - https://github.com/romejoe/VaultCrypt
downloads: 280
updated at: "2026-04-06T18:24:01Z"
related to:
  - "[[GitHub - 1191777345]]"
remind me:
---

# VaultCrypt

Stores secrets in KeePass-compatible .kdbx databases kept inside the vault, using Argon2id key derivation. Secrets are referenced inline by tokens naming a profile and a field, which render as masked interactive chips so that plaintext is never exposed in the note. Values are copied to the clipboard with auto-clear, and profiles are locked and unlocked per session.

```cue
plugin: {
    id:     "vaultcrypt"
    name:   "VaultCrypt"
    author: "romejoe"
    repo:   "romejoe/VaultCrypt"

    html_url:    "https://community.obsidian.md/plugins/vaultcrypt"
    github_url:  "https://github.com/romejoe/VaultCrypt"
    description: "Inline encryption for sensitive fields in notes using KeePass-compatible (.kdbx) storage. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Store secrets in KeePass-compatible (.kdbx) databases inside your vault. Reference secrets inline with {{vc:profileId/...#Field}} tokens that render as masked, interactive chips and never expose plaintext. Copy values to clipboard with auto-clear, lock/unlock profiles per session, and use Argon2id key derivation."

    stats: {
        downloads:  280
        updated_at: 1775499841000
    }
}
```

[^template]: [[Obsidian plugin]]
