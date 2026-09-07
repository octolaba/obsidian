---
uid: 239ffe2d-8222-5cdf-8d1f-297e9cefd88e
xid:
  - image-uploader-for-note
aliases:
  - image-uploader-for-note
  - Image Uploader For Note
  - yy4382/obsidian-image-upload
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/image-uploader-for-note
alt:
  - https://github.com/yy4382/obsidian-image-upload
downloads: 539
updated at: "2025-08-19T08:39:06Z"
related to:
  - "[[GitHub - 877568635]]"
remind me:
---

# Image Uploader For Note

Uploads the local images used by the current note to S3 or to a custom JavaScript uploader and replaces the Markdown image links with the uploaded URLs. Local image files are then removed from the vault when that note is the only place referencing them.

```cue
plugin: {
    id:     "image-uploader-for-note"
    name:   "Image Uploader For Note"
    author: "yy4382"
    repo:   "yy4382/obsidian-image-upload"

    html_url:    "https://community.obsidian.md/plugins/image-uploader-for-note"
    github_url:  "https://github.com/yy4382/obsidian-image-upload"
    description: "Upload images in a note, and remove the images from the vault if they're exclusively used within that note."
    about:       "Upload local images in the current note to S3 or a custom JS uploader and replace Markdown image links with the uploaded URLs. Remove local image files from the vault when they are only referenced in that note to keep the vault clean."

    stats: {
        downloads:  539
        updated_at: 1755592746000
    }
}
```

[^template]: [[Obsidian plugin]]
