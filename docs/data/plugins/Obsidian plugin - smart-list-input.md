---
uid: 6a22515d-5af3-5a48-aed9-b831564e612e
xid:
  - smart-list-input
aliases:
  - smart-list-input
  - Smart List Input
  - hygyh/smart-list-input
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/smart-list-input
alt:
  - https://github.com/hygyh/smart-list-input
downloads: 26
updated at: "2026-08-07T03:08:22Z"
related to:
  - "[[GitHub - 1291981656]]"
remind me:
---

# Smart List Input

Converts Chinese list punctuation into standard Markdown numbering while lists are typed, and switches quickly between ordered, bullet and task items. Tab and Shift+Tab indent and de-indent while preserving the correct list type at each level, without producing nested ordered lists. Both the standard task marker and the nonstandard variant without a space are recognized, and Backspace removes a whole list marker at once.

```cue
plugin: {
    id:     "smart-list-input"
    name:   "Smart List Input"
    author: "hygyh"
    repo:   "hygyh/smart-list-input"

    html_url:    "https://community.obsidian.md/plugins/smart-list-input"
    github_url:  "https://github.com/hygyh/smart-list-input"
    description: "智能 Markdown 列表输入：中文标点（1、1。等）自动转标准序号，支持有序/无序/待办列表快速切换，子项类型与所在层级保持一致。Smart Markdown list input: auto-converts Chinese punctuation to standard numbering, quick-switches ordered/bullet/task lists, keeps child types consistent with their level. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Type lists in Chinese or English with automatic conversion of Chinese list punctuation to standard numbering and quick switching between ordered, bullet, and task items. Indent and de-indent lists with Tab/Shift+Tab while preserving correct list types (no nested ordered lists), support both - [ ] and nonstandard -[x] task markers, and remove entire list markers with Backspace."

    stats: {
        downloads:  26
        updated_at: 1786072102000
    }
}
```

[^template]: [[Obsidian plugin]]
