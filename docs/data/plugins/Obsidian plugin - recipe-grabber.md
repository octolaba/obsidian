---
uid: 6b2781a8-8247-561b-8fc0-71d7980b837f
xid:
  - recipe-grabber
aliases:
  - recipe-grabber
  - Recipe Grabber
  - seethroughdev/obsidian-recipe-grabber
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/recipe-grabber
alt:
  - https://github.com/seethroughdev/obsidian-recipe-grabber
downloads: 11590
updated at: "2024-06-05T16:17:03Z"
related to:
  - "[[GitHub - 634018377]]"
remind me:
---

# Recipe Grabber

Takes a recipe URL pasted into a note and extracts the recipe's ingredients, steps, image, and a link back to the original page. Recipe images can be saved into the vault, and the output is customizable with Handlebars templates and helpers for tags and time, or can include the raw JSON for manual editing.

```cue
plugin: {
    id:     "recipe-grabber"
    name:   "Recipe Grabber"
    author: "seethroughdev"
    repo:   "seethroughdev/obsidian-recipe-grabber"

    html_url:    "https://community.obsidian.md/plugins/recipe-grabber"
    github_url:  "https://github.com/seethroughdev/obsidian-recipe-grabber"
    description: "Quickly grab the important contents of any online recipe."
    about:       "Paste a recipe URL into a note and extract a concise recipe with ingredients, steps, image and a link back to the original page. Save recipe images into your vault and customize output with Handlebars templates, helpers for tags and time, or include raw JSON for manual tweaks."

    stats: {
        downloads:  11590
        updated_at: 1717604223000
    }
}
```

[^template]: [[Obsidian plugin]]
