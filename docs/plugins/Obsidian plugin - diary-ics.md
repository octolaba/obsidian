---
uid: b56a5afc-469d-56ab-bbea-469f2a6fcc5c
xid:
  - diary-ics
aliases:
  - diary-ics
  - Diary ICS
  - mousebomb/obsidian-diary-ics
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/diary-ics
alt:
  - https://github.com/mousebomb/obsidian-diary-ics
downloads: 426
updated at: "2025-11-04T03:20:22Z"
related to:
  - "[[GitHub - 983311909]]"
remind me:
---

# Diary ICS

Generates a local .ics calendar feed from daily notes so entries can be picked up by system calendars. Headings are parsed as dated events, time-aware or all-day, with subheading content used as the description and clickable obsidian links included. Frontmatter fields can be appended to the event details.

```cue
plugin: {
    id:     "diary-ics"
    name:   "Diary ICS"
    author: "mousebomb"
    repo:   "mousebomb/obsidian-diary-ics"

    html_url:    "https://community.obsidian.md/plugins/diary-ics"
    github_url:  "https://github.com/mousebomb/obsidian-diary-ics"
    description: "Sync diary entries to system calendar via ICS feed."
    about:       "Generate a local .ics calendar feed from Obsidian daily notes and sync entries with system calendars. Parse headings as dated events (time-aware or all-day), include clickable obsidian:// links and subheading content as descriptions, and append frontmatter fields into event details."

    stats: {
        downloads:  426
        updated_at: 1762226422000
    }
}
```

[^template]: [[Obsidian plugin]]
