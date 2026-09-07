---
uid: 765a1cc7-f170-5731-8f0d-dc8181c48db2
xid:
  - uri-commands
aliases:
  - uri-commands
  - URI Commands
  - kzhovn/uri-commands-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/uri-commands
alt:
  - https://github.com/kzhovn/uri-commands-obsidian
downloads: 7600
updated at: "2025-01-21T07:54:29Z"
related to:
  - "[[GitHub - 410605229]]"
remind me:
---

# URI Commands

Adds custom URI commands to the command palette, calling either an Obsidian URI or any system URI scheme. Placeholders for the file name, file path, file text, selection, line, vault name and a metadata field are substituted with automatic URL-encoding. A command that uses a placeholder is hidden while no file is active.

```cue
plugin: {
    id:     "uri-commands"
    name:   "URI Commands"
    author: "kzhovn"
    repo:   "kzhovn/uri-commands-obsidian"

    html_url:    "https://community.obsidian.md/plugins/uri-commands"
    github_url:  "https://github.com/kzhovn/uri-commands-obsidian"
    description: "Execute URIs from the command palette."
    about:       "Add custom URI commands to the command palette to call Obsidian URIs or any system URI scheme. Use placeholders like {{fileName}}, {{filePath}}, {{fileText}}, {{selection}}, {{line}}, {{vaultName}} and {{meta:FIELD_NAME}} with automatic URL-encoding; commands with placeholders hide when no active file."

    stats: {
        downloads:  7600
        updated_at: 1737446069000
    }
}
```

[^template]: [[Obsidian plugin]]
