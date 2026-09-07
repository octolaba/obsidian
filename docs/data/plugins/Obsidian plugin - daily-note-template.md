---
uid: 39a341ad-c3e2-5e1a-a9ba-7d56aad40baf
xid:
  - daily-note-template
aliases:
  - daily-note-template
  - Daily Note Template
  - kdnk/obsidian-daily-note-template
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/daily-note-template
alt:
  - https://github.com/kdnk/obsidian-daily-note-template
downloads: 140
updated at: "2026-06-10T03:35:13Z"
related to:
  - "[[GitHub - 1258283878]]"
remind me:
---

# Daily Note Template

Expands dnt template expressions inside daily notes that already exist, locating each note through the Daily Notes settings and evaluating the expressions from the date in the note path. Functions such as today(), yesterday(), addDays, addWeeks, addMonths, addYears and format are evaluated for visible notes. It does not create missing notes and does not apply full daily-note templates.

```cue
plugin: {
    id:     "daily-note-template"
    name:   "Daily Note Template"
    author: "kdnk"
    repo:   "kdnk/obsidian-daily-note-template"

    html_url:    "https://community.obsidian.md/plugins/daily-note-template"
    github_url:  "https://github.com/kdnk/obsidian-daily-note-template"
    description: "Expands sync-safe daily-note template expressions based on the note date. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expand <% dnt... %> expressions inside existing daily notes, using Daily Notes settings to locate each note and the note path's date to evaluate expressions. Evaluate functions like today(), yesterday(), addDays/addWeeks/addMonths/addYears and format(...) immediately for visible notes without creating missing notes or applying full daily-note templates."

    stats: {
        downloads:  140
        updated_at: 1781062513000
    }
}
```

[^template]: [[Obsidian plugin]]
