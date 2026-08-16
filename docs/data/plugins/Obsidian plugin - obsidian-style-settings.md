---
uid: 7ad03e7b-7f74-57fd-97f6-f66ab090fd18
xid:
  - obsidian-style-settings
aliases:
  - obsidian-style-settings
  - Style Settings
  - obsidian-community/obsidian-style-settings
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-style-settings
alt:
  - https://github.com/obsidian-community/obsidian-style-settings
downloads: 2579295
updated at: "2024-08-24T17:45:16Z"
related to:
  - "[[GitHub - 352429422]]"
remind me:
---

# Style Settings

CSS settings declared by themes, snippets and plugins are gathered into a single settings pane. A CSS file declares them as YAML inside a /* @settings */ comment, exposing classes to toggle on the body along with numeric, text and color CSS variables.

```cue
plugin: {
    id:     "obsidian-style-settings"
    name:   "Style Settings"
    author: "obsidian-community"
    repo:   "obsidian-community/obsidian-style-settings"

    html_url:    "https://community.obsidian.md/plugins/obsidian-style-settings"
    github_url:  "https://github.com/obsidian-community/obsidian-style-settings"
    description: "Adjust theme, plugin, and snippet CSS variables."
    about:       "Display all theme, snippet, and plugin CSS settings in a single settings pane. Toggle classes on the body and configure numeric, text, and color CSS variables declared via /* @settings */ YAML comments in your CSS files."

    stats: {
        downloads:  2579295
        updated_at: 1724521516000
    }
}
```

[^template]: [[Obsidian plugin]]
