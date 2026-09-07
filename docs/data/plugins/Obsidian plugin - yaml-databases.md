---
uid: b17cf344-0df8-5740-b6dd-dccf2e99d99a
xid:
  - yaml-databases
aliases:
  - yaml-databases
  - YAML Databases
  - ondreu/YAML-Databases
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/yaml-databases
alt:
  - https://github.com/ondreu/YAML-Databases
downloads: 188
updated at: "2026-07-05T16:24:04Z"
related to:
  - "[[GitHub - 1289566333]]"
remind me:
---

# YAML Databases

Treats YAML files stored as .yaml.md notes as interactive databases, editable as a spreadsheet table with drag, resize and range copy-paste, as a collapsible nested form, or as highlighted source. The leading frontmatter block is indexed as note properties, so the files work with Bases and metadata queries, while the body stays plain YAML that diffs line by line and stays readable in any editor. Sub-databases drill down with breadcrumbs, a bill of materials flattens into a parts list with rolled-up quantities, and find and replace, linting and exports to CSV, XLSX, YAML and a self-contained HTML viewer are included.

```cue
plugin: {
    id:     "yaml-databases"
    name:   "YAML Databases"
    author: "ondreu"
    repo:   "ondreu/YAML-Databases"

    html_url:    "https://community.obsidian.md/plugins/yaml-databases"
    github_url:  "https://github.com/ondreu/YAML-Databases"
    description: "YAML Databases turns YAML files into interactive Obsidian databases—edit as spreadsheet/form/raw, with sub-tables, find/replace, linting, and exports (CSV/XLSX/YAML/HTML). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "YAML Databases turns YAML files into interactive databases inside Obsidian. Edit them as a spreadsheet, a collapsible form, or raw source — with sub-tables, find & replace, linting, and exports to CSV, XLSX, YAML and a self-contained HTML viewer. Databases are stored as Markdown notes (.yaml.md): the leading --- block is indexed as frontmatter / properties, so they work with Bases and metadata queries like any other note. The body is clean YAML — human-readable, line-by-line git diff friendly, and natively readable by AI/LLMs. No binary format, no lock-in: the file is plain text usable in any editor. Built for bills of materials (kusovníky) but works for inventories, contact lists, recipes, changelogs, config or any YAML data. Highlights - Three views: Table (spreadsheet with drag, resize, range copy/paste), Form (nested tree), Source (highlighted YAML) - Sub-databases with drill-down breadcrumbs — BOM trees with sub-assemblies - Flatten BOM → flat parts list with quantities rolled"

    stats: {
        downloads:  188
        updated_at: 1783268644000
    }
}
```

[^template]: [[Obsidian plugin]]
