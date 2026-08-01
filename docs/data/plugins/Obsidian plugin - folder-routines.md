---
uid: f41da7d2-edc7-55f2-88eb-ca0eeb077819
xid:
  - folder-routines
aliases:
  - folder-routines
  - Pixel Habits
  - shabbirpatheria/folder-routines
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/folder-routines
alt:
  - https://github.com/shabbirpatheria/folder-routines
downloads: 126
updated at: "2026-07-23T03:32:26Z"
related to:
  - "[[GitHub - 1280130404]]"
remind me:
---

# Pixel Habits

Renders an interactive collapsible checklist in the daily note from a folder structure, where each subfolder is a section and each note is an item. Checking an item appends the daily note's date to the entries property in that note's frontmatter and unchecking removes it, with checked items struck through. The date is parsed from the filename of the daily note.

```cue
plugin: {
    id:     "folder-routines"
    name:   "Pixel Habits"
    author: "shabbirpatheria"
    repo:   "shabbirpatheria/folder-routines"

    html_url:    "https://community.obsidian.md/plugins/folder-routines"
    github_url:  "https://github.com/shabbirpatheria/folder-routines"
    description: "Render a checklist in your daily note from a folder structure. Checking an item logs the daily note's date into that note's 'entries' property. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render an interactive, collapsible checklist in your daily note from a folder structure, using each subfolder as a section and each note as an item. Append the daily note’s date to a checked note’s frontmatter entries and remove it on uncheck; show checked items with strikethrough. Parse the daily note date from its filename to record entries accurately."

    stats: {
        downloads:  126
        updated_at: 1784777546000
    }
}
```

[^template]: [[Obsidian plugin]]
