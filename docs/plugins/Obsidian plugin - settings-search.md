---
uid: 4775fadb-b2e1-5a68-9b55-f8476df866b3
xid:
  - settings-search
aliases:
  - settings-search
  - Settings Search
  - javalent/settings-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/settings-search
alt:
  - https://github.com/javalent/settings-search
downloads: 216657
updated at: "2023-10-05T12:36:24Z"
related to:
  - "[[GitHub - 457375296]]"
remind me:
---

# Settings Search

Settings Search adds a global search across Obsidian's settings so an option can be found and opened without hunting through tabs. Results are navigated with the arrow keys and opened with Enter, and plugin authors can register dynamic settings through the addResources, removeResources and removeTabResources calls.

```cue
plugin: {
    id:     "settings-search"
    name:   "Settings Search"
    author: "javalent"
    repo:   "javalent/settings-search"

    html_url:    "https://community.obsidian.md/plugins/settings-search"
    github_url:  "https://github.com/javalent/settings-search"
    description: "Globally search settings."
    about:       "Add global search to Obsidian settings to quickly find and jump to specific options. Use keyboard navigation (arrow keys + Enter) to move through results and open a setting, and let plugin authors register dynamic settings via addResources(), removeResources(), and removeTabResources()."

    stats: {
        downloads:  216657
        updated_at: 1696509384000
    }
}
```

[^template]: [[Obsidian plugin]]
