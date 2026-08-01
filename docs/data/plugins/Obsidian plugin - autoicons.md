---
uid: 649698e6-69b5-57fa-8f64-d3411509740c
xid:
  - autoicons
aliases:
  - autoicons
  - AutoIcons
  - anuzdhk/autoicon
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/autoicons
alt:
  - https://github.com/anuzdhk/autoicon
downloads:
updated at:
related to:
  - "[[GitHub - 1305816608]]"
remind me:
---

# AutoIcons

AutoIcons assigns icons to files and folders in the file explorer, resolving them in a fixed priority order: frontmatter, then custom rules matching path, extension, name or regex, then default icons by file type. Icons are picked from Obsidian's Lucide set through a searchable picker and written into frontmatter, and four further sets are bundled — Unicons, Unicons Monochrome, Cuida Icons and Material Symbols Outlined. Choosing an icon style re-skins every automatic icon at once, while frontmatter and custom rules may still name an icon from any pack.

```cue
plugin: {
    id:     "autoicons"
    name:   "AutoIcons"
    author: "Anuj Dhakal"
    repo:   "anuzdhk/autoicon"

    html_url:    "https://community.obsidian.md/plugins/autoicons"
    github_url:  "https://github.com/anuzdhk/autoicon"
    description: "Automatically adds icons to files and folders based on frontmatter, custom rules, and file type. auto icon - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Add icons automatically to files and folders in the file explorer using frontmatter, custom rules, or sensible defaults by file type. Resolve icons in priority order: frontmatter → custom rules (path, extension, name, regex) → default type icons. Pick icons from Obsidian's Lucide set and write them to frontmatter with a searchable picker. Beyond Obsidian's built-in Lucide icons, AutoIcons bundles four more icon sets — Unicons, Unicons Monochrome, Cuida Icons, and Material Symbols (Outlined) — searchable in every picker. Pick one under Icon style to re-skin every automatic icon at once; frontmatter and custom rules can still use any icon from any pack regardless of this setting."
}
```

[^template]: [[Obsidian plugin]]
