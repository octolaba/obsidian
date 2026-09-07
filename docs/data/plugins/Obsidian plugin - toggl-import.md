---
uid: 617e35d2-350e-5e8d-910c-2bb90543ed51
xid:
  - toggl-import
aliases:
  - toggl-import
  - Toggl Import
  - theaspect/obsidian-toggl
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/toggl-import
alt:
  - https://github.com/theaspect/obsidian-toggl
downloads: 89
updated at: "2026-04-18T03:52:25Z"
related to:
  - "[[GitHub - 1209214289]]"
remind me:
---

# Toggl Import

Toggl Import pulls Toggl Track time entries into a daily note whose filename carries the matching date, inserting them at the cursor with a single command. The output can be a Markdown table, plain text with a configurable delimiter, or a custom template using description, start, duration, tags and project placeholders, with sortable and selectable columns. The API token is stored locally and repeated imports append only the new entries.

```cue
plugin: {
    id:     "toggl-import"
    name:   "Toggl Import"
    author: "theaspect"
    repo:   "theaspect/obsidian-toggl"

    html_url:    "https://community.obsidian.md/plugins/toggl-import"
    github_url:  "https://github.com/theaspect/obsidian-toggl"
    description: "Import Toggl Track time entries into daily notes with a single command. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import Toggl Track time entries into a daily note based on its yyyy-mm-dd filename and insert them at the cursor. Choose Markdown table, plain text (configurable delimiter), or a custom template with $description, $start, $duration, $tags, $project placeholders; sort and select columns; store your API token locally; append new entries on repeat imports."

    stats: {
        downloads:  89
        updated_at: 1776484345000
    }
}
```

[^template]: [[Obsidian plugin]]
