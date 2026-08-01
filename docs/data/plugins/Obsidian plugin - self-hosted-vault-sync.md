---
uid: 5cf1300a-8e6f-5a4b-ac8c-7026433bf72a
xid:
  - self-hosted-vault-sync
aliases:
  - self-hosted-vault-sync
  - Self-Hosted Vault Sync
  - peoneer/self-hosted-vault-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/self-hosted-vault-sync
alt:
  - https://github.com/peoneer/self-hosted-vault-sync
downloads: 33
updated at: "2026-07-08T11:46:45Z"
related to:
  - "[[GitHub - 1292243513]]"
remind me:
---

# Self-Hosted Vault Sync

Self-Hosted Vault Sync keeps a vault synced across devices through a server you host yourself, avoiding vendor lock-in. Edits are pushed on change, a pull runs at startup and updates are polled for, with Server-Sent Events providing real-time updates on desktop, and only changed files are transferred. Conflicts are saved as timestamped .conflict files, and glob exclude patterns are respected.

```cue
plugin: {
    id:     "self-hosted-vault-sync"
    name:   "Self-Hosted Vault Sync"
    author: "Valentin Britvich"
    repo:   "peoneer/self-hosted-vault-sync"

    html_url:    "https://community.obsidian.md/plugins/self-hosted-vault-sync"
    github_url:  "https://github.com/peoneer/self-hosted-vault-sync"
    description: "Fast, reliable vault sync via a self-hosted server - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault via a self-hosted server to keep files synced across devices without vendor lock-in. Push edits on change, pull on startup and poll for updates, use Server-Sent Events for real-time desktop updates, sync only changed files, and save conflicts as .conflict.<timestamp> while respecting glob exclude patterns."

    stats: {
        downloads:  33
        updated_at: 1783511205000
    }
}
```

[^template]: [[Obsidian plugin]]
