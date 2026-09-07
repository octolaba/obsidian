---
uid: d66a78af-8179-5f74-a6ef-7b578318a85b
xid:
  - codefile
aliases:
  - codefile
  - Code File Embed
  - williansaez/code-ref-vault
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/codefile
alt:
  - https://github.com/williansaez/code-ref-vault
downloads: 122
updated at: "2026-07-01T17:25:33Z"
related to:
  - "[[GitHub - 1286265535]]"
remind me:
---

# Code File Embed

Code File Embed renders the contents of a vault file as a syntax-highlighted code block from a codefile fenced block, inferring the language from the file extension and accepting line ranges or a single line. Rendering goes through Obsidian's own code renderer, so the theme and the copy button are preserved, and blocks update when the source file is saved or renamed. An optional header shows the file path as a clickable link.

```cue
plugin: {
    id:     "codefile"
    name:   "Code File Embed"
    author: "Willian Saez"
    repo:   "williansaez/code-ref-vault"

    html_url:    "https://community.obsidian.md/plugins/codefile"
    github_url:  "https://github.com/williansaez/code-ref-vault"
    description: "Embed the contents of a vault file as a syntax-highlighted code block via a codefile fenced block. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed a vault file's contents as a syntax-highlighted code block, inferring language from the file extension and supporting line ranges or single-line targets. Render with Obsidian's code renderer (theme and copy button preserved) and auto-update blocks when the source file is saved or renamed, with an optional clickable file-path header."

    stats: {
        downloads:  122
        updated_at: 1782926733000
    }
}
```

[^template]: [[Obsidian plugin]]
