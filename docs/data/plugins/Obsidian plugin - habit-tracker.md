---
uid: d7640ea4-7c66-5f97-b615-4ea04a21a5e2
xid:
  - habit-tracker
aliases:
  - habit-tracker
  - Habit Tracker
  - narsail/habit-tracker-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/habit-tracker
alt:
  - https://github.com/narsail/habit-tracker-obsidian
downloads: 10153
updated at: "2022-07-17T08:49:04Z"
related to:
  - "[[GitHub - 507487606]]"
remind me:
---

# Habit Tracker

Displays the habits of a calendar week as a heatmap-style tracker built from DataviewJS data in the vault's notes. Numeric intensities are mapped onto colour gradients, and up to seven habits are rendered by calling renderHabitTracker inside a DataviewJS block.

```cue
plugin: {
    id:     "habit-tracker"
    name:   "Habit Tracker"
    author: "narsail"
    repo:   "narsail/habit-tracker-obsidian"

    html_url:    "https://community.obsidian.md/plugins/habit-tracker"
    github_url:  "https://github.com/narsail/habit-tracker-obsidian"
    description: "Display the Habits of a calendar week."
    about:       "Visualize habit progress as a heatmap-style tracker using DataviewJS data from your notes. Map numeric intensities to color gradients, render up to seven habits with renderHabitTracker(), and insert the tracker inside a DataviewJS block."

    stats: {
        downloads:  10153
        updated_at: 1658047744000
    }
}
```

[^template]: [[Obsidian plugin]]
