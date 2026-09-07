---
uid: 9177e18c-df58-5b16-9b80-f90eedf43e6a
xid:
  - style-context
aliases:
  - style-context
  - Style Context
  - moyf/style-context
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/style-context
alt:
  - https://github.com/moyf/style-context
downloads: 177
updated at: "2026-08-07T15:02:51Z"
related to:
  - "[[GitHub - 1311994217]]"
remind me:
---

# Style Context

Collects helpers for working with CSS snippets and themes. Local images can be registered as CSS variables, with a shortcut for setting a background image across the whole vault. The current theme is written onto the body element so snippets can target a specific theme, and cssclasses can be added automatically for notes in particular folders.

```cue
plugin: {
    id:     "style-context"
    name:   "Style Context"
    author: "Moy"
    repo:   "moyf/style-context"

    html_url:    "https://community.obsidian.md/plugins/style-context"
    github_url:  "https://github.com/moyf/style-context"
    description: "A CSS snippet helper. Register local images as CSS variables, quickly set vault backgrounds, expose the current theme on body for theme-specific styling, and auto-add cssclasses per folder. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "This plugin provides a variety of convenient features related to CSS Snippets and themes, making it ideal for users who enjoy customizing the appearance of Obsidian. What can it do? It includes three main features: 1. Register image variables Besides, the plugin provides a convenient way to set a background image for your entire vault. 2. Add the current theme to the `body` element 3. Enhanced `cssclasses` for specific folders."

    stats: {
        downloads:  177
        updated_at: 1786114971000
    }
}
```

[^template]: [[Obsidian plugin]]
