---
uid: 04114fcd-e330-5d8d-92ec-e06d95879e25
xid:
  - obsidian-image-uploader
aliases:
  - obsidian-image-uploader
  - Image Uploader
  - creling/obsidian-image-uploader
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-image-uploader
alt:
  - https://github.com/creling/obsidian-image-uploader
downloads: 7793
updated at: "2023-10-20T09:39:14Z"
related to:
  - "[[GitHub - 386586589]]"
remind me:
---

# Image Uploader

Uploads an image from the clipboard to an image host automatically when it is pasted, optionally resizing it and scaling by aspect ratio. The API endpoint, the request headers and body, and the path to the image URL in the response are all configurable, so any hosting service can be targeted. A command uploads every local image on a page.

```cue
plugin: {
    id:     "obsidian-image-uploader"
    name:   "Image Uploader"
    author: "creling"
    repo:   "creling/obsidian-image-uploader"

    html_url:    "https://community.obsidian.md/plugins/obsidian-image-uploader"
    github_url:  "https://github.com/creling/obsidian-image-uploader"
    description: "Upload the image in your clipboard to any image hosting automatically when pasting."
    about:       "Upload images from the clipboard to any image host when pasting, with optional resize and automatic aspect-ratio scaling. Configure the API endpoint, request headers/body and response image-URL path to target any hosting service, and run a command to upload all local images on a page."

    stats: {
        downloads:  7793
        updated_at: 1697794754000
    }
}
```

[^template]: [[Obsidian plugin]]
