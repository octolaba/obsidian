---
uid: 9ababfab-e3cd-5192-a1cc-9d9eacc50c03
xid:
  - secure-git-sync
aliases:
  - secure-git-sync
  - Secure Git Sync
  - vinci0007/obsidian-EncryptSecure-GitSync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/secure-git-sync
alt:
  - https://github.com/vinci0007/obsidian-EncryptSecure-GitSync
downloads: 104
updated at: "2026-07-07T06:45:48Z"
related to:
  - "[[GitHub - 1288185582]]"
remind me:
---

# Secure Git Sync

Secure Git Sync encrypts the remote note snapshots it pushes with AES-256-GCM, while local vault files and local Git history stay in plaintext. Push, pull and sync each require the administrator password to be confirmed first, and several remotes, among them GitHub, GitLab, Gitee and self-hosted servers, are managed from an Obsidian ribbon.

```cue
plugin: {
    id:     "secure-git-sync"
    name:   "Secure Git Sync"
    author: ""
    repo:   "vinci0007/obsidian-EncryptSecure-GitSync"

    html_url:    "https://community.obsidian.md/plugins/secure-git-sync"
    github_url:  "https://github.com/vinci0007/obsidian-EncryptSecure-GitSync"
    description: "Password-confirmed Git sync with optional encrypted remote note snapshots. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt remote Git snapshots with AES-256-GCM while keeping local vault files and local Git history plaintext. Require the administrator password before push, pull, or sync and manage multiple Git remotes (GitHub, GitLab, Gitee, or self‑hosted) from an Obsidian ribbon."

    stats: {
        downloads:  104
        updated_at: 1783406748000
    }
}
```

[^template]: [[Obsidian plugin]]
