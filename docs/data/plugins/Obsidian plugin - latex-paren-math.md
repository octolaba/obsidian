---
uid: 0a746e4e-bfe3-502b-b759-1707a63ef4a3
xid:
  - latex-paren-math
aliases:
  - latex-paren-math
  - LaTeX Paren Math
  - konoyo-014/obsidian-latex-paren-math
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/latex-paren-math
alt:
  - https://github.com/konoyo-014/obsidian-latex-paren-math
downloads: 232
updated at: "2026-02-21T13:39:14Z"
related to:
  - "[[GitHub - 1163342890]]"
remind me:
---

# LaTeX Paren Math

LaTeX Paren Math converts paren and bracket math delimiters at render time, rewriting a single-line paren formula into dollar-delimited inline math and a bracket formula into double-dollar display math, across a note or the whole vault. Multi-line paren blocks are preserved, and fenced code blocks and inline code spans are skipped so that code is not rewritten by accident. A ribbon action converts the note currently open.

```cue
plugin: {
    id:     "latex-paren-math"
    name:   "LaTeX Paren Math"
    author: "konoyo-014"
    repo:   "konoyo-014/obsidian-latex-paren-math"

    html_url:    "https://community.obsidian.md/plugins/latex-paren-math"
    github_url:  "https://github.com/konoyo-014/obsidian-latex-paren-math"
    description: "Render LaTeX paren and bracket math delimiters in preview by converting at render time. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert \\( ... \\) to $...$ for single-line formulas and \\[ ... \\] to $$...$$ across a note or the entire vault. Preserve multi-line \\( ... \\) blocks and skip fenced code blocks and inline code spans to avoid accidental rewrites; use the ribbon to convert the active note."

    stats: {
        downloads:  232
        updated_at: 1771681154000
    }
}
```

[^template]: [[Obsidian plugin]]
