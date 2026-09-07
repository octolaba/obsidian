---
uid: 3a06bfc9-c129-58b4-966b-6d04de630862
xid:
  - obsidian-gitlab-issues
aliases:
  - obsidian-gitlab-issues
  - Gitlab Issues
  - benr77/obsidian-gitlab-issues
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-gitlab-issues
alt:
  - https://github.com/benr77/obsidian-gitlab-issues
downloads: 5681
updated at: "2026-04-13T06:12:29Z"
related to:
  - "[[GitHub - 516305760]]"
remind me:
---

# Gitlab Issues

Imports GitLab issues into a chosen folder as notes rendered from customizable Handlebars templates. The imported notes are kept read-only, and a note is removed automatically once its issue no longer appears on GitLab. Updates are fetched shortly after startup and then every 15 minutes.

```cue
plugin: {
    id:     "obsidian-gitlab-issues"
    name:   "Gitlab Issues"
    author: "benr77"
    repo:   "benr77/obsidian-gitlab-issues"

    html_url:    "https://community.obsidian.md/plugins/obsidian-gitlab-issues"
    github_url:  "https://github.com/benr77/obsidian-gitlab-issues"
    description: "Import Gitlab issues."
    about:       "Import GitLab issues as Obsidian notes into a chosen folder using customizable Handlebars templates. Keep notes read-only and automatically remove any note when its issue no longer appears on GitLab; fetch updates shortly after startup and every 15 minutes."

    stats: {
        downloads:  5681
        updated_at: 1776060749000
    }
}
```

[^template]: [[Obsidian plugin]]
