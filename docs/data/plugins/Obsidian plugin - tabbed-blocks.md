---
uid: b7b4498f-c14e-50f2-8112-8bfc0eac9773
xid:
  - tabbed-blocks
aliases:
  - tabbed-blocks
  - Tabbed Blocks
  - quincysx/obsidian-markdown-tabs
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tabbed-blocks
alt:
  - https://github.com/quincysx/obsidian-markdown-tabs
downloads: 81
updated at: "2026-07-22T14:33:51Z"
related to:
  - "[[GitHub - 622505484]]"
remind me:
---

# Tabbed Blocks

Renders Markdown content as tabbed panels in reading mode, written as a tabs code block whose sections are separated by ---tab markers, with an asterisk on the marker naming the default tab. Each tab renders lazily, which the recorded About text attributes to avoiding hidden-content sizing issues. An overflowing tab bar can be drag-scrolled horizontally, and text before the first separator is shown as an intro above the tabs.

```cue
plugin: {
    id:     "tabbed-blocks"
    name:   "Tabbed Blocks"
    author: "Quincy"
    repo:   "quincysx/obsidian-markdown-tabs"

    html_url:    "https://community.obsidian.md/plugins/tabbed-blocks"
    github_url:  "https://github.com/quincysx/obsidian-markdown-tabs"
    description: "Turn fenced code blocks into switchable tabs, with lazy rendering and syntax aids. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Display Markdown content in tabbed panels in reading mode. Create a tabs code block using ---tab separators and mark the default with ---tab*. Render each tab lazily to avoid hidden-content sizing issues, allow horizontal drag-scroll when tabs overflow, and show text before the first ---tab as an intro above the tabs."

    stats: {
        downloads:  81
        updated_at: 1784730831000
    }
}
```

[^template]: [[Obsidian plugin]]
