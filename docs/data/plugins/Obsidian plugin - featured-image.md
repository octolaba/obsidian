---
uid: 5f4a04d6-cbd9-59d8-9a59-18cad9498535
xid:
  - featured-image
aliases:
  - featured-image
  - Featured Image
  - johansan/obsidian-featured-image
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/featured-image
alt:
  - https://github.com/johansan/obsidian-featured-image
downloads: 39509
updated at: "2026-07-13T10:48:08Z"
related to:
  - "[[GitHub - 850570039]]"
remind me:
---

# Featured Image

Featured Image sets a note's featured image property by finding its first local image, external URL, YouTube link or Auto Card Link and writing that path into frontmatter for other plugins to read. External images can be downloaded locally, and optimized thumbnails of 128 by 128 pixels are stored separately to speed browsing and cut memory use. Whole vaults or selected folders are processed in bulk, and unused downloads are cleaned up.

```cue
plugin: {
    id:     "featured-image"
    name:   "Featured Image"
    author: "Johan Sanneblad"
    repo:   "johansan/obsidian-featured-image"

    html_url:    "https://community.obsidian.md/plugins/featured-image"
    github_url:  "https://github.com/johansan/obsidian-featured-image"
    description: "Automatically set a featured image property in your notes based on the first image."
    about:       "Detect and set thumbnail images for notes by finding the first local image, external URL, YouTube link, or Auto Card Link and save its path to frontmatter for use by other plugins. Download external images locally and create optimized 128×128 thumbnails stored separately to speed browsing and cut memory use. Process entire vaults or selected folders in bulk and clean up unused downloads."

    stats: {
        downloads:  39509
        updated_at: 1783939688000
    }
}
```

[^template]: [[Obsidian plugin]]
