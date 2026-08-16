---
uid: 0c3e9c7f-7968-5d36-8059-7c16798fc3b7
xid:
  - byoc
aliases:
  - byoc
  - Bring Your Own Cloud
  - winters27/obsidian-byoc
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/byoc
alt:
  - https://github.com/winters27/obsidian-byoc
downloads: 1463
updated at: "2026-08-06T14:48:38Z"
related to:
  - "[[GitHub - 1213881909]]"
remind me:
---

# Bring Your Own Cloud

Bring Your Own Cloud syncs the vault to self-hosted cloud storage through an engine supporting S3, WebDAV, Dropbox, OneDrive, Google Drive, Box, pCloud, Yandex, Koofr, Azure Blob and Webdis. Conflicts are resolved by a three-way merge that writes timestamped conflict copies, and syncing runs on a timer or on save. The recorded inputs state that data can be encrypted end-to-end with AES-256 in rclone-crypt form and that cloud credentials stay local.

```cue
plugin: {
    id:     "byoc"
    name:   "Bring Your Own Cloud"
    author: "winters27"
    repo:   "winters27/obsidian-byoc"

    html_url:    "https://community.obsidian.md/plugins/byoc"
    github_url:  "https://github.com/winters27/obsidian-byoc"
    description: "A native cloud and device synchronization tool. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault to self-hosted cloud storage with a robust engine supporting S3, WebDAV, Dropbox, OneDrive, Google Drive, Box, pCloud, Yandex, Koofr, Azure Blob and Webdis. Resolve conflicts with a 3-way merge that creates timestamped conflict copies and run timed background sync or sync-on-save. Encrypt data end-to-end with optional AES-256 (rclone-crypt) and keep cloud credentials local."

    stats: {
        downloads:  1463
        updated_at: 1786027718000
    }
}
```

[^template]: [[Obsidian plugin]]
