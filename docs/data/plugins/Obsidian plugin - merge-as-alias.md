---
uid: a63cc8a7-b33c-55d7-b485-fb2666dbe841
xid:
  - merge-as-alias
aliases:
  - merge-as-alias
  - Merge as Alias
  - quietbyday/obsidian-merge-as-alias
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/merge-as-alias
alt:
  - https://github.com/quietbyday/obsidian-merge-as-alias
downloads: 1180
updated at: "2026-07-12T20:07:38Z"
related to:
  - "[[GitHub - 1198995444]]"
remind me:
---

# Merge as Alias

Merges one note into another and turns the original title into an alias on the target, rewriting every internal link so it points at the target while the old name is preserved. Content and YAML frontmatter are combined under configurable rules for list and text fields, avoiding duplicate values. The target note is opened after the merge.

```cue
plugin: {
    id:     "merge-as-alias"
    name:   "Merge as Alias"
    author: "quietbyday"
    repo:   "quietbyday/obsidian-merge-as-alias"

    html_url:    "https://community.obsidian.md/plugins/merge-as-alias"
    github_url:  "https://github.com/quietbyday/obsidian-merge-as-alias"
    description: "Merge one note into another while adding the old name as an alias and updating all internal links. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Merge a note into another and convert the original title into an alias while updating every internal link to point to the target with the old name preserved. Combine content and YAML frontmatter with configurable rules for lists and text fields, avoiding duplicates. Open the target note automatically after merging."

    stats: {
        downloads:  1180
        updated_at: 1783886858000
    }
}
```

[^template]: [[Obsidian plugin]]
