---
uid: 1b8ebf6c-8831-5ce9-8275-3c4c25ab9da6
xid:
  - git-viewer
aliases:
  - git-viewer
  - Git Viewer
  - viggomeesters/obsidian-git-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/git-viewer
alt:
  - https://github.com/viggomeesters/obsidian-git-viewer
downloads: 118
updated at: "2026-06-09T13:29:19Z"
related to:
  - "[[GitHub - 1262651689]]"
remind me:
---

# Git Viewer

Shows Git status in a compact sidebar and opens vault files from it. Commits are made from explicitly selected files through a temporary Git index with a required message, so unrelated staged changes are not touched. It runs the local git command line and deliberately offers no pull, clone, push, branch management, discard or reset.

```cue
plugin: {
    id:     "git-viewer"
    name:   "Git Viewer"
    author: "Viggo Meesters"
    repo:   "viggomeesters/obsidian-git-viewer"

    html_url:    "https://community.obsidian.md/plugins/git-viewer"
    github_url:  "https://github.com/viggomeesters/obsidian-git-viewer"
    description: "Lightweight Git status viewer with explicit selected-file commits. No pull, clone, branch management, push, discard, or reset. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "View Git status in a compact Obsidian sidebar and open vault files directly. Commit only selected files using a temporary Git index and required message to avoid touching unrelated staged changes. Run locally via the git CLI; no pull/push/branch management."

    stats: {
        downloads:  118
        updated_at: 1781011759000
    }
}
```

[^template]: [[Obsidian plugin]]
