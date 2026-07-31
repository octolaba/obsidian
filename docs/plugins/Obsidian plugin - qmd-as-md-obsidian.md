---
uid: ab39691a-9aa5-5f54-a145-0c5048b7d16d
xid:
  - qmd-as-md-obsidian
aliases:
  - qmd-as-md-obsidian
  - qmd as md
  - danieltomasz/qmd-as-md-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/qmd-as-md-obsidian
alt:
  - https://github.com/danieltomasz/qmd-as-md-obsidian
downloads: 10680
updated at: "2026-05-21T10:48:13Z"
related to:
  - "[[GitHub - 498511703]]"
remind me:
---

# qmd as md

Opens Quarto .qmd files in Obsidian's ordinary Markdown editor and previews or renders the active file through a locally installed Quarto on PATH, producing PDF, DOCX, HTML or reveal.js output according to the format declared in the Quarto YAML. A sidebar outline lists .qmd headings, optional dedicated editors cover .yml and .lua files, and commands create new Quarto files from presets or user templates. A Lua filter converts Obsidian callouts into native Quarto callouts, and the recorded inputs say Zotero citation workflows through Better BibTeX work alongside it.

```cue
plugin: {
    id:     "qmd-as-md-obsidian"
    name:   "qmd as md"
    author: "Daniel Borek"
    repo:   "danieltomasz/qmd-as-md-obsidian"

    html_url:    "https://community.obsidian.md/plugins/qmd-as-md-obsidian"
    github_url:  "https://github.com/danieltomasz/qmd-as-md-obsidian"
    description: "Edit, preview, and render Quarto (.qmd) files with executable code cells via Quarto to PDF, DOCX, HTML, or reveal.js."
    about:       "Quarto support for Obsidian. Open .qmd files in Obsidian’s normal Markdown editor, preview or render the active file, and keep your writing workflow inside the vault. Use one source file to produce academic manuscripts, PDFs, DOCX files, HTML pages, or reveal.js slides, depending on the format declared in your Quarto YAML. PDF preview/render can be opened in Obsidian. Includes a sidebar outline for .qmd headings, optional dedicated editors for .yml and .lua files, commands for creating new Quarto files from presets, support for user templates, and a Lua filter that converts Obsidian callouts into native Quarto callouts. Works well with Zotero citation workflows through Better BibTeX and Obsidian citation plugins. Requires Quarto installed locally and available on PATH."

    stats: {
        downloads:  10680
        updated_at: 1779360493000
    }
}
```

[^template]: [[Obsidian plugin]]
