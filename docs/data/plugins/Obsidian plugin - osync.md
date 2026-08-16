---
uid: 7c5d445d-7a67-51fb-8fe9-c5cb1162f6af
xid:
  - osync
aliases:
  - osync
  - "Osync (Self-Hosted)"
  - korthomasjeong/Osync-p
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/osync
alt:
  - https://github.com/korthomasjeong/Osync-p
downloads: 472
updated at: "2026-07-24T02:18:07Z"
related to:
  - "[[GitHub - 1247249633]]"
remind me:
---

# Osync (Self-Hosted)

Osync synchronizes a vault across devices in real time against a self-hosted server run with Docker. Encryption is end-to-end and zero-knowledge, using AES-256-GCM with Argon2id-derived vault keys so data is encrypted on the device before upload. Attachment and folder sync is configured per device, and remote vaults are created or connected with version history, conflict resolution and restoration of deleted files.

```cue
plugin: {
    id:     "osync"
    name:   "Osync (Self-Hosted)"
    author: "Thomas Jeong"
    repo:   "korthomasjeong/Osync-p"

    html_url:    "https://community.obsidian.md/plugins/osync"
    github_url:  "https://github.com/korthomasjeong/Osync-p"
    description: "Self-hosted, end-to-end encrypted vault sync. Run your own server (Docker). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault across devices in real time with zero-knowledge, end-to-end AES-256-GCM encryption and Argon2id-derived vault keys so data is encrypted on-device before upload. Manage per-device sync for attachments and folders, create/connect remote vaults, browse version history, resolve conflicts, and restore deleted files."

    stats: {
        downloads:  472
        updated_at: 1784859487000
    }
}
```

[^template]: [[Obsidian plugin]]
