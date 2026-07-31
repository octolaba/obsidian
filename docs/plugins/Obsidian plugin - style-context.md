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
downloads:
updated at:
related to:
  - "[[GitHub - 1311994217]]"
remind me:
---

# Style Context

Runtime context is published as CSS classes and variables so custom snippets have predictable hooks. Image variables are registered, which also gives a way to set a background image for the whole vault, the current theme is added to the body element, and cssclasses handling is extended for specific folders.

```cue
plugin: {
    id:     "style-context"
    name:   "Style Context"
    author: "Moy"
    repo:   "moyf/style-context"

    html_url:    "https://community.obsidian.md/plugins/style-context"
    github_url:  "https://github.com/moyf/style-context"
    description: "An Obsidian plugin that publishes runtime context as CSS classes and variables. It turns things like your current theme and vault image paths into predictable hooks for your own custom CSS snippets. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "This plugin provides a variety of convenient features related to CSS Snippets and themes, making it ideal for users who enjoy customizing the appearance of Obsidian. What can it do? It includes three main features: 1. Register image variables Besides, the plugin provides a convenient way to set a background image for your entire vault. 2. Add the current theme to the `body` element 3. Enhanced `cssclasses` for specific folders."
}
```

[^template]: [[Obsidian plugin]]
