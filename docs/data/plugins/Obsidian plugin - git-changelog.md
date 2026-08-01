---
uid: 302c30dd-7917-5c08-beb9-da4b16c4d6a1
xid:
  - git-changelog
aliases:
  - git-changelog
  - Git Changelog
  - shumadrid/obsidian-git-changelog
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/git-changelog
alt:
  - https://github.com/shumadrid/obsidian-git-changelog
downloads: 1118
updated at: "2025-06-18T17:37:59Z"
related to:
  - "[[GitHub - 946954325]]"
remind me:
---

# Git Changelog

Reads Git commit history to display changelogs in the sidebar, per file and for the whole vault, with lines added and deleted and counts of added, modified, moved or renamed and deleted files. It compares vault states to make possible data loss visible, shows live per-note statistics and opens Git diffs directly.

```cue
plugin: {
    id:     "git-changelog"
    name:   "Git Changelog"
    author: "shumadrid"
    repo:   "shumadrid/obsidian-git-changelog"

    html_url:    "https://community.obsidian.md/plugins/git-changelog"
    github_url:  "https://github.com/shumadrid/obsidian-git-changelog"
    description: "Uses Git to display dynamic vault and file changelogs in the sidebar, useful for spotting data loss."
    about:       "Display dynamic changelogs from Git commit history in the sidebar, showing per-file and vault-level changes with lines added/deleted and counts of added, modified, moved/renamed, and deleted files. Monitor potential data loss by comparing vault states, view live per-note stats, and open Git diffs directly."

    stats: {
        downloads:  1118
        updated_at: 1750268279000
    }
}
```

[^template]: [[Obsidian plugin]]
