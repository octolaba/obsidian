---
uid: 5cff4712-5c2f-54a6-9e4d-8d9cd937d218
xid:
  - share-hosted
aliases:
  - share-hosted
  - Share Hosted
  - yut0takagi/obsidian-share-hosted
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/share-hosted
alt:
  - https://github.com/yut0takagi/obsidian-share-hosted
downloads: 80
updated at: "2026-05-30T15:37:16Z"
related to:
  - "[[GitHub - 1254396122]]"
remind me:
---

# Share Hosted

Share Hosted publishes notes to three audience modes: Org, an allowlist of specific people, or Public. Sign-in is by email and no Cloudflare setup is required; share links expire and can be copied or revoked. Content is stored on Cloudflare R2 and readers authenticate with a one-time email PIN, and the backend can optionally be self-hosted as a Cloudflare worker.

```cue
plugin: {
    id:     "share-hosted"
    name:   "Share Hosted"
    author: "Yuto Takagi"
    repo:   "yut0takagi/obsidian-share-hosted"

    html_url:    "https://community.obsidian.md/plugins/share-hosted"
    github_url:  "https://github.com/yut0takagi/obsidian-share-hosted"
    description: "Hosted alternative to org-share: sign in with email, share notes with org / allowlist / public audiences. No Cloudflare setup required. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Share notes with three audience modes: Org, Allowlist (specific people), or Public. Sign in with your email—no Cloudflare setup—and create expiring share links you can copy or revoke. Store content on Cloudflare R2 with reader access via one-time email PIN; optionally self-host the backend via a Cloudflare worker."

    stats: {
        downloads:  80
        updated_at: 1780155436000
    }
}
```

[^template]: [[Obsidian plugin]]
