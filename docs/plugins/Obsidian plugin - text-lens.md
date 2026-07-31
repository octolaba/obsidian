---
uid: c2f8ed76-5745-5f00-8c0b-7e8e03f04cc5
xid:
  - text-lens
aliases:
  - text-lens
  - TextLens
  - nexround/obsidian-text-lens
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/text-lens
alt:
  - https://github.com/nexround/obsidian-text-lens
downloads: 110
updated at: "2026-07-09T08:28:03Z"
related to:
  - "[[GitHub - 1269854967]]"
remind me:
---

# TextLens

TextLens scans the active note for image references and inserts recognized text below each image, running PaddleOCR v6 through ONNX Runtime on the device with no server and no API key. Both Obsidian wikilinks and standard Markdown image syntax are recognized, Tiny, Small and Medium model tiers are offered, and existing OCR blocks are skipped or replaced. Output is written as collapsible callouts or fenced blocks and reverts with a single undo.

```cue
plugin: {
    id:     "text-lens"
    name:   "TextLens"
    author: "nexround"
    repo:   "nexround/obsidian-text-lens"

    html_url:    "https://community.obsidian.md/plugins/text-lens"
    github_url:  "https://github.com/nexround/obsidian-text-lens"
    description: "OCR images in the current note using on-device PaddleOCR via ONNX Runtime — no server, no API key. Recognized text is inserted inline below each image. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Scan the active note for image references and insert recognized text below each image using a fully on-device OCR engine (PaddleOCR v6 via ONNX Runtime). Support both Obsidian wikilinks and standard Markdown images, offer Tiny/Small/Medium model tiers, skip or replace existing OCR blocks, and output as collapsible callouts or fenced code blocks with a single undo."

    stats: {
        downloads:  110
        updated_at: 1783585683000
    }
}
```

[^template]: [[Obsidian plugin]]
