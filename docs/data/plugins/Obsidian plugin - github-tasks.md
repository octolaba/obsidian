---
uid: a23cfce8-50c9-594c-94e3-ecec8b29c2b4
xid:
  - github-tasks
aliases:
  - github-tasks
  - GitHub Tasks
  - epistemic-technology/obsidian-github-tasks
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/github-tasks
alt:
  - https://github.com/epistemic-technology/obsidian-github-tasks
downloads: 485
updated at: "2025-09-08T15:46:39Z"
related to:
  - "[[GitHub - 1003691630]]"
remind me:
---

# GitHub Tasks

Imports GitHub issues and pull requests into Obsidian as tasks, covering items assigned to the user and items they opened. Labels and repository names can be mapped to tags, closed items are marked completed, and tasks are written in either Tasks emoji or Dataview format, with scheduled refresh and clearing of completed items. The sync runs one way from GitHub, so completing a task in Obsidian does not update GitHub.

```cue
plugin: {
    id:     "github-tasks"
    name:   "GitHub Tasks"
    author: "epistemic-technology"
    repo:   "epistemic-technology/obsidian-github-tasks"

    html_url:    "https://community.obsidian.md/plugins/github-tasks"
    github_url:  "https://github.com/epistemic-technology/obsidian-github-tasks"
    description: "Sync issues and pull requests from your GitHub account to tasks."
    about:       "Import GitHub issues and pull requests into Obsidian as tasks, including items assigned to or opened by you. Map labels and repository names to tags, mark closed issues/PRs completed, choose Tasks Emoji or Dataview formats, and auto-refresh or clear completed on a schedule. Keep a one-way sync from GitHub to Obsidian; completing a task in Obsidian does not update GitHub."

    stats: {
        downloads:  485
        updated_at: 1757346399000
    }
}
```

[^template]: [[Obsidian plugin]]
