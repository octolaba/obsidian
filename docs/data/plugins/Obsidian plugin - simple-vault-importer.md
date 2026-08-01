---
uid: d9b992fb-9bed-55cd-a168-0f68b12e7b9a
xid:
  - simple-vault-importer
aliases:
  - simple-vault-importer
  - Simple Vault Importer
  - webinspectinc/obsidian-simple-template-importer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-vault-importer
alt:
  - https://github.com/webinspectinc/obsidian-simple-template-importer
downloads: 655
updated at: "2025-07-09T11:42:21Z"
related to:
  - "[[GitHub - 995490941]]"
remind me:
---

# Simple Vault Importer

Simple Vault Importer imports starter or template vaults supplied as ZIP files into an existing vault. Markdown notes are extracted into the vault and any .css files placed in the snippets folder. Name conflicts are handled by overwriting or by importing into a separate folder, and plugin files are ignored for now.

```cue
plugin: {
    id:     "simple-vault-importer"
    name:   "Simple Vault Importer"
    author: "webinspectinc"
    repo:   "webinspectinc/obsidian-simple-template-importer"

    html_url:    "https://community.obsidian.md/plugins/simple-vault-importer"
    github_url:  "https://github.com/webinspectinc/obsidian-simple-template-importer"
    description: "Import starter vaults into your own vault."
    about:       "Import template vaults from ZIP files into your Obsidian vault, extracting Markdown notes and placing .css files into the snippets folder. Handle name conflicts with overwrite or import-folder options, and ignore plugin files for now."

    stats: {
        downloads:  655
        updated_at: 1752061341000
    }
}
```

[^template]: [[Obsidian plugin]]
