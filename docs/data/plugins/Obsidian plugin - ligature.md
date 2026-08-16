---
uid: 91475eee-d2b6-5657-83b6-296f0268f994
xid:
  - ligature
aliases:
  - ligature
  - Ligature
  - pmgwork/obsidian-ligature
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ligature
alt:
  - https://github.com/pmgwork/obsidian-ligature
downloads: 59
updated at: "2026-07-27T17:51:16Z"
related to:
  - "[[GitHub - 1314122894]]"
remind me:
---

# Ligature

Replaces typed character sequences with Unicode symbols as they are entered, writing the symbol into the Markdown source so the substitution persists outside Obsidian. Default rules cover arrows and comparison operators, and further rules can be defined. Protected contexts such as YAML frontmatter, code, math, HTML and link destinations are skipped, and a single undo restores the original input.

```cue
plugin: {
    id:     "ligature"
    name:   "Ligature"
    author: "Pixel"
    repo:   "pmgwork/obsidian-ligature"

    html_url:    "https://community.obsidian.md/plugins/ligature"
    github_url:  "https://github.com/pmgwork/obsidian-ligature"
    description: "Replace typed character sequences with Unicode symbols while preserving protected Markdown contexts. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Replace typed character sequences with real Unicode symbols immediately in the Markdown source so replacements persist outside Obsidian. Provide default arrow and comparison rules, allow custom rules, skip protected contexts (YAML, code, math, HTML, link destinations), and restore the original input with a single Undo."

    stats: {
        downloads:  59
        updated_at: 1785174676000
    }
}
```

[^template]: [[Obsidian plugin]]
