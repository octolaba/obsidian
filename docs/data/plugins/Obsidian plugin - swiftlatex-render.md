---
uid: fa86a83e-a8c2-5930-bacb-599ac30568be
xid:
  - swiftlatex-render
aliases:
  - swiftlatex-render
  - SwiftLaTeX Render
  - gboyd068/obsidian-swiftlatex-render
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/swiftlatex-render
alt:
  - https://github.com/gboyd068/obsidian-swiftlatex-render
downloads: 5410
updated at: "2026-06-27T15:17:43Z"
related to:
  - "[[GitHub - 828319514]]"
remind me:
---

# SwiftLaTeX Render

Renders LaTeX code blocks into PDF or SVG without a separately installed LaTeX. The recorded inputs state that blocks labeled latex compile to PDF and blocks labeled latexsvg to SVG, using a built-in SwiftLaTeX WebAssembly engine that fetches CTAN packages on demand. PDF output is converted to SVG by a wasm pdftocairo converter.

```cue
plugin: {
    id:     "swiftlatex-render"
    name:   "SwiftLaTeX Render"
    author: "gboyd068"
    repo:   "gboyd068/obsidian-swiftlatex-render"

    html_url:    "https://community.obsidian.md/plugins/swiftlatex-render"
    github_url:  "https://github.com/gboyd068/obsidian-swiftlatex-render"
    description: "Render LaTeX in codeblocks into a PDF, without needing to install LaTeX separately."
    about:       "Render LaTeX code blocks labeled latex into PDF or labeled latexsvg into SVG directly inside Obsidian. Compile locally with the built-in SwiftLaTeX WebAssembly engine, fetch CTAN packages on demand, and convert PDFs to SVG via a wasm pdftocairo converter."

    stats: {
        downloads:  5410
        updated_at: 1782573463000
    }
}
```

[^template]: [[Obsidian plugin]]
