---
uid: 831f6d2e-e6d0-542e-9679-9375e01c98cc
xid:
  - watermark-bucket-uploader
aliases:
  - watermark-bucket-uploader
  - Watermark Bucket Uploader
  - firstsun-dev/watermark-bucket-uploader
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/watermark-bucket-uploader
alt:
  - https://github.com/firstsun-dev/watermark-bucket-uploader
downloads: 85
updated at: "2026-06-16T13:20:44Z"
related to:
  - "[[GitHub - 1195129320]]"
remind me:
---

# Watermark Bucket Uploader

Intercepts image paste and drop events, applies a canvas-based text or logo watermark with a live preview, converts the image to WebP and compresses it. The result is uploaded to Cloudflare R2 or any other S3-compatible storage and inserted into the note as a Markdown image link. Files can optionally also be kept locally, and videos, audio and PDFs can be uploaded as well.

```cue
plugin: {
    id:     "watermark-bucket-uploader"
    name:   "Watermark Bucket Uploader"
    author: "ClaudiaFang"
    repo:   "firstsun-dev/watermark-bucket-uploader"

    html_url:    "https://community.obsidian.md/plugins/watermark-bucket-uploader"
    github_url:  "https://github.com/firstsun-dev/watermark-bucket-uploader"
    description: "Upload images to any S3-compatible storage. Features: WebP conversion, image compression, text & logo watermark with live preview. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Intercept image paste and drop events, apply canvas-based text or logo watermarks, convert to WebP and compress images, then upload to Cloudflare R2 or any S3-compatible storage. Insert the resulting URL as a Markdown image link, preview watermarks live, and optionally save files locally or upload videos, audio and PDFs."

    stats: {
        downloads:  85
        updated_at: 1781616044000
    }
}
```

[^template]: [[Obsidian plugin]]
