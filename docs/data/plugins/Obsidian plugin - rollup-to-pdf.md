---
uid: b1f4b233-8504-5450-923c-dcbe1387497b
xid:
  - rollup-to-pdf
aliases:
  - rollup-to-pdf
  - Rollup to PDF
  - svm0n/obsidian-rollup-to-pdf
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/rollup-to-pdf
alt:
  - https://github.com/svm0n/obsidian-rollup-to-pdf
downloads: 47
updated at: "2026-07-25T14:30:21Z"
related to:
  - "[[GitHub - 1304343484]]"
remind me:
---

# Rollup to PDF

Rollup to PDF compiles a tree of wiki-linked notes into a single typeset PDF through Pandoc, with a title page, table of contents, numbered sections and styled callout boxes. Starting from an index note, each line-leading link is inlined recursively as a nested, numbered subsection, flattening an outline into one export.

```cue
plugin: {
    id:     "rollup-to-pdf"
    name:   "Rollup to PDF"
    author: "SVM0N"
    repo:   "svm0n/obsidian-rollup-to-pdf"

    html_url:    "https://community.obsidian.md/plugins/rollup-to-pdf"
    github_url:  "https://github.com/svm0n/obsidian-rollup-to-pdf"
    description: "Compile a tree of wiki-linked notes into a single formatted PDF via Pandoc, with heading-relative nesting and inline or appendix-style page expansion. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Compile a tree of wiki-linked notes into a single typeset PDF with a title page, table of contents, numbered sections, and styled callout boxes. Point at an index note to inline each line-leading → [[link]] as nested, numbered subsections recursively, flattening your outline into one export."

    stats: {
        downloads:  47
        updated_at: 1784989821000
    }
}
```

[^template]: [[Obsidian plugin]]
