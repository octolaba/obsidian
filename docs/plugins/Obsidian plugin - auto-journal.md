---
uid: e97902ee-bd54-5699-8fde-278c5aebe335
xid:
  - auto-journal
aliases:
  - auto-journal
  - Auto Journal
  - ebonsignori/obsidian-auto-journal
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-journal
alt:
  - https://github.com/ebonsignori/obsidian-auto-journal
downloads: 5722
updated at: "2025-09-28T03:35:09Z"
related to:
  - "[[GitHub - 677573016]]"
remind me:
---

# Auto Journal

Auto Journal backfills daily and monthly notes into a fixed year, month and day folder layout, creating the missing folders and prefixed notes for the periods when Obsidian was not opened. A backfilled file can carry the original note date through a placeholder, which also accepts an inline format such as YYYY-MM-DD.

```cue
plugin: {
    id:     "auto-journal"
    name:   "Auto Journal"
    author: "ebonsignori"
    repo:   "ebonsignori/obsidian-auto-journal"

    html_url:    "https://community.obsidian.md/plugins/auto-journal"
    github_url:  "https://github.com/ebonsignori/obsidian-auto-journal"
    description: "Opinionated journaling automation like daily notes but with backfills for the days when Obsidian wasn't opened."
    about:       "Backfill daily and monthly notes into a fixed YEAR/MONTH/DAY folder layout, creating missing folders and prefixed notes for days or months you missed. Insert the original note date in backfilled files using {{auto-journal-date}} with optional inline formats like {{auto-journal-date:YYYY-MM-DD}}."

    stats: {
        downloads:  5722
        updated_at: 1759030509000
    }
}
```

[^template]: [[Obsidian plugin]]
