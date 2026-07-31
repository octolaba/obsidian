---
uid: ef1f2335-9707-5365-a12b-6c6813079e46
xid:
  - feishu-lark-cli-sync
aliases:
  - feishu-lark-cli-sync
  - Feishu Lark CLI Sync
  - wanghuan9/obsidian-feishu-lark-cli-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/feishu-lark-cli-sync
alt:
  - https://github.com/wanghuan9/obsidian-feishu-lark-cli-sync
downloads: 567
updated at: "2026-07-16T10:14:23Z"
related to:
  - "[[GitHub - 1266348693]]"
remind me:
---

# Feishu Lark CLI Sync

Feishu Lark CLI Sync publishes Obsidian Markdown to Feishu or Lark documents through the local lark-cli, handling a single file or a whole directory while preserving the folder hierarchy. Updates are incremental and avoid silent full overwrites, and internal Markdown and Wiki links are rewritten into references to the remote documents. A forced full overwrite remains available.

```cue
plugin: {
    id:     "feishu-lark-cli-sync"
    name:   "Feishu Lark CLI Sync"
    author: "wanghuan"
    repo:   "wanghuan9/obsidian-feishu-lark-cli-sync"

    html_url:    "https://community.obsidian.md/plugins/feishu-lark-cli-sync"
    github_url:  "https://github.com/wanghuan9/obsidian-feishu-lark-cli-sync"
    description: "通过 lark-cli 发布 Obsidian 笔记到飞书文档及后续自动同步。Publish Obsidian notes to Feishu documents and subsequent automatic synchronization via lark-cli - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish Obsidian Markdown to Feishu/Lark docs via the local lark-cli, syncing single files or entire directories while preserving folder hierarchy. Perform safe incremental updates that avoid silent full overwrites, rewrite internal Markdown/Wiki links to remote doc references, and allow forced full overwrite when needed."

    stats: {
        downloads:  567
        updated_at: 1784196863000
    }
}
```

[^template]: [[Obsidian plugin]]
