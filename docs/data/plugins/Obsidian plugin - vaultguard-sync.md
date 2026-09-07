---
uid: 6c19e70b-0773-5a35-9b17-c37dd47ebe62
xid:
  - vaultguard-sync
aliases:
  - vaultguard-sync
  - VaultGuard Sync
  - peter70700/vaultguard-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vaultguard-sync
alt:
  - https://github.com/peter70700/vaultguard-obsidian
downloads: 369
updated at: "2026-08-11T13:13:25Z"
related to:
  - "[[GitHub - 1236556714]]"
remind me:
---

# VaultGuard Sync

VaultGuard Sync replaces standard cloud sync with permission-aware end-to-end encrypted sync built on AES-256-GCM and KMS-backed keys, running through AWS on desktop and mobile. Per-file permissions are enforced with role inheritance, time-bound key leases and automatic re-encryption when a user is offboarded. It also covers multiple vaults, plugin allowlists, authentication, local at-rest encryption and audit logging.

```cue
plugin: {
    id:     "vaultguard-sync"
    name:   "VaultGuard Sync"
    author: "Peter Sedmak"
    repo:   "peter70700/vaultguard-obsidian"

    html_url:    "https://community.obsidian.md/plugins/vaultguard-sync"
    github_url:  "https://github.com/peter70700/vaultguard-obsidian"
    description: "Permission-aware encrypted cloud sync for enterprise vaults. Enforces per-file permissions, E2E encryption, and full audit logging through AWS. Replaces standard cloud sync. Desktop + mobile supported - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync vaults with permission-aware end-to-end encryption (AES-256-GCM) using KMS-backed keys. Enforce per-file permissions with role inheritance, time-bound key leases and automatic re-encryption on user offboarding. Support multi-vaults, plugin allowlists, secure authentication and local at-rest encryption."

    stats: {
        downloads:  369
        updated_at: 1786454005000
    }
}
```

[^template]: [[Obsidian plugin]]
