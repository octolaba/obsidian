---
uid: 3e0c190f-1927-5239-ad2e-7a38f494112f
xid:
  - pds-sync
aliases:
  - pds-sync
  - PDS Sync
  - moshyfawn/obsidian-pds-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pds-sync
alt:
  - https://github.com/moshyfawn/obsidian-pds-sync
downloads: 81
updated at: "2026-06-11T22:10:44Z"
related to:
  - "[[GitHub - 1265617200]]"
remind me:
---

# PDS Sync

Syncs the vault to an atproto Personal Data Server, either as private encrypted records or as publishable public documents. Private notes are encrypted client-side with Argon2id and AES-256-GCM and synchronized in both directions with compare-and-swap conflict handling, orphan deletion and restore. Flagged notes are published as public documents, authentication uses OAuth or an app password, and auto-sync runs with a status-bar indicator and mobile support.

```cue
plugin: {
    id:     "pds-sync"
    name:   "PDS Sync"
    author: "moshyfawn"
    repo:   "moshyfawn/obsidian-pds-sync"

    html_url:    "https://community.obsidian.md/plugins/pds-sync"
    github_url:  "https://github.com/moshyfawn/obsidian-pds-sync"
    description: "Sync your vault to an atproto PDS - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault to an atproto Personal Data Server (PDS), choosing private encrypted records or publishable public documents. Encrypt private notes client-side (Argon2id + AES-256-GCM) and perform two-way push/pull with compare-and-swap conflict handling, orphan deletion, and restore. Publish flagged notes as site.standard.document for public readers, use OAuth or app password for authentication, and run auto-sync with a status-bar indicator and mobile support."

    stats: {
        downloads:  81
        updated_at: 1781215844000
    }
}
```

[^template]: [[Obsidian plugin]]
