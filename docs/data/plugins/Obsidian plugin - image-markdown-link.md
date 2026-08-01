---
uid: 4fe03846-4855-5c3c-b5f6-5597d3128a55
xid:
  - image-markdown-link
aliases:
  - image-markdown-link
  - Image Markdown Link
  - ariayd/obsidian-image-markdown-link
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/image-markdown-link
alt:
  - https://github.com/ariayd/obsidian-image-markdown-link
downloads: 175
updated at: "2026-03-07T10:27:58Z"
related to:
  - "[[GitHub - 1175129227]]"
remind me:
---

# Image Markdown Link

Converts pasted Obsidian image links, whether wiki embeds, wiki links or Markdown links to a file, into standard Markdown image syntax pointing at raw.githubusercontent.com so the image renders outside Obsidian. Nested attachment folders and the png, jpg, jpeg, gif, webp, bmp, svg and avif formats are handled, and wiki links that are not images are left untouched.

```cue
plugin: {
    id:     "image-markdown-link"
    name:   "Image Markdown Link"
    author: "ariayd"
    repo:   "ariayd/obsidian-image-markdown-link"

    html_url:    "https://community.obsidian.md/plugins/image-markdown-link"
    github_url:  "https://github.com/ariayd/obsidian-image-markdown-link"
    description: "Paste images using standard Markdown syntax ![]() instead of WikiLink format ![[]], [[]], or [](). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert pasted Obsidian image links (e.g., ![[file.png]], [[path/file.png]], [](file.png)) into standard Markdown image syntax that points to raw.githubusercontent.com for outside-Obsidian rendering. Handle nested attachment folders and common image formats (png, jpg, jpeg, gif, webp, bmp, svg, avif) while leaving non-image wiki links untouched."

    stats: {
        downloads:  175
        updated_at: 1772879278000
    }
}
```

[^template]: [[Obsidian plugin]]
