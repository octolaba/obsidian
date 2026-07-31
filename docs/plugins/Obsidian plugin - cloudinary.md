---
uid: 05bd255a-ba9c-5c09-a174-4e314c20c880
xid:
  - cloudinary
aliases:
  - cloudinary
  - Cloudinary
  - uday-samsani/obsidian-cloudinary
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloudinary
alt:
  - https://github.com/uday-samsani/obsidian-cloudinary
downloads: 4036
updated at: "2023-07-07T09:37:40Z"
related to:
  - "[[GitHub - 647378502]]"
remind me:
---

# Cloudinary

Uploads images, audio and video that are pasted or dragged into a note to Cloudinary and replaces the local embed with the resulting URL. Default transformations, or ones set per media type or folder, are expressed as Cloudinary URL parameters to cut local storage and speed up rendering. Uploads are unsigned, so no API secret is stored.

```cue
plugin: {
    id:     "cloudinary"
    name:   "Cloudinary"
    author: "uday-samsani"
    repo:   "uday-samsani/obsidian-cloudinary"

    html_url:    "https://community.obsidian.md/plugins/cloudinary"
    github_url:  "https://github.com/uday-samsani/obsidian-cloudinary"
    description: "Upload content (images, videos, audio) to Cloudinary and insert (copy or drag both) them into your notes."
    about:       "Upload pasted or dragged images, audio, and video to Cloudinary and replace local embeds with web-friendly Cloudinary URLs. Apply default or per-type/folder transformations via Cloudinary URL parameters to cut local storage and speed note rendering. Use unsigned uploads without storing an API secret."

    stats: {
        downloads:  4036
        updated_at: 1688722660000
    }
}
```

[^template]: [[Obsidian plugin]]
