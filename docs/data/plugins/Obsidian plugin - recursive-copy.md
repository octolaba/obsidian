---
uid: 353dec6a-9a78-5e7a-bcf4-8a2cc367cc79
xid:
  - recursive-copy
aliases:
  - recursive-copy
  - Recursive Copy
  - structbylightning/obsidian-recursive-copy
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/recursive-copy
alt:
  - https://github.com/structbylightning/obsidian-recursive-copy
downloads: 906
updated at: "2024-07-17T03:55:19Z"
related to:
  - "[[GitHub - 829815142]]"
remind me:
---

# Recursive Copy

Recursively copies every Markdown file in a folder, concatenates them, and puts the combined text on the clipboard. It runs from a folder's context menu or through a hotkey that copies the active file's parent folder. The recorded description gives loading that combined content into an LLM as the intended use.

```cue
plugin: {
    id:     "recursive-copy"
    name:   "Recursive Copy"
    author: "structbylightning"
    repo:   "structbylightning/obsidian-recursive-copy"

    html_url:    "https://community.obsidian.md/plugins/recursive-copy"
    github_url:  "https://github.com/structbylightning/obsidian-recursive-copy"
    description: "Recursively copies all Markdown files in a folder, concatenates them, and copies them into the clipboard."
    about:       "Copy all Markdown files from a folder, concatenate them, and place the combined text on the clipboard. Activate from a folder's context menu or via hotkey to copy the active file's parent folder. Load the combined content into LLMs like Claude Artifacts or ChatGPT for quick context."

    stats: {
        downloads:  906
        updated_at: 1721188519000
    }
}
```

[^template]: [[Obsidian plugin]]
