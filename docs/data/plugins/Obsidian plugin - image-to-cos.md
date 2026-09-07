---
uid: d5b27c8c-eba2-5165-95e9-eb20558dc89f
xid:
  - image-to-cos
aliases:
  - image-to-cos
  - Image to COS
  - mrelvin/obsidian-image-to-cos
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/image-to-cos
alt:
  - https://github.com/mrelvin/obsidian-image-to-cos
downloads: 21
updated at: "2026-08-06T16:37:54Z"
related to:
  - "[[GitHub - 1147645214]]"
remind me:
---

# Image to COS

Uploads every local image in the current document to cloud storage with one command and rewrites the links, in both Markdown and Obsidian wiki syntax. Tencent COS, Alibaba OSS, Qiniu, SM.MS and GitHub are supported as targets. Remote paths follow configurable templates, and duplicate uploads are detected by hashing image content.

```cue
plugin: {
    id:     "image-to-cos"
    name:   "Image to COS"
    author: "bozhang"
    repo:   "mrelvin/obsidian-image-to-cos"

    html_url:    "https://community.obsidian.md/plugins/image-to-cos"
    github_url:  "https://github.com/mrelvin/obsidian-image-to-cos"
    description: "Upload local images in Markdown to cloud storage (COS, OSS, Qiniu, SM.MS, GitHub) and replace links automatically. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Upload all local images in the current document with one command and automatically replace links in Markdown and Obsidian wiki syntax. Support multiple cloud providers (Tencent COS, Alibaba OSS, Qiniu, SM.MS, GitHub), flexible path templates, and duplicate detection via content hashing."

    stats: {
        downloads:  21
        updated_at: 1786034274000
    }
}
```

[^template]: [[Obsidian plugin]]
