---
uid: ec9d8504-af73-51c6-b91c-c05c6ff5de63
xid:
  - dynamic-timetable
aliases:
  - dynamic-timetable
  - Dynamic Timetable
  - l7cy/obsidian-dynamic-timetable
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/dynamic-timetable
alt:
  - https://github.com/l7cy/obsidian-dynamic-timetable
downloads: 10664
updated at: "2023-10-23T03:16:28Z"
related to:
  - "[[GitHub - 612978865]]"
remind me:
---

# Dynamic Timetable

Builds a timetable from Markdown tasks that carry an estimated duration and an optional start time, and calculates the estimated completion time of each one. A task can be marked complete or interrupted, which records the actual start and duration and creates a resumed task for the remaining time. Colour coding marks gaps and conflicts against the end time of the previous task.

```cue
plugin: {
    id:     "dynamic-timetable"
    name:   "Dynamic Timetable"
    author: "l7cy"
    repo:   "l7cy/obsidian-dynamic-timetable"

    html_url:    "https://community.obsidian.md/plugins/dynamic-timetable"
    github_url:  "https://github.com/l7cy/obsidian-dynamic-timetable"
    description: "Calculate the estimated time of completion from the estimated time of the task and dynamically create a timetable."
    about:       "Generate dynamic timetables from Markdown tasks that include estimated durations and optional start times. Mark tasks complete or interrupt to record actual start and duration and automatically create resumed tasks for remaining time. Display color-coded tasks to reveal schedule gaps or conflicts against previous task end times."

    stats: {
        downloads:  10664
        updated_at: 1698030988000
    }
}
```

[^template]: [[Obsidian plugin]]
