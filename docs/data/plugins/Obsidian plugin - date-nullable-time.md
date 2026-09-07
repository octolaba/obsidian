---
uid: 3833939b-3a8f-50f1-9734-29430b13745b
xid:
  - date-nullable-time
aliases:
  - date-nullable-time
  - Date Nullable Time
  - jakoblien/date-nullable-time
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/date-nullable-time
alt:
  - https://github.com/jakoblien/date-nullable-time
downloads: 22
updated at: "2026-08-10T16:05:26Z"
related to:
  - "[[GitHub - 1322208761]]"
remind me:
---

# Date Nullable Time

Removes the time part of a datetime property when that time is 00:00:00, leaving the value as a plain date. The rewrite is scoped to that case, so datetime properties carrying any other time are untouched.

```cue
plugin: {
    id:     "date-nullable-time"
    name:   "Date Nullable Time"
    author: "Jakob Lien"
    repo:   "jakoblien/date-nullable-time"

    html_url:    "https://community.obsidian.md/plugins/date-nullable-time"
    github_url:  "https://github.com/jakoblien/date-nullable-time"
    description: "Removes time from datetime properties when the time is 00:00:00. - This plugin has not been manually reviewed by Obsidian staff."

    stats: {
        downloads:  22
        updated_at: 1786377926000
    }
}
```

[^template]: [[Obsidian plugin]]
