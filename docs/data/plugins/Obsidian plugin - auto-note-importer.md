---
uid: 0a7e1dae-a84c-5245-b4a3-4f435fafd2c1
xid:
  - auto-note-importer
aliases:
  - auto-note-importer
  - Auto Note Importer
  - uppinote20/obsidian-auto-note-importer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-note-importer
alt:
  - https://github.com/uppinote20/obsidian-auto-note-importer
downloads: 2027
updated at: "2026-08-07T12:49:06Z"
related to:
  - "[[GitHub - 973054503]]"
remind me:
---

# Auto Note Importer

Auto Note Importer syncs notes in both directions between the vault and Airtable, SeaTable or Supabase, mapping fields including formulas, rollups, lookups and computed columns and detecting read-only ones so they are not overwritten. Filenames are generated from a chosen text, number or select column, notes are filed into subfolders by field value, and templates with nested-property access shape frontmatter for Bases and Dataview. Several sync configurations run side by side, each with its own conflict resolution — manual, Obsidian wins or remote wins — on demand, on file change or on a schedule, and after a push the plugin can wait for the remote to recompute formulas before pulling values back.

```cue
plugin: {
    id:     "auto-note-importer"
    name:   "Auto Note Importer"
    author: "uppinote20"
    repo:   "uppinote20/obsidian-auto-note-importer"

    html_url:    "https://community.obsidian.md/plugins/auto-note-importer"
    github_url:  "https://github.com/uppinote20/obsidian-auto-note-importer"
    description: "Sync notes bidirectionally between your vault and Airtable, SeaTable, or Supabase databases."
    about:       "Sync notes bidirectionally between your Obsidian vault and Airtable, SeaTable, or Supabase databases — point-and-click setup with no code required. Smart field mapping handles formulas, rollups, lookups, and computed columns; read-only fields are auto-detected so you never accidentally overwrite them. Generate safe filenames from any text/number/select column, and organize notes into subfolders based on a field value. Apply customizable {{fieldName}} templates with nested-property access. Run multiple sync configurations side-by-side (different bases, tables, or providers — even mix Airtable and Supabase in the same vault). Choose conflict resolution per config: manual, Obsidian wins, or remote wins. Sync on demand, on file change, or on a schedule. After pushing, the plugin can wait for the remote to recompute formulas before pulling values back. Frontmatter output is tuned for Obsidian Bases and Dataview. Desktop and mobile supported."

    stats: {
        downloads:  2027
        updated_at: 1786106946000
    }
}
```

[^template]: [[Obsidian plugin]]
