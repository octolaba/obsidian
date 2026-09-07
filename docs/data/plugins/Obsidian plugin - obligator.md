---
uid: 2cb8c053-3a7e-56ea-a6d1-c58037313ace
xid:
  - obligator
aliases:
  - obligator
  - Obligator
  - newbrict/obsidian-obligator
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obligator
alt:
  - https://github.com/newbrict/obsidian-obligator
downloads: 12816
updated at: "2024-01-16T17:45:59Z"
related to:
  - "[[GitHub - 651248602]]"
remind me:
---

# Obligator

Replaces the built-in daily notes plugin with a dated-note workflow that carries unchecked to-do items into each new daily note, preserving headings and formatting, and adds any scheduled items. Template macros such as {{date}}, {{previous_note}} and {{next_note}} add backlinks, {{obligate}} defines recurring to-dos in a simplified cron-style syntax, and notes can be organized in nested date folders.

```cue
plugin: {
    id:     "obligator"
    name:   "Obligator"
    author: "newbrict"
    repo:   "newbrict/obsidian-obligator"

    html_url:    "https://community.obsidian.md/plugins/obligator"
    github_url:  "https://github.com/newbrict/obsidian-obligator"
    description: "A fully featured replacement for the built-in daily notes plugin. Obligator functions like a virtual bullet journal by copying over unchecked to-do items to your new daily note, along with adding any scheduled items you've set up."
    about:       "Replace the built-in Daily Notes with a dated-note workflow that copies unchecked todos, preserves headings and formatting, and carries scheduled items into each new daily note. Use template macros like {{date}}, {{previous_note}}, {{next_note}}, and {{obligate * * *}} to add backlinks, create recurring to-dos with a simplified cron-style syntax, and organize notes in nested date folders."

    stats: {
        downloads:  12816
        updated_at: 1705427159000
    }
}
```

[^template]: [[Obsidian plugin]]
