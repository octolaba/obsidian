---
uid: fef7a171-fdbf-5ba4-bbe0-98dcf9b73c15
xid:
  - obsidian-habit-tracker
aliases:
  - obsidian-habit-tracker
  - Habit Tracker
  - duoani/obsidian-habit-tracker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-habit-tracker
alt:
  - https://github.com/duoani/obsidian-habit-tracker
downloads: 18986
updated at: "2021-09-17T16:21:24Z"
related to:
  - "[[GitHub - 378315793]]"
remind me:
---

# Habit Tracker

Renders a monthly punchboard for visualizing habit records from a habitt code block. The month is given as a parameter to produce the calendar view, and each day is annotated with tags or emojis, defaulting to a checkmark when none is supplied. Links or images can be included through HTML.

```cue
plugin: {
    id:     "obsidian-habit-tracker"
    name:   "Habit Tracker"
    author: "duoani"
    repo:   "duoani/obsidian-habit-tracker"

    html_url:    "https://community.obsidian.md/plugins/obsidian-habit-tracker"
    github_url:  "https://github.com/duoani/obsidian-habit-tracker"
    description: "Create a simple month view for visualizing your punch records."
    about:       "Display a monthly punchboard for visualizing habit check-ins using a simple habitt code block. Specify the month with [month:YYYY-MM] to render a calendar view. Annotate days with tags or emojis (defaults to a checkmark when omitted) and optionally include links or images via HTML."

    stats: {
        downloads:  18986
        updated_at: 1631895684000
    }
}
```

[^template]: [[Obsidian plugin]]
