---
uid: 7217d905-3947-5b41-baf3-341d79503dcc
xid:
  - diary-linker
aliases:
  - diary-linker
  - Diary Linker
  - yhfs21/diary-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/diary-linker
alt:
  - https://github.com/yhfs21/diary-linker
downloads: 145
updated at: "2026-05-19T15:32:06Z"
related to:
  - "[[GitHub - 1151305589]]"
remind me:
---

# Diary Linker

Diary Linker adds a calendar view over daily notes, where clicking a date opens or creates the note for that day. It builds a year, month and day folder structure and maintains parent links from the root down to the day note. A template is applied with the diary-link, title, date and time placeholders replaced.

```cue
plugin: {
    id:     "diary-linker"
    name:   "Diary Linker"
    author: "yhfs21"
    repo:   "yhfs21/diary-linker"

    html_url:    "https://community.obsidian.md/plugins/diary-linker"
    github_url:  "https://github.com/yhfs21/diary-linker"
    description: "Link daily notes to related entries. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Add a calendar view for daily notes and open or create a note by clicking a date. Build a year/month/day folder structure, maintain parent links (root→year→month→day), and apply a template that replaces {{diary-link}}, {{title}}, {{date}}, and {{time}}."

    stats: {
        downloads:  145
        updated_at: 1779204726000
    }
}
```

[^template]: [[Obsidian plugin]]
