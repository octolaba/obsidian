---
uid: 70ebe71e-d39e-50d4-8232-91fa21712041
xid:
  - open-pdf-translate
aliases:
  - open-pdf-translate
  - OPEN PDF Translate
  - vetrenar/Open-PDF-Translate
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/open-pdf-translate
alt:
  - https://github.com/vetrenar/Open-PDF-Translate
downloads: 446
updated at: "2026-06-03T10:21:27Z"
related to:
  - "[[GitHub - 1125382506]]"
remind me:
---

# OPEN PDF Translate

OPEN PDF Translate extracts PDF text from the DOM text layer or through an external Python script using PyMuPDF, then sends it to OpenRouter, OpenAI, Gemini, Ollama or a custom endpoint. Translations are drawn as positioned overlays, and the text with its coordinates is stored per PDF in .translations.md files whose links are kept up to date. PDFs can also be exported with the translations embedded, which requires Python and PyMuPDF.

```cue
plugin: {
    id:     "open-pdf-translate"
    name:   "OPEN PDF Translate"
    author: "Vetrenar"
    repo:   "vetrenar/Open-PDF-Translate"

    html_url:    "https://community.obsidian.md/plugins/open-pdf-translate"
    github_url:  "https://github.com/vetrenar/Open-PDF-Translate"
    description: "Translate PDF documents with overlay, supports OpenRouter, OpenAI, Gemini, Ollama, and custom endpoints. Includes layout detection,  and persistent storage of translations.. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Extract PDF text via the DOM text layer or an external Python (PyMuPDF) script and send it to translation providers or custom endpoints. Display translations as positioned overlays, store text and coordinates in per‑PDF .translations.md files with auto‑updated links, and export PDFs with embedded translations (requires Python+PyMuPDF)."

    stats: {
        downloads:  446
        updated_at: 1780482087000
    }
}
```

[^template]: [[Obsidian plugin]]
