---
uid: 80f91d9a-e9ef-5994-baf0-af85dc4828ee
xid:
  - obsidian-latex
aliases:
  - obsidian-latex
  - Extended MathJax
  - wei2912/obsidian-latex
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-latex
alt:
  - https://github.com/wei2912/obsidian-latex
downloads: 57822
updated at: "2023-01-13T05:53:42Z"
related to:
  - "[[GitHub - 323223125]]"
remind me:
---

# Extended MathJax

Extends MathJax by loading a preamble.sty file from the vault root and enabling additional MathJax packages such as mhchem and bussproofs. The recorded inputs note that Obsidian must be reloaded after the preamble is edited, and that the file has to exist at startup under exactly that name to be loaded.

```cue
plugin: {
    id:     "obsidian-latex"
    name:   "Extended MathJax"
    author: "wei2912"
    repo:   "wei2912/obsidian-latex"

    html_url:    "https://community.obsidian.md/plugins/obsidian-latex"
    github_url:  "https://github.com/wei2912/obsidian-latex"
    description: "Enable additional MathJax packages and adds a global preamble for MathJax."
    about:       "Extend MathJax support by loading a preamble.sty from your vault root and enabling extra MathJax extensions like mhchem and bussproofs. Reload Obsidian after editing the preamble; preamble.sty must exist at startup and be named correctly to be loaded."

    stats: {
        downloads:  57822
        updated_at: 1673589222000
    }
}
```

[^template]: [[Obsidian plugin]]
