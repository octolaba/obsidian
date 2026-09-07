---
uid: cc6ff37a-0276-587d-9570-5cf61e2d965c
xid:
  - tasknotes-review-intervals
aliases:
  - tasknotes-review-intervals
  - TaskNotes Review Intervals
  - chmac/tasknotes-review-intervals
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tasknotes-review-intervals
alt:
  - https://github.com/chmac/tasknotes-review-intervals
downloads: 155
updated at: "2026-07-01T11:53:41Z"
related to:
  - "[[GitHub - 1276812982]]"
remind me:
---

# TaskNotes Review Intervals

TaskNotes Review Intervals adds a mark-reviewed command that computes the next review date as today plus the note's review interval and writes it into the frontmatter. When a note carries no interval yet, the command prompts for one and saves it for future use. It is designed to work alongside TaskNotes but applies to any frontmatter-based note, and the review field can feed a Dataview query or a Tasks filter to build a review inbox.

```cue
plugin: {
    id:     "tasknotes-review-intervals"
    name:   "TaskNotes Review Intervals"
    author: "Callum Macdonald"
    repo:   "chmac/tasknotes-review-intervals"

    html_url:    "https://community.obsidian.md/plugins/tasknotes-review-intervals"
    github_url:  "https://github.com/chmac/tasknotes-review-intervals"
    description: "Adds review scheduling for TaskNotes tasks via a configurable review interval. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "TaskNotes Review Intervals adds a \"Mark reviewed\" command to Obsidian. Run it on any note and the plugin calculates the next review date (today + the note's interval) and writes it into the frontmatter. If the note doesn't have an interval set yet, it prompts you to enter one and saves it for future use. Designed to work alongside TaskNotes, but works with any frontmatter-based note. Pair the review field with a Dataview query or Tasks filter to build a review inbox."

    stats: {
        downloads:  155
        updated_at: 1782906821000
    }
}
```

[^template]: [[Obsidian plugin]]
