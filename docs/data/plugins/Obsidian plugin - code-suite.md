---
uid: 6af7b0ef-ec82-5efd-a7fe-6e042b61a1c6
xid:
  - code-suite
aliases:
  - code-suite
  - Code Suite
  - felixleopold/obsidian-code-suite
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/code-suite
alt:
  - https://github.com/felixleopold/obsidian-code-suite
downloads: 1628
updated at: "2026-08-09T12:38:42Z"
related to:
  - "[[GitHub - 1194482554]]"
remind me:
---

# Code Suite

CodeSuite executes code inside a note while the note stays a plain Markdown file, with no kernel and no notebook file format. Python, JavaScript and TypeScript, Bash, PowerShell, PHP, Go and Ruby blocks run with streaming stdout and stderr, interactive stdin, and Matplotlib or Plotly graphs rendered inline; variables, imports and functions carry over between blocks and can be referenced in prose. Syntax highlighting uses Shiki with 65 or more built-in themes across reading view, live preview and source mode, vault code files can be embedded as executable blocks, and notes import from or export to Jupyter notebooks, styled HTML or PDF with outputs included.

```cue
plugin: {
    id:     "code-suite"
    name:   "Code Suite"
    author: "felixleopold"
    repo:   "felixleopold/obsidian-code-suite"

    html_url:    "https://community.obsidian.md/plugins/code-suite"
    github_url:  "https://github.com/felixleopold/obsidian-code-suite"
    description: "Execute code inside your notes: Shiki syntax highlighting with 65+ themes, live streaming output, inline Matplotlib and Plotly graphs, shared variables, and styled HTML and PDF export with outputs. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Execute code inside your notes: a notebook that lives in plain Markdown. No kernel, no `.ipynb`, no server: your note stays a plain-text file you can version, diff, and edit anywhere. VS Code–quality syntax highlighting (Shiki, 65+ built-in themes, import any VS Code .json theme) in Reading view, Live Preview, and Source mode — every token, pixel-perfect. Run Python, JS/TS, Bash, PowerShell, PHP, Go, Ruby, and more with live stdout/stderr streaming, interactive stdin, and Matplotlib/Plotly graphs rendered inline. Share state across blocks: variables, imports, and functions carry over between runs, across languages. Reference any value inline in your prose with `$varname` — it updates live. Hit Run All to execute the whole note in one click. Embed vault code files with `![[script.py]]` as executable blocks. Import and export Jupyter `.ipynb` notebooks, and export any note to styled HTML or PDF with code outputs included."

    stats: {
        downloads:  1628
        updated_at: 1786279122000
    }
}
```

[^template]: [[Obsidian plugin]]
