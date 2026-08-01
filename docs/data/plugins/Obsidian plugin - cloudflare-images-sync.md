---
uid: e061284e-3dae-55be-9961-7e406d60993c
xid:
  - cloudflare-images-sync
aliases:
  - cloudflare-images-sync
  - Cloudflare R2 Sync
  - imaikosuke/obsidian-cloudflare-r2-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloudflare-images-sync
alt:
  - https://github.com/imaikosuke/obsidian-cloudflare-r2-sync
downloads: 85
updated at: "2026-06-02T14:43:57Z"
related to:
  - "[[GitHub - 1221537291]]"
remind me:
---

# Cloudflare R2 Sync

Uploads images referenced by notes to Cloudflare R2, replaces the local links with public URLs and moves the uploaded files to the Obsidian trash. PNG, JPEG and BMP files can be converted to WebP at an adjustable quality before upload, and a cover image's public URL can be written into a frontmatter property. Images dropped into the editor upload at the cursor, and a failed upload falls back to a local attachment.

```cue
plugin: {
    id:     "cloudflare-images-sync"
    name:   "Cloudflare R2 Sync"
    author: "imaikosuke"
    repo:   "imaikosuke/obsidian-cloudflare-r2-sync"

    html_url:    "https://community.obsidian.md/plugins/cloudflare-images-sync"
    github_url:  "https://github.com/imaikosuke/obsidian-cloudflare-r2-sync"
    description: "Sync local note images to Cloudflare R2. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync local note images to Cloudflare R2, replace successfully uploaded links with public URLs, and move uploaded files to Obsidian trash. Convert PNG/JPEG/BMP to WebP before upload with adjustable quality, and upload cover images to write their public URL into a frontmatter property. Drop images into the editor to auto-upload at the cursor, and fall back to local attachments if an upload fails."

    stats: {
        downloads:  85
        updated_at: 1780411437000
    }
}
```

[^template]: [[Obsidian plugin]]
