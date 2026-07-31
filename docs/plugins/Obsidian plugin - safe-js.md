---
uid: 72eb8e99-df2d-5d80-90c1-1d1abd75a4f4
xid:
  - safe-js
aliases:
  - safe-js
  - Safe JS
  - mprojectscode/obsidian-safe-js-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/safe-js
alt:
  - https://github.com/mprojectscode/obsidian-safe-js-plugin
downloads: 116
updated at: "2026-07-05T18:52:20Z"
related to:
  - "[[GitHub - 1236017638]]"
remind me:
---

# Safe JS

Safe JS runs note-owned JavaScript inside sandboxed Web Workers behind a limited RPC surface, with a permission-gated host API that blocks DOM, Node, Electron and direct Obsidian access. Scripts declare the permissions they need in leading comments, approval prompts are remembered per script source hash, and validated api calls cover vault, metadata, workspace, editor, UI, storage and network operations. The index records that the plugin has not been manually reviewed by Obsidian staff.

```cue
plugin: {
    id:     "safe-js"
    name:   "Safe JS"
    author: "Moritz Jung"
    repo:   "mprojectscode/obsidian-safe-js-plugin"

    html_url:    "https://community.obsidian.md/plugins/safe-js"
    github_url:  "https://github.com/mprojectscode/obsidian-safe-js-plugin"
    description: "Run note-owned JavaScript through sandboxed Web Workers and a limited RPC surface. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run note-owned JavaScript in sandboxed Web Workers with a minimal, permission-gated host API that blocks DOM, Node, Electron, and direct Obsidian access. Declare permissions with leading comments, review approval prompts remembered per script source hash, and call validated api.* functions for vault, metadata, workspace, editor, UI, storage, and network operations."

    stats: {
        downloads:  116
        updated_at: 1783277540000
    }
}
```

[^template]: [[Obsidian plugin]]
