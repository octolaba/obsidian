---
uid: d9e6f61a-beff-597b-bcdb-785e86c95530
xid:
  - pdf-font-rewriter
aliases:
  - pdf-font-rewriter
  - PDF Font Rewriter
  - alexandert142/pdf-font-rewriter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pdf-font-rewriter
alt:
  - https://github.com/alexandert142/pdf-font-rewriter
downloads: 162
updated at: "2026-06-10T10:19:57Z"
related to:
  - "[[GitHub - 1237570180]]"
remind me:
---

# PDF Font Rewriter

Opens a PDF in a live refont view that redraws text in a chosen built-in or custom font while scrolling, leaving the original file unchanged: pages are rendered with PDF.js, a local helper returns safe page plans, approved original text pixels are patched, and replacement text is drawn. Export writes a separate rewritten PDF or replaces the same path after a restore copy is saved outside the vault, and its default scope is the visible sheet and nearby sheets. The recorded description states that image-only scans, rotated text, unsupported scripts, unsafe geometry and suspicious text layers are retained rather than guessed, that processing is local on desktop Obsidian, and that a verified helper binary is downloaded from GitHub Releases while audit reports are stored locally.

```cue
plugin: {
    id:     "pdf-font-rewriter"
    name:   "PDF Font Rewriter"
    author: "Tianchen Hao"
    repo:   "alexandert142/pdf-font-rewriter"

    html_url:    "https://community.obsidian.md/plugins/pdf-font-rewriter"
    github_url:  "https://github.com/alexandert142/pdf-font-rewriter"
    description: "Live-refont PDFs as you scroll, or export safely rewritten pages in a chosen font with local processing and backups. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open a PDF in Live Refont View to see readable text refonted as you scroll. The original PDF stays unchanged while the plugin renders pages with PDF.js, asks a local helper for safe page plans, patches approved original text pixels, and draws replacement text in your selected built-in or custom font. For export, PDF Font Rewriter can create a separate rewritten PDF or replace the same file path after saving a restore copy outside the vault. The default export scope targets the visible sheet and nearby sheets so you can work through a book in small chunks. It works best on normal PDFs and searchable scanned PDFs. Image-only scans, rotated text, unsupported scripts, unsafe geometry, or suspicious text layers are retained instead of guessed. All processing is local on desktop Obsidian. The plugin downloads a verified helper binary from GitHub Releases and stores audit reports locally."

    stats: {
        downloads:  162
        updated_at: 1781086797000
    }
}
```

[^template]: [[Obsidian plugin]]
