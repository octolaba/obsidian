---
uid: 77e961d3-dd88-53f8-980b-6fd9aec6fa11
xid:
  - obsidian-basetag
aliases:
  - obsidian-basetag
  - Base Tag Renderer
  - darrenkuro/obsidian-basetag
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-basetag
alt:
  - https://github.com/darrenkuro/obsidian-basetag
downloads: 7226
updated at: "2023-10-04T18:10:35Z"
related to:
  - "[[GitHub - 577258203]]"
remind me:
---

# Base Tag Renderer

Base Tag Renderer renders only the basename of a nested tag while the full nested structure is preserved elsewhere. Tag elements gain a basename-tag CSS class so basenames can be styled differently, and this applies in editor mode, in front matter and in properties.

```cue
plugin: {
    id:     "obsidian-basetag"
    name:   "Base Tag Renderer"
    author: "darrenkuro"
    repo:   "darrenkuro/obsidian-basetag"

    html_url:    "https://community.obsidian.md/plugins/obsidian-basetag"
    github_url:  "https://github.com/darrenkuro/obsidian-basetag"
    description: "Render the basename of tags in preview mode."
    about:       "Render only the basename of nested tags while preserving the full nested structure elsewhere. Add a basename-tag CSS class to tag elements so you can style basenames differently; works in editor mode, frontmatter, and properties."

    stats: {
        downloads:  7226
        updated_at: 1696443035000
    }
}
```

[^template]: [[Obsidian plugin]]
