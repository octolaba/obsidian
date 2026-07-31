---
uid: 2267b790-98b6-5f94-af80-b8ff8adc8e59
xid:
  - explorer-property-attributes
aliases:
  - explorer-property-attributes
  - Mark as Read
  - hemy301/explorer-property-attributes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/explorer-property-attributes
alt:
  - https://github.com/hemy301/explorer-property-attributes
downloads: 102
updated at: "2026-07-03T18:36:30Z"
related to:
  - "[[GitHub - 1287524036]]"
remind me:
---

# Mark as Read

Marks a note as read or done from a footer bar carrying a checkbox per done-property, after which the file explorer grays the note out and shows a green checkmark. Every frontmatter property is also exposed on file explorer items as a data attribute named after it, so plain CSS snippets can colour, dim or badge files by status, priority or type. Updates follow a property change immediately, and list values and non-ASCII property names are handled.

```cue
plugin: {
    id:     "explorer-property-attributes"
    name:   "Mark as Read"
    author: "Maksim Volkov"
    repo:   "hemy301/explorer-property-attributes"

    html_url:    "https://community.obsidian.md/plugins/explorer-property-attributes"
    github_url:  "https://github.com/hemy301/explorer-property-attributes"
    description: "Mark a note read or done with one click and see it in the file explorer: finished notes are grayed out with a checkmark. Any frontmatter property can style files via CSS snippets, updated instantly. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Mark a note read or done with one click: every note gets a footer bar with a checkbox per done-property, and finished notes are instantly grayed out with a green checkmark in the file explorer. Works out of the box — mark one note once, and any note in the vault can be marked with one click. For custom styling, every frontmatter property is exposed as a data-link-<property> attribute on file-explorer items, so plain CSS snippets can color, dim or badge files by status, priority or type. Updates are instant when a property changes; list values and non-ASCII property names are supported."

    stats: {
        downloads:  102
        updated_at: 1783103790000
    }
}
```

[^template]: [[Obsidian plugin]]
