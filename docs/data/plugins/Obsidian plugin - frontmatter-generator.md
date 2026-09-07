---
uid: 2157a589-82fd-5d81-8bd6-f757750cf15a
xid:
  - frontmatter-generator
aliases:
  - frontmatter-generator
  - Frontmatter generator
  - hananoshikayomaru/Obsidian-Frontmatter-Generator
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/frontmatter-generator
alt:
  - https://github.com/hananoshikayomaru/Obsidian-Frontmatter-Generator
downloads: 4669
updated at: "2023-11-30T17:01:40Z"
related to:
  - "[[GitHub - 697120073]]"
remind me:
---

# Frontmatter generator

Generates frontmatter on save from JSON or JavaScript templates and inserts the resulting YAML into files. Templates may contain functions and Dataview expressions and can reference file, its properties and tags, dv and z; generation runs per file, per folder or across the vault, and files carrying yaml-gen-ignore are skipped.

```cue
plugin: {
    id:     "frontmatter-generator"
    name:   "Frontmatter generator"
    author: "hananoshikayomaru"
    repo:   "hananoshikayomaru/Obsidian-Frontmatter-Generator"

    html_url:    "https://community.obsidian.md/plugins/frontmatter-generator"
    github_url:  "https://github.com/hananoshikayomaru/Obsidian-Frontmatter-Generator"
    description: "Generate frontmatter for your notes from JSON and JavaScript."
    about:       "Generate frontmatter on save from JSON or JavaScript templates and insert YAML into files automatically. Use templates (including functions and Dataview expressions) that reference file, file.properties, file.tags, dv, and z; run per file, folder, or vault and skip files with yaml-gen-ignore."

    stats: {
        downloads:  4669
        updated_at: 1701363700000
    }
}
```

[^template]: [[Obsidian plugin]]
