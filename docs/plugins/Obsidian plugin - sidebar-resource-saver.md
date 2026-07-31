---
uid: f2ec93ef-489b-5f83-b533-e6419cfe3a84
xid:
  - sidebar-resource-saver
aliases:
  - sidebar-resource-saver
  - Sidebar Resource Saver
  - kjh-portfolio/202606-sidebar-resource-saver
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sidebar-resource-saver
alt:
  - https://github.com/kjh-portfolio/202606-sidebar-resource-saver
downloads: 114
updated at: "2026-07-09T15:27:37Z"
related to:
  - "[[GitHub - 1284980130]]"
remind me:
---

# Sidebar Resource Saver

Sidebar Resource Saver suspends webviews and iframes inside collapsed sidebars so they stop consuming RAM and CPU. Collapses are detected by a lightweight polling system, hidden webviews are swept across the DOM, events are shielded so other plugins cannot overwrite the suspended pages, and the exact page is restored when the sidebar expands.

```cue
plugin: {
    id:     "sidebar-resource-saver"
    name:   "Sidebar Resource Saver"
    author: "KJH"
    repo:   "kjh-portfolio/202606-sidebar-resource-saver"

    html_url:    "https://community.obsidian.md/plugins/sidebar-resource-saver"
    github_url:  "https://github.com/kjh-portfolio/202606-sidebar-resource-saver"
    description: "Automatically suspends unused webviews and iframes in collapsed sidebars to drastically save RAM and CPU usage. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Suspend webviews and iframes in Obsidian sidebars when they’re collapsed to free RAM and CPU. Detect collapses with an ultra-lightweight polling system, sweep hidden webviews across the DOM, shield events to prevent external plugins from overwriting pages, and automatically restore the exact page when expanded."

    stats: {
        downloads:  114
        updated_at: 1783610857000
    }
}
```

[^template]: [[Obsidian plugin]]
