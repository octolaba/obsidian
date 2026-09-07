---
uid: 172ac499-62c8-5c61-83ac-65926c47d042
xid:
  - github-review
aliases:
  - github-review
  - GitHub Review
  - christophy/obsidian-github-review
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/github-review
alt:
  - https://github.com/christophy/obsidian-github-review
downloads: 129
updated at: "2026-06-08T09:50:25Z"
related to:
  - "[[GitHub - 1259469380]]"
remind me:
---

# GitHub Review

Reads GitHub issues and pull requests inside Obsidian, renders their Markdown, and posts comments and pull request reviews back to GitHub as the owner of the configured token. Issues can be created from repository templates and full file changes inspected through collapsible diffs with Viewed checkmarks. Open items are queried through a built-in Claude bridge, and repository data is not stored locally.

```cue
plugin: {
    id:     "github-review"
    name:   "GitHub Review"
    author: "Christophy"
    repo:   "christophy/obsidian-github-review"

    html_url:    "https://community.obsidian.md/plugins/github-review"
    github_url:  "https://github.com/christophy/obsidian-github-review"
    description: "Read, comment on, and approve/request-changes on GitHub issues & PRs inside Obsidian. GitHub stays the source of truth. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Review GitHub issues and pull requests in Obsidian, render Markdown specs, and post comments and PR reviews directly to GitHub as your token owner. Create issues from repo templates, inspect full file changes with collapsible diffs and 'Viewed' checks, and query open items via a built-in Claude bridge without storing repo data locally."

    stats: {
        downloads:  129
        updated_at: 1780912225000
    }
}
```

[^template]: [[Obsidian plugin]]
