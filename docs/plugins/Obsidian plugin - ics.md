---
uid: 5e820178-0738-5696-9ac9-db9ef1f4f446
xid:
  - ics
aliases:
  - ics
  - ICS Calendar
  - open-horizon-labs/obsidian-ics
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ics
alt:
  - https://github.com/open-horizon-labs/obsidian-ics
downloads: 27909
updated at: "2025-09-26T19:24:11Z"
related to:
  - "[[GitHub - 373940609]]"
remind me:
---

# ICS Calendar

ICS Calendar imports events from calendar or ICS URLs into the daily note on demand, using the date of the currently open daily or periodic note. A getEvents call accepts date strings, moment objects or Date objects, and a vdir local calendar cache speeds up lookups. The output is meant to be combined with Dataview, Templater or Day Planner.

```cue
plugin: {
    id:     "ics"
    name:   "ICS Calendar"
    author: "open-horizon-labs"
    repo:   "open-horizon-labs/obsidian-ics"

    html_url:    "https://community.obsidian.md/plugins/ics"
    github_url:  "https://github.com/open-horizon-labs/obsidian-ics"
    description: "Add events from calendar ics on the web to daily notes on demand. Includes vdir support. Daily Planner, Templater and Dataview friendly."
    about:       "Import events from calendar/ICS URLs into your Daily Note on demand using the date of the currently open daily or periodic note. Call getEvents() with date strings, moment, or Date objects, leverage vdir local calendar cache for speed, and integrate output with Dataview, Templater, or Day Planner."

    stats: {
        downloads:  27909
        updated_at: 1758914651000
    }
}
```

[^template]: [[Obsidian plugin]]
