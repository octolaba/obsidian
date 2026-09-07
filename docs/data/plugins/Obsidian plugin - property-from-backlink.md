---
uid: b1aa64c8-c02b-5bfe-b168-587222dc0601
xid:
  - property-from-backlink
aliases:
  - property-from-backlink
  - Property from backlink
  - jackydangelo/obsidian-property-from-backlink
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/property-from-backlink
alt:
  - https://github.com/jackydangelo/obsidian-property-from-backlink
downloads: 46
updated at: "2026-08-09T16:39:36Z"
related to:
  - "[[GitHub - 1322214036]]"
remind me:
---

# Property from backlink

Adds a frontmatter property to every note that links to the currently open note, setting it to the source note's name. Existing values are appended to without duplicates and never overwritten, so repeated runs stay safe on a map-of-content or hub note.

```cue
plugin: {
    id:     "property-from-backlink"
    name:   "Property from backlink"
    author: "Giacomo D’angelo"
    repo:   "jackydangelo/obsidian-property-from-backlink"

    html_url:    "https://community.obsidian.md/plugins/property-from-backlink"
    github_url:  "https://github.com/jackydangelo/obsidian-property-from-backlink"
    description: "Add a frontmatter property to all notes linking to the current note. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Tag all backlinks of the open note by adding a frontmatter property set to the source note's name. Preserve existing values by appending without duplicates and never overwrite, keeping repeated runs safe for MOCs or hub notes."

    stats: {
        downloads:  46
        updated_at: 1786293576000
    }
}
```

[^template]: [[Obsidian plugin]]
