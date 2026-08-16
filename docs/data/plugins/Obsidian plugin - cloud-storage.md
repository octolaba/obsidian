---
uid: b2f5284f-3712-5353-8f92-c6f3278c4634
xid:
  - cloud-storage
aliases:
  - cloud-storage
  - Cloud Storage
  - yingjialong/obsidian-CloudStorage
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloud-storage
alt:
  - https://github.com/yingjialong/obsidian-CloudStorage
downloads: 2375
updated at: "2026-02-19T06:42:12Z"
related to:
  - "[[GitHub - 856815193]]"
remind me:
---

# Cloud Storage

Uploads attachments from designated folders to cloud storage and rewrites the note links to the uploaded copies, so the local vault carries less and several devices see the same files. Transfers can resume, storage is either S3 or the plugin's own, and uploads are governed by extension whitelists, size limits, renaming rules and a choice of moving or deleting the local file.

```cue
plugin: {
    id:     "cloud-storage"
    name:   "Cloud Storage"
    author: "yingjialong"
    repo:   "yingjialong/obsidian-CloudStorage"

    html_url:    "https://community.obsidian.md/plugins/cloud-storage"
    github_url:  "https://github.com/yingjialong/obsidian-CloudStorage"
    description: "Allows users to upload local files to the cloud, reducing the burden on local vaults and enabling seamless synchronization across multiple devices."
    about:       "Upload attachments from specified folders to cloud storage and free local space. Update note links to point to cloud files, enable resumable transfers, use S3 or plugin storage, and manage uploads with extension whitelists, size limits, renaming, and local move/delete."

    stats: {
        downloads:  2375
        updated_at: 1771483332000
    }
}
```

[^template]: [[Obsidian plugin]]
