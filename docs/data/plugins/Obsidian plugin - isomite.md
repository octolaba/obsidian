---
uid: 046df933-cad6-546d-a0a7-0cbc3932b2fb
xid:
  - isomite
aliases:
  - isomite
  - Isomite
  - ratatulieoi/obsidian-isomite
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/isomite
alt:
  - https://github.com/ratatulieoi/obsidian-isomite
downloads:
updated at:
related to:
  - "[[GitHub - 1330983972]]"
remind me:
---

# Isomite

Connects a vault to a private Cloudflare R2 bucket over an S3 API endpoint, without a VPS, Worker or custom sync server. Bucket-scoped credentials are stored locally, and a signed read-only object listing verifies connectivity. Synchronization itself is not implemented yet.

```cue
plugin: {
    id:     "isomite"
    name:   "Isomite"
    author: "glam"
    repo:   "ratatulieoi/obsidian-isomite"

    html_url:    "https://community.obsidian.md/plugins/isomite"
    github_url:  "https://github.com/ratatulieoi/obsidian-isomite"
    description: "Connect your vault to a private Cloudflare R2 bucket for controlled synchronization. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect Obsidian directly to a private Cloudflare R2 bucket without using a VPS, Worker, or custom sync server. Set up an S3 API endpoint, store bucket-scoped credentials locally, and run a signed read-only object-listing test to verify connectivity; synchronization is not implemented yet."
}
```

[^template]: [[Obsidian plugin]]
