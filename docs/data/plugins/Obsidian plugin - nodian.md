---
uid: 0e3b43f0-f669-510a-a6d0-233f9c41b530
xid:
  - nodian
aliases:
  - nodian
  - Nodian
  - akisantin/Nodian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nodian
alt:
  - https://github.com/akisantin/Nodian
downloads: 1344
updated at: "2026-06-12T13:24:33Z"
related to:
  - "[[GitHub - 1221508999]]"
remind me:
---

# Nodian

Nodian keeps YAML frontmatter relations bidirectional, adding and removing the matching backlink on the other note as wikilinks are created or deleted. Field pairs are declared with tag-based matching, titles can be used as display text, newly created files are handled, and a full vault sync runs on desktop and mobile. The recorded description positions it alongside Obsidian Bases: requiring tags on both sides of a relation pair keeps relations scoped to the correct Base and stops fields with the same name syncing to the wrong type of note.

```cue
plugin: {
    id:     "nodian"
    name:   "Nodian"
    author: "Aki"
    repo:   "akisantin/Nodian"

    html_url:    "https://community.obsidian.md/plugins/nodian"
    github_url:  "https://github.com/akisantin/Nodian"
    description: "YAML bidirectional relation — automatically sync backlinks in frontmatter fields. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync bidirectional YAML frontmatter relations across notes by adding and removing corresponding backlinks when you create or delete wikilinks. Define paired fields with tag-based matching, use title as display text, handle newly created files, and run a full vault sync on desktop or mobile. Nodian is especially useful with Obsidian Bases. You can build separate Bases for different note types, such as Person, Mail, Company, or Song, and connect them through YAML relation fields. By requiring tags on both sides of each relation pair, Nodian keeps relations scoped to the correct Base and prevents fields with the same name from syncing to the wrong type of note."

    stats: {
        downloads:  1344
        updated_at: 1781270673000
    }
}
```

[^template]: [[Obsidian plugin]]
