---
uid: b8402fe3-4020-505b-9018-ce3e0aedeee3
xid:
  - vault-sync
aliases:
  - vault-sync
  - VaultSync
  - thewordisbird/VaultSync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-sync
alt:
  - https://github.com/thewordisbird/VaultSync
downloads: 971
updated at: "2025-03-01T16:05:13Z"
related to:
  - "[[GitHub - 760140806]]"
remind me:
---

# VaultSync

Links the vault to a cloud storage provider and synchronizes files between the local and the remote folder; the recorded About names Dropbox and covers desktop and mobile. Synchronization is bidirectional — files present only on the provider are downloaded, files present only locally are uploaded — and a conflict is resolved by keeping the most recently modified version. A remote folder is chosen to mirror the local vault.

```cue
plugin: {
    id:     "vault-sync"
    name:   "VaultSync"
    author: "thewordisbird"
    repo:   "thewordisbird/VaultSync"

    html_url:    "https://community.obsidian.md/plugins/vault-sync"
    github_url:  "https://github.com/thewordisbird/VaultSync"
    description: "Sync vault with cloud storage provider."
    about:       "Link your Obsidian vault to Dropbox and sync files between local and remote folders on desktop and mobile. Sync bidirectionally: download provider-only files, upload local-only files, and resolve conflicts by keeping the most recently modified version. Select a remote vault folder to mirror with your local vault."

    stats: {
        downloads:  971
        updated_at: 1740845113000
    }
}
```

[^template]: [[Obsidian plugin]]
