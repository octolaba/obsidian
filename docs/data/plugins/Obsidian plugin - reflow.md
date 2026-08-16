---
uid: 7098063c-7c62-5349-a3b2-1849b7627104
xid:
  - reflow
aliases:
  - reflow
  - Reflow
  - ampdat/reflow
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/reflow
alt:
  - https://github.com/ampdat/reflow
downloads: 84
updated at: "2026-08-03T21:37:03Z"
related to:
  - "[[GitHub - 1311497319]]"
remind me:
---

# Reflow

Converts PDFs to Markdown on the device, running IBM's granite-docling document vision model locally through ONNX Runtime and WebGPU. Because the model reads the page as a layout rather than a text layer, reading order survives: two-column papers come out as one column, headings become an outline, tables stay tables, figures are extracted alongside the note, and equations return as LaTeX. The first conversion downloads and caches the roughly 1 GB model, after which it works offline, and machines without WebGPU fall back to the CPU. Notes can also be exported to EPUB and sent to a Kindle.

```cue
plugin: {
    id:     "reflow"
    name:   "Reflow"
    author: "Ampdat"
    repo:   "ampdat/reflow"

    html_url:    "https://community.obsidian.md/plugins/reflow"
    github_url:  "https://github.com/ampdat/reflow"
    description: "Convert a PDF into clean, readable Markdown entirely on your device. Figures, tables, and math survive. No API key, no upload, no page limit. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Most PDF-to-Markdown tools ask you to choose: hand your document to a cloud API, or accept naive text extraction that scrambles two-column papers and loses the equations. Reflow does neither. It runs granite-docling — IBM's 258M-parameter document vision model, Apache-2.0 locally on your GPU, through ONNX Runtime and WebGPU inside Obsidian. Because the model reads the page as a layout rather than scraping a text layer, reading order survives: a two-column paper becomes one clean column, headings become a real outline, tables stay tables, figures are extracted alongside the note, and equations come back as LaTeX. The first conversion downloads the model (~1 GB) and caches it; after that it runs offline. Machines without WebGPU fall back to the CPU. Also included is a export to EPUB and Send To Kindle integration so you can easily read it on your e-reader."

    stats: {
        downloads:  84
        updated_at: 1785793023000
    }
}
```

[^template]: [[Obsidian plugin]]
