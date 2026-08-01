---
uid: c01806ba-478e-5914-a969-921cee7c1080
xid:
  - mq
aliases:
  - mq
  - harehare/obsidian-mq
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mq
alt:
  - https://github.com/harehare/obsidian-mq
downloads: 11
updated at: "2026-07-22T13:42:56Z"
related to:
  - "[[GitHub - 1304736585]]"
remind me:
---

# mq

Runs mq, a jq-like query language for Markdown, inside Obsidian through WebAssembly and, the recorded text states, entirely client-side with no network access. Live mq code blocks render query results inline and can target files, folders, tags or Dataview output. Queries also run from the command palette to replace, insert, copy, report or update notes across the vault.

```cue
plugin: {
    id:     "mq"
    name:   "mq"
    author: "Takahiro Sato"
    repo:   "harehare/obsidian-mq"

    html_url:    "https://community.obsidian.md/plugins/mq"
    github_url:  "https://github.com/harehare/obsidian-mq"
    description: "Run mq (a jq-like query language for Markdown) queries directly in Obsidian: live query blocks, note/vault transforms, and editor support. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run jq-like mq queries directly inside Obsidian, fully client-side via WebAssembly with no network access. Insert live mq code blocks to render query results inline, target files, folders, tags or Dataview outputs, and run queries from the command palette to replace, insert, copy, report, or update notes across the vault."

    stats: {
        downloads:  11
        updated_at: 1784727776000
    }
}
```

[^template]: [[Obsidian plugin]]
