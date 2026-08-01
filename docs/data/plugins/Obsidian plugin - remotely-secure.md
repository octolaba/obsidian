---
uid: 1643adf7-43cb-59a7-b483-63066abc576a
xid:
  - remotely-secure
aliases:
  - remotely-secure
  - Remotely Sync
  - sboesen/remotely-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/remotely-secure
alt:
  - https://github.com/sboesen/remotely-sync
downloads: 65636
updated at: "2024-05-04T21:10:20Z"
related to:
  - "[[GitHub - 701918341]]"
remind me:
---

# Remotely Sync

Synchronizes notes between the local device and a cloud service, supporting S3 and S3-compatible storage, Dropbox, OneDrive, and WebDAV across desktop and mobile. Files are encrypted end-to-end with AES-256-GCM, syncs can be scheduled, and manual syncs run from the sidebar or the command palette. The index describes it as security fixes for the unofficial remotely-save plugin and states that it is not backwards compatible.

```cue
plugin: {
    id:     "remotely-secure"
    name:   "Remotely Sync"
    author: "sboesen"
    repo:   "sboesen/remotely-sync"

    html_url:    "https://community.obsidian.md/plugins/remotely-secure"
    github_url:  "https://github.com/sboesen/remotely-sync"
    description: "Security fixes for the remotely-save unofficial plugin allowing users to synchronize notes between local device and the cloud service. Not backwards compatible."
    about:       "Sync your Obsidian vault with cloud services (S3/S3-compatible, Dropbox, OneDrive, WebDAV) and keep desktop and mobile devices synchronized. Encrypt files end-to-end with AES-256-GCM, schedule automatic syncs, and trigger manual syncs from the sidebar or command palette."

    stats: {
        downloads:  65636
        updated_at: 1714857020000
    }
}
```

[^template]: [[Obsidian plugin]]
