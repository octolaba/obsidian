---
uid: b97ae68f-7401-542d-8680-6066e7f95933
xid:
  - checkbox-sort
aliases:
  - checkbox-sort
  - Checkbox Sort
  - mattang687/obsidian-checkbox-sort
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/checkbox-sort
alt:
  - https://github.com/mattang687/obsidian-checkbox-sort
downloads: 1772
updated at: "2025-06-25T03:12:07Z"
related to:
  - "[[GitHub - 962365329]]"
remind me:
---

# Checkbox Sort

Checkbox Sort moves a completed checkbox to the bottom of its peer group when it is toggled. Only items at the same indentation level are sorted, so nested structure survives and child items stay with their parent. Sorting is enabled or disabled globally, per file through frontmatter, and per list through a marker.

```cue
plugin: {
    id:     "checkbox-sort"
    name:   "Checkbox Sort"
    author: "mattang687"
    repo:   "mattang687/obsidian-checkbox-sort"

    html_url:    "https://community.obsidian.md/plugins/checkbox-sort"
    github_url:  "https://github.com/mattang687/obsidian-checkbox-sort"
    description: "Automatically moves completed checkboxes to the end of the list"
    about:       "Move completed checkboxes to the bottom of their peer group when toggled. Preserve nested list structure and sort only items at the same indentation level so child items stay with their parent. Respect global, file frontmatter, and per-list markers to enable or disable sorting at each scope."

    stats: {
        downloads:  1772
        updated_at: 1750821127000
    }
}
```

[^template]: [[Obsidian plugin]]
