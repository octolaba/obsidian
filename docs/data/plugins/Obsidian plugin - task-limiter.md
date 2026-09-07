---
uid: 41fcd2a5-bd38-5575-b9d0-c3342d50c041
xid:
  - task-limiter
aliases:
  - task-limiter
  - Task Limiter
  - jmondo/obsidian-task-limiter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/task-limiter
alt:
  - https://github.com/jmondo/obsidian-task-limiter
downloads: 104
updated at: "2026-02-15T19:33:08Z"
related to:
  - "[[GitHub - 1158693861]]"
remind me:
---

# Task Limiter

Task Limiter enforces a work-in-progress limit per section, reading the limit from a bracketed marker added to the section header. Task lines beyond that limit are marked with a subtle background. Completed items can optionally be counted toward the cap.

```cue
plugin: {
    id:     "task-limiter"
    name:   "Task Limiter"
    author: "jmondo"
    repo:   "jmondo/obsidian-task-limiter"

    html_url:    "https://community.obsidian.md/plugins/task-limiter"
    github_url:  "https://github.com/jmondo/obsidian-task-limiter"
    description: "Limit task items per section using [limit=N] tags. Visually marks over-limit lines. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Enforce a work-in-progress limit per section by adding [limit=N] to headers. Highlight tasks that exceed the limit with a subtle background and optionally count completed items toward the cap."

    stats: {
        downloads:  104
        updated_at: 1771183988000
    }
}
```

[^template]: [[Obsidian plugin]]
