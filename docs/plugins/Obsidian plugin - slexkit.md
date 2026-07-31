---
uid: 93b55835-f579-5274-939a-f18442074da3
xid:
  - slexkit
aliases:
  - slexkit
  - SlexKit
  - slexkit/obsidian-slexkit
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/slexkit
alt:
  - https://github.com/slexkit/obsidian-slexkit
downloads: 98
updated at: "2026-06-20T10:55:01Z"
related to:
  - "[[GitHub - 1253644115]]"
remind me:
---

# SlexKit

SlexKit renders interactive Slex fenced UI blocks in Obsidian reading mode, from slex code fences. It maintains a vault-readonly boundary, so generated content and interaction state are never written back to files. A note-scoped trusted runtime is shared, letting state-only fences seed later renderables while untrusted Markdown is not run.

```cue
plugin: {
    id:     "slexkit"
    name:   "SlexKit"
    author: "SlexKit"
    repo:   "slexkit/obsidian-slexkit"

    html_url:    "https://community.obsidian.md/plugins/slexkit"
    github_url:  "https://github.com/slexkit/obsidian-slexkit"
    description: "Render SlexKit fenced UI blocks in Obsidian reading mode. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render interactive Slex fenced UI blocks in Obsidian preview from slex code fences. Maintain a vault-readonly boundary so generated content and interaction state are never written back to files. Share a note-scoped trusted runtime so state-only fences can seed later renderables and avoid running untrusted Markdown."

    stats: {
        downloads:  98
        updated_at: 1781952901000
    }
}
```

[^template]: [[Obsidian plugin]]
