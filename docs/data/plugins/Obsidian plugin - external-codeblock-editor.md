---
uid: b69cb85e-d6a9-5d1b-a6b2-7c663eab5df8
xid:
  - external-codeblock-editor
aliases:
  - external-codeblock-editor
  - External Codeblock Editor
  - glebglazov/obsidian-external-codeblock-editor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/external-codeblock-editor
alt:
  - https://github.com/glebglazov/obsidian-external-codeblock-editor
downloads: 310
updated at: "2025-12-30T11:40:22Z"
related to:
  - "[[GitHub - 1043177660]]"
remind me:
---

# External Codeblock Editor

External Codeblock Editor opens a codeblock of a Markdown document in an external editor such as Neovim or VSCode, so its autocompletion, indentation and LSP capabilities apply. The block is written to a temporary file whose extension follows the detected language, and saved changes are synced back into the note automatically. The terminal and editor command is configurable, and more than 30 languages are supported.

```cue
plugin: {
    id:     "external-codeblock-editor"
    name:   "External Codeblock Editor"
    author: "glebglazov"
    repo:   "glebglazov/obsidian-external-codeblock-editor"

    html_url:    "https://community.obsidian.md/plugins/external-codeblock-editor"
    github_url:  "https://github.com/glebglazov/obsidian-external-codeblock-editor"
    description: "Edit codeblocks of Markdown documents with external editors to get autocompletion, indentation, LSP capabilities of your favourite editor (Neovim, VSCode, etc). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Edit any codeblock in your preferred external editor using language-aware temporary files. Detect languages to set proper file extensions and sync saved changes back to the note automatically, with a configurable terminal/editor command and support for 30+ languages."

    stats: {
        downloads:  310
        updated_at: 1767094822000
    }
}
```

[^template]: [[Obsidian plugin]]
