---
uid: c9b281d1-bfdd-574d-83b6-8d4ca5594b82
xid:
  - image-attachment-upload
aliases:
  - image-attachment-upload
  - Image Attachment Upload
  - rocketbang/obsidian-image-attachment-upload
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/image-attachment-upload
alt:
  - https://github.com/rocketbang/obsidian-image-attachment-upload
downloads: 36
updated at: "2026-07-11T04:26:15Z"
related to:
  - "[[GitHub - 1296982782]]"
remind me:
---

# Image Attachment Upload

Image Attachment Upload picks an image from the device and uploads it to a Cloudflare R2 bucket, with signing done on the device on desktop and mobile. The uploaded file is inserted as an inline Markdown embed or set as the note's image frontmatter property, using path templates and short random suffixes to avoid collisions.

```cue
plugin: {
    id:     "image-attachment-upload"
    name:   "Image Attachment Upload"
    author: "rocketBANG"
    repo:   "rocketbang/obsidian-image-attachment-upload"

    html_url:    "https://community.obsidian.md/plugins/image-attachment-upload"
    github_url:  "https://github.com/rocketbang/obsidian-image-attachment-upload"
    description: "Pick an image, upload it to Cloudflare R2, and insert it inline or set it as the note's image property. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Pick an image from your device and upload it directly to a Cloudflare R2 bucket with on-device signing for desktop and mobile. Insert the uploaded file as an inline Markdown embed or set it as the note's image frontmatter property, using path templates and short random suffixes to avoid collisions."

    stats: {
        downloads:  36
        updated_at: 1783743975000
    }
}
```

[^template]: [[Obsidian plugin]]
