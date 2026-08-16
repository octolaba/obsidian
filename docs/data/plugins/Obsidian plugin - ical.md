---
uid: a05c6848-bc23-5721-9c0b-c412c1faa6c6
xid:
  - ical
aliases:
  - ical
  - iCal
  - andrewbrereton/obsidian-to-ical-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ical
alt:
  - https://github.com/andrewbrereton/obsidian-to-ical-plugin
downloads: 17456
updated at: "2026-07-14T02:08:24Z"
related to:
  - "[[GitHub - 709620520]]"
remind me:
---

# iCal

iCal scans the vault for Markdown checkbox tasks carrying dates in YYYY-MM-DD form and converts each into a calendar event. The generated iCalendar file is stored in the vault or on a GitHub Gist so the calendar can be shown in Outlook, Google Calendar or Apple Calendar. Task status markers for completed, to-do, in-progress and canceled are appended, and Day Planner and Obsidian Tasks formats are handled.

```cue
plugin: {
    id:     "ical"
    name:   "iCal"
    author: "andrewbrereton"
    repo:   "andrewbrereton/obsidian-to-ical-plugin"

    html_url:    "https://community.obsidian.md/plugins/ical"
    github_url:  "https://github.com/andrewbrereton/obsidian-to-ical-plugin"
    description: "Scan your vault for tasks that contain dates. Create an iCalendar file and store it in your vault or on Gist. You can then show this calendar in your Outlook, Google Calendar, Apple Calender, etc"
    about:       "Generate an iCal calendar from tasks in your vault by scanning Markdown checkboxes that contain dates (YYYY-MM-DD) and convert each task into calendar events. Export the calendar to a local file or GitHub Gist, append task status markers (completed, to-do, in-progress, canceled), and handle Day Planner and Obsidian Tasks formats."

    stats: {
        downloads:  17456
        updated_at: 1783994904000
    }
}
```

[^template]: [[Obsidian plugin]]
