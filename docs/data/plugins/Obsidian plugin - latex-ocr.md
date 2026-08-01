---
uid: 68190f61-c5e0-58c7-b2fc-50eba0b972d8
xid:
  - latex-ocr
aliases:
  - latex-ocr
  - Latex OCR
  - lucasvanmol/obsidian-latex-ocr
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/latex-ocr
alt:
  - https://github.com/lucasvanmol/obsidian-latex-ocr
downloads: 13424
updated at: "2025-11-30T13:06:01Z"
related to:
  - "[[GitHub - 719111142]]"
remind me:
---

# Latex OCR

Latex OCR generates LaTeX equations from images and screenshots held in the vault or on the clipboard. Conversion runs through the HuggingFace Inference API or against a local OCR server and is reached from a Generate Latex context command; the recorded description states that local mode works reliably while the API has image-to-text issues.

```cue
plugin: {
    id:     "latex-ocr"
    name:   "Latex OCR"
    author: "lucasvanmol"
    repo:   "lucasvanmol/obsidian-latex-ocr"

    html_url:    "https://community.obsidian.md/plugins/latex-ocr"
    github_url:  "https://github.com/lucasvanmol/obsidian-latex-ocr"
    description: "Generate LaTeX equations from images in your vault or clipboard."
    about:       "Generate LaTeX equations from images and screenshots inside your vault. Paste LaTeX from the clipboard or convert vault images via a Generate Latex context command, using the HuggingFace Inference API or a local OCR server (local mode works reliably while the API has image-to-text issues)."

    stats: {
        downloads:  13424
        updated_at: 1764507961000
    }
}
```

[^template]: [[Obsidian plugin]]
