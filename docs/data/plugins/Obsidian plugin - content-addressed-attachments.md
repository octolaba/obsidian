---
uid: ccd256ab-ba2c-554a-8de1-eff81c865c24
xid:
  - content-addressed-attachments
aliases:
  - content-addressed-attachments
  - Content-Addressed Attachments
  - natescarlet/obsidian-content-addressed-attachments
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/content-addressed-attachments
alt:
  - https://github.com/natescarlet/obsidian-content-addressed-attachments
downloads: 394
updated at: "2026-06-26T10:45:03Z"
related to:
  - "[[GitHub - 1095505164]]"
remind me:
---

# Content-Addressed Attachments

This plugin stores attachments by content address, deriving a CID for each file so identical attachments are deduplicated automatically. It generates and resolves ipfs:// links and can lock external images into the vault as checksum-verified cached copies for offline access. Everything works locally, with configurable external gateways and optional hosting in private GitHub repositories.

```cue
plugin: {
    id:     "content-addressed-attachments"
    name:   "Content-Addressed Attachments"
    author: "natescarlet"
    repo:   "natescarlet/obsidian-content-addressed-attachments"

    html_url:    "https://community.obsidian.md/plugins/content-addressed-attachments"
    github_url:  "https://github.com/natescarlet/obsidian-content-addressed-attachments"
    description: "Content-addressed attachment storage for automatic deduplication. Works entirely locally; optionally uses GitHub private repositories for hosting."
    about:       "Store attachments as content-addressed CIDs with automatic deduplication. Generate and resolve ipfs:// links, lock external images into the vault with checksum-verified cached copies for offline access, and fall back to configurable external gateways."

    stats: {
        downloads:  394
        updated_at: 1782470703000
    }
}
```

[^template]: [[Obsidian plugin]]
