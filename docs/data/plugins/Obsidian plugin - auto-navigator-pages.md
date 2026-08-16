---
uid: 121f9d23-138e-5d01-b2b2-fa8f5bcaf692
xid:
  - auto-navigator-pages
aliases:
  - auto-navigator-pages
  - Auto Navigator Pages
  - ccccarlos0504/auto_navigator_pages
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-navigator-pages
alt:
  - https://github.com/ccccarlos0504/auto_navigator_pages
downloads: 1
updated at: "2026-08-11T08:58:17Z"
related to:
  - "[[GitHub - 1330617649]]"
remind me:
---

# Auto Navigator Pages

Creates and maintains a navigator page named after each folder, plus a Home.md summarising top-level directories and notes. Pages update automatically when folders or notes change, and an editable description is preserved while a navigator placeholder is replaced with generated links. Templates, exclusion rules, collection of new notes under _node, workspace snapshots and cleanup of orphaned navigator pages are supported.

```cue
plugin: {
    id:     "auto-navigator-pages"
    name:   "Auto Navigator Pages"
    author: "Carlos Chen"
    repo:   "ccccarlos0504/auto_navigator_pages"

    html_url:    "https://community.obsidian.md/plugins/auto-navigator-pages"
    github_url:  "https://github.com/ccccarlos0504/auto_navigator_pages"
    description: "自动生成并维护文件夹导航页和 Home.md，支持缺失导航页创建、导航页置顶、下划线开头文件和目录沉底排序、_node 新笔记归集、排除规则、工作区快照恢复和孤立导航页清理。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create and maintain same-named navigator pages for each folder and a Home.md summarizing top-level directories and notes. Update pages automatically on folder or note changes, preserve an editable description while replacing {{navigator}} with generated links, support templates, exclusions, _node collection, snapshots and cleanup."

    stats: {
        downloads:  1
        updated_at: 1786438697000
    }
}
```

[^template]: [[Obsidian plugin]]
