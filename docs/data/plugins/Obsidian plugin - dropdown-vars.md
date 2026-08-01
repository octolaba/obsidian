---
uid: 4b867b58-069b-5e18-9b2f-e5b7401b0bb3
xid:
  - dropdown-vars
aliases:
  - dropdown-vars
  - Dropdown Vars
  - majid-khonji/obsidian-dropdown-vars
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/dropdown-vars
alt:
  - https://github.com/majid-khonji/obsidian-dropdown-vars
downloads: 326
updated at: "2026-07-02T23:33:44Z"
related to:
  - "[[GitHub - 1079032667]]"
remind me:
---

# Dropdown Vars

Turns tokens written in a note, such as a status token listing Todo, In Progress and Done, into interactive dropdowns in Reading view and Live Preview. The selected value is synced either to a Dataview inline field or to YAML frontmatter, so Dataview queries and the rendered note follow the current selection.

```cue
plugin: {
    id:     "dropdown-vars"
    name:   "Dropdown Vars"
    author: "majid-khonji"
    repo:   "majid-khonji/obsidian-dropdown-vars"

    html_url:    "https://community.obsidian.md/plugins/dropdown-vars"
    github_url:  "https://github.com/majid-khonji/obsidian-dropdown-vars"
    description: "Dropdowns in Reading and Live Preview; sync to frontmatter or inline Dataview. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create interactive dropdowns in your notes using tokens such as {Status: Todo | ^In Progress | Done}. Sync selections to Dataview inline fields or YAML frontmatter so Dataview queries (e.g., = this.Status) and Live Preview reflect the current value."

    stats: {
        downloads:  326
        updated_at: 1783035224000
    }
}
```

[^template]: [[Obsidian plugin]]
