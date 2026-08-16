---
uid: 4d6723a2-47c1-5140-8ef7-acdc62e80b21
xid:
  - daily-prefix-notes
aliases:
  - daily-prefix-notes
  - Daily Notes Prefix Matcher
  - applespriter/obsidian-daily-notes-prefix-matcher-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/daily-prefix-notes
alt:
  - https://github.com/applespriter/obsidian-daily-notes-prefix-matcher-plugin
downloads: 16
updated at: "2026-07-28T06:28:08Z"
related to:
  - "[[GitHub - 1314528622]]"
remind me:
---

# Daily Notes Prefix Matcher

Opens today's daily note by matching the configured Daily Notes date format against filename prefixes, so a descriptive filename that begins with the date is found rather than ignored. When several files match, a picker is shown; when none match, the standard exact-date note is created. The configured Daily Notes folder and date format are respected.

```cue
plugin: {
    id:     "daily-prefix-notes"
    name:   "Daily Notes Prefix Matcher"
    author: "chika"
    repo:   "applespriter/obsidian-daily-notes-prefix-matcher-plugin"

    html_url:    "https://community.obsidian.md/plugins/daily-prefix-notes"
    github_url:  "https://github.com/applespriter/obsidian-daily-notes-prefix-matcher-plugin"
    description: "Open today's daily note by matching the date prefix in its filename. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open today's daily note by matching the configured Daily Notes date format against filename prefixes. Prefer descriptive files that start with the date, show a picker when multiple matches exist, and create the standard exact-date note if none are found. Respect the configured Daily Notes folder and date format."

    stats: {
        downloads:  16
        updated_at: 1785220088000
    }
}
```

[^template]: [[Obsidian plugin]]
