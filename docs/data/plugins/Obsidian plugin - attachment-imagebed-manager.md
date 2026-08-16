---
uid: 606b6e7c-92d0-5646-8754-759036f9a880
xid:
  - attachment-imagebed-manager
aliases:
  - attachment-imagebed-manager
  - Attachment Imagebed Manager
  - perinchiang/obsidian-plugins-attachment-imagebed-manager
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/attachment-imagebed-manager
alt:
  - https://github.com/perinchiang/obsidian-plugins-attachment-imagebed-manager
downloads: 142
updated at: "2026-08-04T09:23:41Z"
related to:
  - "[[GitHub - 1263977400]]"
remind me:
---

# Attachment Imagebed Manager

Uploads local note attachments to S3-compatible storage such as Cloudflare R2, AWS S3 or MinIO and replaces the local links with the remote URLs. Attachments are browsed by type in list or gallery views, custom file types can be added, changes previewed in a dry-run mode, and local files optionally deleted after upload. Notes are written atomically with automatic rollback when an upload fails.

```cue
plugin: {
    id:     "attachment-imagebed-manager"
    name:   "Attachment Imagebed Manager"
    author: "Patrick"
    repo:   "perinchiang/obsidian-plugins-attachment-imagebed-manager"

    html_url:    "https://community.obsidian.md/plugins/attachment-imagebed-manager"
    github_url:  "https://github.com/perinchiang/obsidian-plugins-attachment-imagebed-manager"
    description: "Scan local note attachments, upload to S3-compatible storage (R2/AWS S3/MinIO), and replace links safely. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Upload attachments to S3-compatible clouds (Cloudflare R2, AWS S3, MinIO) and replace local links in notes with remote URLs. Browse attachments by type in list or gallery views, add custom file types, preview changes in dry-run mode, and optionally delete local files after upload. Preserve note integrity with atomic writes and automatic rollback on failed uploads."

    stats: {
        downloads:  142
        updated_at: 1785835421000
    }
}
```

[^template]: [[Obsidian plugin]]
