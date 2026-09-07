---
uid: 44a23ff2-8dbc-56c2-b316-ea4beabe807f
xid:
  - github-assignments
aliases:
  - github-assignments
  - GitHub Assignments
  - joewhitsitt/obsidian-github-assignments
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/github-assignments
alt:
  - https://github.com/joewhitsitt/obsidian-github-assignments
downloads: 121
updated at: "2026-06-04T12:50:29Z"
related to:
  - "[[GitHub - 1140794394]]"
remind me:
---

# GitHub Assignments

Fetches the GitHub issues and pull requests assigned to the user and appends them to the current note as checkbox tasks, skipping ones already present. Optional issue prefixes, task suffixes and a created-date field for Tasks-plugin compatibility can be added, and tasks are inserted at the cursor without breaking ordered lists.

```cue
plugin: {
    id:     "github-assignments"
    name:   "GitHub Assignments"
    author: "joewhitsitt"
    repo:   "joewhitsitt/obsidian-github-assignments"

    html_url:    "https://community.obsidian.md/plugins/github-assignments"
    github_url:  "https://github.com/joewhitsitt/obsidian-github-assignments"
    description: "Lightweight plugin to append assigned GitHub issues and pull requests to your note. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Fetch assigned GitHub issues and pull requests and append them as checkbox tasks to the current note while avoiding duplicates. Add optional issue/PR prefixes, task suffixes and a [created:: YYYY-MM-DD] tag for Tasks plugin compatibility, and insert tasks cleanly at the cursor without breaking ordered lists."

    stats: {
        downloads:  121
        updated_at: 1780577429000
    }
}
```

[^template]: [[Obsidian plugin]]
