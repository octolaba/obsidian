---
uid: 530d3db3-5847-590a-85a6-17be130b0b91
xid:
  - daily-note-carryover
aliases:
  - daily-note-carryover
  - Daily Note Carryover
  - seiichi1101/obsidian-daily-note-carryover
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/daily-note-carryover
alt:
  - https://github.com/seiichi1101/obsidian-daily-note-carryover
downloads: 14
updated at: "2026-08-08T08:57:00Z"
related to:
  - "[[GitHub - 1327503270]]"
remind me:
---

# Daily Note Carryover

Creates today's daily note at a scheduled time by copying yesterday's note verbatim, frontmatter included. It runs once a day, never overwrites an existing note, and creates nothing if yesterday's note is missing. The day is marked as done after a scheduled run, so a deleted note is not silently recreated.

```cue
plugin: {
    id:     "daily-note-carryover"
    name:   "Daily Note Carryover"
    author: "Seiichi Arai"
    repo:   "seiichi1101/obsidian-daily-note-carryover"

    html_url:    "https://community.obsidian.md/plugins/daily-note-carryover"
    github_url:  "https://github.com/seiichi1101/obsidian-daily-note-carryover"
    description: "Creates today's daily note at a scheduled time by copying yesterday's daily note. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create today's daily note at a scheduled time by copying yesterday's note verbatim, including frontmatter. Run once per day and never overwrite existing notes or create content if yesterday's note doesn't exist. Mark the day as done after a scheduled run so deleted notes aren't silently recreated."

    stats: {
        downloads:  14
        updated_at: 1786179420000
    }
}
```

[^template]: [[Obsidian plugin]]
