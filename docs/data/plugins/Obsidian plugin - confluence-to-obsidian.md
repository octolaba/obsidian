---
uid: d5c45ba9-ed2b-5ff8-bf76-f020b97df2db
xid:
  - confluence-to-obsidian
aliases:
  - confluence-to-obsidian
  - Confluence Import
  - kkei34/confluence-to-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/confluence-to-obsidian
alt:
  - https://github.com/kkei34/confluence-to-obsidian-plugin
downloads: 6868
updated at: "2024-01-26T16:17:11Z"
related to:
  - "[[GitHub - 644324883]]"
remind me:
---

# Confluence Import

Confluence Import imports an exported Confluence space into the vault, converting the exported HTML pages to Markdown with Pandoc. The space hierarchy and the attachments are preserved during the import. It is desktop-only and requires Pandoc.

```cue
plugin: {
    id:     "confluence-to-obsidian"
    name:   "Confluence Import"
    author: "kkei34"
    repo:   "kkei34/confluence-to-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/confluence-to-obsidian"
    github_url:  "https://github.com/kkei34/confluence-to-obsidian-plugin"
    description: "Import Confluence space into your vault."
    about:       "Import Confluence HTML exports into your Obsidian vault and convert pages to Markdown using Pandoc. Preserve space hierarchy and attachments while importing exported HTML folders into Obsidian (desktop only; Pandoc required)."

    stats: {
        downloads:  6868
        updated_at: 1706285831000
    }
}
```

[^template]: [[Obsidian plugin]]
