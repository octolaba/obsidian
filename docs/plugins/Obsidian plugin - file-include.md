---
uid: 27fde022-4505-50ea-982d-2540dff87fec
xid:
  - file-include
aliases:
  - file-include
  - File Include
  - tillahoffmann/obsidian-file-include
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/file-include
alt:
  - https://github.com/tillahoffmann/obsidian-file-include
downloads: 5333
updated at: "2023-06-28T19:04:39Z"
related to:
  - "[[GitHub - 648309726]]"
remind me:
---

# File Include

File Include embeds another file into a note through an include code block. Naming a language before the path, as in include python hello.py, adds syntax highlighting to the included content. Paths resolve relative to the note, or against the vault root when prefixed with @/ instead.

```cue
plugin: {
    id:     "file-include"
    name:   "File Include"
    author: "tillahoffmann"
    repo:   "tillahoffmann/obsidian-file-include"

    html_url:    "https://community.obsidian.md/plugins/file-include"
    github_url:  "https://github.com/tillahoffmann/obsidian-file-include"
    description: "Include or embed files in Obsidian Markdown."
    about:       "Include files in notes using include code blocks to embed external files directly into Markdown. Add syntax highlighting by specifying the language before the path (for example: include python hello.py). Resolve paths relative to the note or prefix with @/ to reference the vault root."

    stats: {
        downloads:  5333
        updated_at: 1687979079000
    }
}
```

[^template]: [[Obsidian plugin]]
