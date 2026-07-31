---
uid: b0658c80-97b5-5696-a789-1722497a97cf
xid:
  - ics-calendar-viewer
aliases:
  - ics-calendar-viewer
  - ICS Calendar Viewer
  - viggomeesters/obsidian-ics-calendar-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ics-calendar-viewer
alt:
  - https://github.com/viggomeesters/obsidian-ics-calendar-viewer
downloads: 101
updated at: "2026-06-08T18:15:39Z"
related to:
  - "[[GitHub - 1262611957]]"
remind me:
---

# ICS Calendar Viewer

ICS Calendar Viewer opens local ics files as a read-only inspector with component summaries, grouped event and task lists, and text and date filters. Fields such as summary, description, location, organizer, attendees, start and end, UID, status and recurrence are shown, with warnings where recurrence or timezone handling is uncertain. Parse and render caps bound large files, and the raw source is shown when a parsing limit is reached.

```cue
plugin: {
    id:     "ics-calendar-viewer"
    name:   "ICS Calendar Viewer"
    author: "Viggo Meesters"
    repo:   "viggomeesters/obsidian-ics-calendar-viewer"

    html_url:    "https://community.obsidian.md/plugins/ics-calendar-viewer"
    github_url:  "https://github.com/viggomeesters/obsidian-ics-calendar-viewer"
    description: "Open local .ics files as a read-only event inspection view with source fallback. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open local .ics files as a read-only inspector with component summaries, grouped event and task lists, text/date filters, and detailed fields (summary, description, location, organizer, attendees, start/end, UID, status, recurrence). Show recurrence and timezone warnings, fall back to raw source when parsing limits are hit, and keep large files bounded with parse/render caps."

    stats: {
        downloads:  101
        updated_at: 1780942539000
    }
}
```

[^template]: [[Obsidian plugin]]
