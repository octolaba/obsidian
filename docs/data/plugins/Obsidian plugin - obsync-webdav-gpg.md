---
uid: 95d6dc5e-f665-5fb4-bf89-26fc25afaa94
xid:
  - obsync-webdav-gpg
aliases:
  - obsync-webdav-gpg
  - Webdav PQC Sync
  - normanify/obsync_webdav_gpg
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsync-webdav-gpg
alt:
  - https://github.com/normanify/obsync_webdav_gpg
downloads: 72
updated at: "2026-07-14T13:27:50Z"
related to:
  - "[[GitHub - 1290528605]]"
remind me:
---

# Webdav PQC Sync

Vault data is encrypted with post-quantum cryptography and only ciphertext is synced to a WebDAV server, with private keys kept local. Filenames and folder structure are hidden as well through per-segment AES-256-GCM path encryption, and sync is bidirectional and incremental with conflict detection and optional automation. The index records that this plugin has not been manually reviewed by Obsidian staff.

```cue
plugin: {
    id:     "obsync-webdav-gpg"
    name:   "Webdav PQC Sync"
    author: "obsync"
    repo:   "normanify/obsync_webdav_gpg"

    html_url:    "https://community.obsidian.md/plugins/obsync-webdav-gpg"
    github_url:  "https://github.com/normanify/obsync_webdav_gpg"
    description: "Encrypt vault data with Post Quantum and sync/restore to/from WebDAV. Encrypts both file content and filenames. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt your Obsidian vault with Post Quantum and sync only ciphertext to any WebDAV server while keeping private keys local. Hide filenames and folder structure via per-segment AES-256-GCM path encryption, and perform bidirectional incremental sync with conflict detection and optional auto-sync."

    stats: {
        downloads:  72
        updated_at: 1784035670000
    }
}
```

[^template]: [[Obsidian plugin]]
