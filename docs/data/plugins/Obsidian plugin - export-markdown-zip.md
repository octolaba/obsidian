---
uid: 1811afa0-7d70-538b-b3e9-1708e875fe97
xid:
  - export-markdown-zip
aliases:
  - export-markdown-zip
  - Export Markdown ZIP
  - padane22-spec/obsidian-export-markdown-zip
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/export-markdown-zip
alt:
  - https://github.com/padane22-spec/obsidian-export-markdown-zip
downloads: 345
updated at: "2026-05-19T08:16:02Z"
related to:
  - "[[GitHub - 1179413736]]"
remind me:
---

# Export Markdown ZIP

Exports a note as a ZIP archive containing the note itself, the Markdown files it links to recursively, and local attachments such as images, PDFs and audio. Internal Obsidian links are rewritten as relative Markdown paths and the vault-relative structure is kept inside a top-level folder, so the archive still works after extraction. Exports start from the command palette or the file context menu.

```cue
plugin: {
    id:     "export-markdown-zip"
    name:   "Export Markdown ZIP"
    author: "padane22-spec"
    repo:   "padane22-spec/obsidian-export-markdown-zip"

    html_url:    "https://community.obsidian.md/plugins/export-markdown-zip"
    github_url:  "https://github.com/padane22-spec/obsidian-export-markdown-zip"
    description: "Export a note with linked notes and local attachments into a zip archive. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Export a Markdown note as a self-contained ZIP containing the note, its recursively linked Markdown files, and local attachments (images, PDFs, audio, etc.). Rewrite internal Obsidian links to standard relative Markdown paths and preserve vault-relative structure inside a top-level folder so everything works after extraction. Trigger exports from the command palette or the file context menu."

    stats: {
        downloads:  345
        updated_at: 1779178562000
    }
}
```

[^template]: [[Obsidian plugin]]
