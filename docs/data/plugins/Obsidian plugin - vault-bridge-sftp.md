---
uid: adc55501-2f45-570f-b02f-c62b00fe9577
xid:
  - vault-bridge-sftp
aliases:
  - vault-bridge-sftp
  - Vault Bridge SFTP
  - andrewkopylev/vaultbridge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-bridge-sftp
alt:
  - https://github.com/andrewkopylev/vaultbridge
downloads: 427
updated at: "2026-05-03T18:10:59Z"
related to:
  - "[[GitHub - 1223156026]]"
remind me:
---

# Vault Bridge SFTP

Synchronizes a vault between desktops through the user's own SSH or SFTP server, without a cloud service or a proxy. The sync is bidirectional and three-way, preserving conflicting versions as copies, with server-side locking for multi-device safety, SHA-1 change checks to limit bandwidth, and atomic transfers against corruption. Bulk-delete and server-reset protections are also recorded.

```cue
plugin: {
    id:     "vault-bridge-sftp"
    name:   "Vault Bridge SFTP"
    author: "andrewkopylev"
    repo:   "andrewkopylev/vaultbridge"

    html_url:    "https://community.obsidian.md/plugins/vault-bridge-sftp"
    github_url:  "https://github.com/andrewkopylev/vaultbridge"
    description: "Bridge your vault across devices through your own SSH/SFTP server. Bidirectional sync with conflict resolution, multi-device safety, and full self-hosting. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault across desktops via your own SSH/SFTP server without cloud services or proxies. Use bidirectional 3-way sync with conflict-copy preservation, server-side locking for multi-device safety, SHA-1 change checks for bandwidth efficiency, bulk-delete and server-reset protections, and atomic transfers to avoid corruption."

    stats: {
        downloads:  427
        updated_at: 1777831859000
    }
}
```

[^template]: [[Obsidian plugin]]
