---
uid: daded68e-a504-57e2-805f-1939968b77c6
xid:
  - outline-hoist
aliases:
  - outline-hoist
  - Hoist
  - michaelwelch/obsidian-hoist
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/outline-hoist
alt:
  - https://github.com/michaelwelch/obsidian-hoist
downloads: 19
updated at: "2026-08-05T14:58:59Z"
related to:
  - "[[GitHub - 1317671189]]"
remind me:
---

# Hoist

Displays values taken from nested list items on their parent line, using a lightweight placeholder template that resolves into a computed summary. The resolved summary is shown when the parent is collapsed and the template is displayed faintly while editing. Nested keys are resolved through dot-paths up to 50 levels deep, so the data stays in the outline itself.

```cue
plugin: {
    id:     "outline-hoist"
    name:   "Hoist"
    author: "Michael"
    repo:   "michaelwelch/obsidian-hoist"

    html_url:    "https://community.obsidian.md/plugins/outline-hoist"
    github_url:  "https://github.com/michaelwelch/obsidian-hoist"
    description: "Displays values from nested list items on their parent line using placeholder templates. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Hoist values from child bullets into the parent via a lightweight template and render a computed summary on the parent line. Display the resolved summary when collapsed, show the template faintly while editing, and resolve nested keys with dot-paths up to 50 levels so data stays in the outline."

    stats: {
        downloads:  19
        updated_at: 1785941939000
    }
}
```

[^template]: [[Obsidian plugin]]
