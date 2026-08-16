---
uid: e9921ce7-302e-56f5-8c6e-16f366fc5cb1
xid:
  - image-classify-paste
aliases:
  - image-classify-paste
  - Image Classify Paste
  - ostoe/Ob-ImagePastePlugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/image-classify-paste
alt:
  - https://github.com/ostoe/Ob-ImagePastePlugin
downloads: 3914
updated at: "2024-01-25T16:29:59Z"
related to:
  - "[[GitHub - 704165463]]"
remind me:
---

# Image Classify Paste

Image Classify Paste saves pasted network or local images into a folder named after the current Markdown file and inserts them as standard Markdown links with a relative directory rather than Obsidian embeds. Existing Obsidian-style image links are converted in bulk, with the file-named folder created, the image files moved into it and the links rewritten.

```cue
plugin: {
    id:     "image-classify-paste"
    name:   "Image Classify Paste"
    author: "ostoe"
    repo:   "ostoe/Ob-ImagePastePlugin"

    html_url:    "https://community.obsidian.md/plugins/image-classify-paste"
    github_url:  "https://github.com/ostoe/Ob-ImagePastePlugin"
    description: "Paste your image like Typora, the image link name not ![[Paste xxx]] but ![some name](relative-directory/xxx.png) with a relative directory."
    about:       "Paste network or local images as standard Markdown links and save the images into a folder named after the current Markdown file. Convert Obsidian-style image links in bulk, auto-create the file-named folder, move image files there and update links to the new Markdown-compatible paths."

    stats: {
        downloads:  3914
        updated_at: 1706200199000
    }
}
```

[^template]: [[Obsidian plugin]]
