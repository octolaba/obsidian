---
uid: d27d73b7-ca92-5acd-941c-8e525838eff6
xid:
  - obsidian-activity-logger
aliases:
  - obsidian-activity-logger
  - Activity Logger
  - creling/obsidian-activity-logger
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-activity-logger
alt:
  - https://github.com/creling/obsidian-activity-logger
downloads: 5334
updated at: "2021-08-06T14:20:42Z"
related to:
  - "[[GitHub - 392589598]]"
remind me:
---

# Activity Logger

Activity Logger records vault activity, covering files created, modified and deleted, into notes through customizable templates. The placeholders $createdFiles, $modifiedFiles and $deletedFiles mark where each list is written, and an entry placed between defined start and end lines is updated in place rather than duplicated.

```cue
plugin: {
    id:     "obsidian-activity-logger"
    name:   "Activity Logger"
    author: "creling"
    repo:   "creling/obsidian-activity-logger"

    html_url:    "https://community.obsidian.md/plugins/obsidian-activity-logger"
    github_url:  "https://github.com/creling/obsidian-activity-logger"
    description: "Log your activities like creating notes, modifying notes, deleting notes and so on."
    about:       "Log note activity — created, modified, and deleted files — into notes using customizable templates with $createdFiles, $modifiedFiles and $deletedFiles placeholders. Preserve idempotency by updating existing entries placed between defined start and end lines."

    stats: {
        downloads:  5334
        updated_at: 1628259642000
    }
}
```

[^template]: [[Obsidian plugin]]
