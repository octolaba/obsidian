---
uid: f3bdf442-798d-5030-aae5-3e0bf01fea2c
xid:
  - schema-refactor
aliases:
  - schema-refactor
  - Schema Refactor
  - mmortise/obsidian-vault-schema-refactor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/schema-refactor
alt:
  - https://github.com/mmortise/obsidian-vault-schema-refactor
downloads:
updated at:
related to:
  - "[[GitHub - 1331688606]]"
remind me:
---

# Schema Refactor

Renames a top-level frontmatter property across the vault and updates the exact Obsidian Bases references to it in filters, formulas, summaries, sorting, grouping and columns. Every affected file and its diff can be previewed, uncertain matches are flagged for manual review, and conflicts or exclusions are resolved per file. Local snapshots, verified writes and rollback on failure back the operation.

```cue
plugin: {
    id:     "schema-refactor"
    name:   "Schema Refactor"
    author: "xi see"
    repo:   "mmortise/obsidian-vault-schema-refactor"

    html_url:    "https://community.obsidian.md/plugins/schema-refactor"
    github_url:  "https://github.com/mmortise/obsidian-vault-schema-refactor"
    description: "Safely rename properties across Markdown frontmatter and Bases references. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Rename top-level frontmatter properties across your vault and update exact Obsidian Bases references in filters, formulas, summaries, sorting, grouping and columns. Preview every affected file and diff, flag uncertain matches for manual review, resolve per-file conflicts or exclusions, and use local snapshots with verified writes and rollback on failure."
}
```

[^template]: [[Obsidian plugin]]
