---
uid: 3b5b15c9-4dc8-584a-8294-3feb4d75718a
xid:
  - mergdowntotex
aliases:
  - mergdowntotex
  - dvrch/mergdown2tex
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mergdowntotex
alt:
  - https://github.com/dvrch/mergdown2tex
downloads: 89
updated at: "2026-07-06T09:01:53Z"
related to:
  - "[[GitHub - 1289922356]]"
remind me:
---

# mergdowntotex

Converts notes into LaTeX, expanding wikilinks, embeds, images, citations, math, tables and Mermaid diagrams into a single .tex file. Conversion runs in a Rust and WebAssembly engine inside Obsidian, which the recorded description states needs no build step. The result compiles to PDF through TeX Live and Podman, or to DOCX through Pandoc with citation and bibliography support; Zotero is named as the citation source.

```cue
plugin: {
    id:     "mergdowntotex"
    name:   "mergdowntotex"
    author: "DJONTSO V. dvrchipro@gmail.com"
    repo:   "dvrch/mergdown2tex"

    html_url:    "https://community.obsidian.md/plugins/mergdowntotex"
    github_url:  "https://github.com/dvrch/mergdown2tex"
    description: "Merge & doc. export everything — embeds, Zotero/Pandoc citations, Mermaid, equations, cross-refs — into a unique .tex file. Compile to PDF, DOCX, or InDesign. WASM engine, zero build step. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert Obsidian notes into publication-ready LaTeX, PDF, DOCX or .tex with automatic expansion of wikilinks, embeds, images, citations zotero inegration and pandoc, math, table and Mermaid diagrams. Run a Rust/WASM engine inside Obsidian for Markdown→LaTeX conversion and compile to PDF (TeX Live + Podman) or DOCX (Pandoc++, citep & biblio)."

    stats: {
        downloads:  89
        updated_at: 1783328513000
    }
}
```

[^template]: [[Obsidian plugin]]
