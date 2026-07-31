---
uid: 9a25728e-3a63-5eb1-be1b-43fc2de6ed18
xid:
  - docdrop
aliases:
  - docdrop
  - DocDrop
  - flatulentfowl/docdrop
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/docdrop
alt:
  - https://github.com/flatulentfowl/docdrop
downloads: 515
updated at: "2026-05-12T21:48:24Z"
related to:
  - "[[GitHub - 1228167201]]"
remind me:
---

# DocDrop

Converts documents, spreadsheets, images and other files in the vault into Markdown through Microsoft's MarkItDown command-line tool. Conversion runs on the local machine by default, with optional cloud AI for enhanced OCR. Supported inputs include PDF and Word, PowerPoint, Excel, common image formats, HTML, CSV, JSON, XML, EPUB and ZIP, plus MP3 and WAV through ffmpeg. Right-clicking a supported file in the file explorer and choosing the conversion command writes a new Markdown file into the same folder.

```cue
plugin: {
    id:     "docdrop"
    name:   "DocDrop"
    author: "Rhys Gottwald"
    repo:   "flatulentfowl/docdrop"

    html_url:    "https://community.obsidian.md/plugins/docdrop"
    github_url:  "https://github.com/flatulentfowl/docdrop"
    description: "DocDrop is an Obsidian plugin that converts documents, spreadsheets, images, and more into clean, usable Markdown files directly within your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "DocDrop is an Obsidian plugin that converts documents, spreadsheets, images, and more into clean, usable Markdown files directly within your vault. Powered by Microsoft's MarkItDown CLI, it processes files entirely on your machine (with optional cloud AI support for enhanced OCR) — giving you control, speed, and privacy. Right-click any supported file in your vault and have it converted to Markdown in seconds. No cloud dependency required by default, no complex workflows — just convert and go. Supported File Types DocDrop handles a wide variety of formats: Documents: PDF, Word Presentations: PowerPoint Spreadsheets: Excel Images: JPEG, PNG, GIF, WebP, BMP, TIFF Markup & Data: HTML, CSV, JSON, XML, EPUB, ZIP Audio: MP3, WAV (via ffmpeg) How to Use DocDrop Right-Click Context Menu In the Obsidian file explorer, right-click a supported file (e.g., a PDF) Select \"Convert to Markdown with DocDrop\" Wait for the conversion to complete A new .md file appears in the same folder"

    stats: {
        downloads:  515
        updated_at: 1778622504000
    }
}
```

[^template]: [[Obsidian plugin]]
