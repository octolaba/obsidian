---
uid: 4f064110-941a-5cd6-9415-e17641da21e0
xid:
  - ezimage
aliases:
  - ezimage
  - EzImage
  - keepwonder/ezimage-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ezimage
alt:
  - https://github.com/keepwonder/ezimage-obsidian
downloads: 293
updated at: "2026-07-10T01:36:46Z"
related to:
  - "[[GitHub - 1246490561]]"
remind me:
---

# EzImage

EzImage uploads images pasted or dragged into a note to cloud storage and inserts a Markdown image link instead of saving a local file. Images are converted and compressed to WebP before upload, and Cloudflare R2 and S3 storage are supported. Uploads are signed locally, so the credentials do not leave the machine.

```cue
plugin: {
    id:     "ezimage"
    name:   "EzImage"
    author: "Kiang"
    repo:   "keepwonder/ezimage-obsidian"

    html_url:    "https://community.obsidian.md/plugins/ezimage"
    github_url:  "https://github.com/keepwonder/ezimage-obsidian"
    description: "Upload images to cloud storage (R2/S3) with automatic compression. Paste or drag images to get a Markdown link instantly. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Paste or drag images into notes to upload them to cloud storage and insert a Markdown image link instead of saving local files. Convert and compress images to WebP before upload, support Cloudflare R2, and sign uploads locally so credentials never leave your machine."

    stats: {
        downloads:  293
        updated_at: 1783647406000
    }
}
```

[^template]: [[Obsidian plugin]]
