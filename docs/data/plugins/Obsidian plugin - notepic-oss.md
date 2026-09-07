---
uid: 23f77212-2ef8-5691-81e1-302b486f75c3
xid:
  - notepic-oss
aliases:
  - notepic-oss
  - NotePic OSS
  - luhui-dev/NotePic-OSS-Obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/notepic-oss
alt:
  - https://github.com/luhui-dev/NotePic-OSS-Obsidian
downloads: 97
updated at: "2026-06-11T14:59:58Z"
related to:
  - "[[GitHub - 1260347923]]"
remind me:
---

# NotePic OSS

Scans the images referenced by the current note, uploads them to Aliyun OSS after compressing and deduplicating them, and rewrites the links in place to their public URLs. An image manager previews thumbnails and allows filtering and selecting which images to upload, and references that have changed are skipped during an upload so they are not overwritten.

```cue
plugin: {
    id:     "notepic-oss"
    name:   "NotePic OSS"
    author: "Luhui Dev"
    repo:   "luhui-dev/NotePic-OSS-Obsidian"

    html_url:    "https://community.obsidian.md/plugins/notepic-oss"
    github_url:  "https://github.com/luhui-dev/NotePic-OSS-Obsidian"
    description: "Upload images referenced in the current note to Aliyun OSS, compress them first, and rewrite the links in place. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Scan and upload images referenced in the current note to Aliyun OSS, compress and deduplicate files, and rewrite links to public URLs. Open the image manager to preview thumbnails, filter and select images for upload, and skip changed references during uploads to avoid overwriting."

    stats: {
        downloads:  97
        updated_at: 1781189998000
    }
}
```

[^template]: [[Obsidian plugin]]
