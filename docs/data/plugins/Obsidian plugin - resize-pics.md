---
uid: 2b8c5cf3-018e-5009-b62a-af806d00a953
xid:
  - resize-pics
aliases:
  - resize-pics
  - quincy-leo/obsidian-resize-pics
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/resize-pics
alt:
  - https://github.com/quincy-leo/obsidian-resize-pics
downloads: 31
updated at: "2026-07-26T18:16:40Z"
related to:
  - "[[GitHub - 1312201645]]"
remind me:
---

# resize-pics

Measures the text height baked into a pasted or clipped image with Tesseract.js OCR and rewrites the image width in the Markdown so text inside the image matches the body font of the note. The Tesseract runtime is downloaded on demand and cached models are removed with one click. Note writes are atomic to avoid conflicts, and the interface is available in English and Chinese.

```cue
plugin: {
    id:     "resize-pics"
    name:   "resize-pics"
    author: "QuincyLeo"
    repo:   "quincy-leo/obsidian-resize-pics"

    html_url:    "https://community.obsidian.md/plugins/resize-pics"
    github_url:  "https://github.com/quincy-leo/obsidian-resize-pics"
    description: "Rescale images to matches the text font size. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Detect text height baked into pasted or clipped images using Tesseract.js OCR and rewrite the Markdown image width (![[...|W]] / ![alt|W](...)) so text inside images matches your note's body font. Download the Tesseract runtime on demand, perform atomic note writes to avoid conflicts, and provide English/Chinese UI with one-click cleanup for cached models."

    stats: {
        downloads:  31
        updated_at: 1785089800000
    }
}
```

[^template]: [[Obsidian plugin]]
