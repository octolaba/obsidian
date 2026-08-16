---
uid: abbdeaf4-867b-5e8a-80af-bd817531f362
xid:
  - simple-tab-indent
aliases:
  - simple-tab-indent
  - Simple Tab Indent
  - hoomersinpsom/simple-tab-indent
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-tab-indent
alt:
  - https://github.com/hoomersinpsom/simple-tab-indent
downloads: 6245
updated at: "2025-04-24T19:24:19Z"
related to:
  - "[[GitHub - 972248380]]"
remind me:
---

# Simple Tab Indent

Simple Tab Indent makes the Tab key insert a zero-width space followed by a real tab, so indented lines are not treated as Markdown code blocks while true tab width is preserved. It works in Source Mode and Live Preview and exposes a setting for the rendered CSS tab width. Its recorded inputs note that tasks or list items indented this way are not recognized by Obsidian's task features, search, or task plugins.

```cue
plugin: {
    id:     "simple-tab-indent"
    name:   "Simple Tab Indent"
    author: "hoomersinpsom"
    repo:   "hoomersinpsom/simple-tab-indent"

    html_url:    "https://community.obsidian.md/plugins/simple-tab-indent"
    github_url:  "https://github.com/hoomersinpsom/simple-tab-indent"
    description: "Pressing Tab inserts a zero-width space + real tab, giving true indentation without triggering Markdown code blocks. Includes a settings panel to change the CSS tab width."
    about:       "Insert a zero-width space plus a real tab to prevent Markdown from treating indented lines as code blocks while preserving true tab width in the editor. Work in Source Mode and Live Preview and configure the rendered tab width. Note that indented tasks or list items won't be recognized by Obsidian's task features, search, or task plugins."

    stats: {
        downloads:  6245
        updated_at: 1745522659000
    }
}
```

[^template]: [[Obsidian plugin]]
