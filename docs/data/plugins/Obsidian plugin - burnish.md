---
uid: 917e8b16-85f7-567a-a3de-18c17fbd2b1e
xid:
  - burnish
aliases:
  - burnish
  - Burnish
  - johncattrall/burnish
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/burnish
alt:
  - https://github.com/johncattrall/burnish
downloads: 136
updated at: "2026-06-22T14:20:45Z"
related to:
  - "[[GitHub - 1276952607]]"
remind me:
---

# Burnish

Burnish sends a note or a selection to a language model, applies a chosen cleanup action, and shows the result as a diff that is accepted or rejected per hunk before anything is written. It can merge meeting notes from several people into one deduplicated note, flag conflicts, keep unmergeable content verbatim, generate Mermaid diagrams and tables and scaffold a Map of Content, and it ships presets such as Tidy, Restructure, Distil and Format Normalise. Saved prompts take variables, grit levels set how far a rewrite goes, code, maths, embeds and frontmatter are protected, and version history rolls back any change.

```cue
plugin: {
    id:     "burnish"
    name:   "Burnish"
    author: "John Cattrall"
    repo:   "johncattrall/burnish"

    html_url:    "https://community.obsidian.md/plugins/burnish"
    github_url:  "https://github.com/johncattrall/burnish"
    description: "Polish your notes using AI: Tidy, Restructure, Distill, Merge Meeting Notes, Generate Diagrams and more, review every change before it is written. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Burnish uses AI to polish your notes without ever changing anything silently. Send a note, or selected text, to an LLM, choose a cleanup action, and review the result in a diff preview with per-hunk accept or reject before anything is written. Accepted changes are applied as a single undo step. Burnish can merge meeting notes from multiple people into a single deduplicated note, flag conflicts, preserve unmergeable content verbatim, generate Mermaid diagrams and tables, and scaffold a Map of Content. It also ships with presets including Tidy, Restructure, Summarise, Distil, Expand, Action Items, and Format Normalise. You can create reusable saved prompts with variables like {{title}} and {{frontmatter.x}}, set “grit” levels from a light buff to a deep polish, and assign per-folder defaults. Code, maths, embeds, and frontmatter are protected, and version history lets you roll back any change, including batch and scheduled runs."

    stats: {
        downloads:  136
        updated_at: 1782138045000
    }
}
```

[^template]: [[Obsidian plugin]]
