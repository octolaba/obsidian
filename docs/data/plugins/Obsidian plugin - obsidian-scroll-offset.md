---
uid: 297193ae-afae-5b9a-8e34-11148ef4af03
xid:
  - obsidian-scroll-offset
aliases:
  - obsidian-scroll-offset
  - Scroll Offset
  - lijyze/scroll-offset
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-scroll-offset
alt:
  - https://github.com/lijyze/scroll-offset
downloads: 10616
updated at: "2022-07-22T06:37:50Z"
related to:
  - "[[GitHub - 476750127]]"
remind me:
---

# Scroll Offset

This plugin preserves a custom distance before and after the cursor while scrolling, emulating Vim's scrolloff so the cursor stays away from the window edges. The offset is set in pixels or as a proportion of the content height, and is adjusted automatically at boundaries so that it never exceeds half the view.

```cue
plugin: {
    id:     "obsidian-scroll-offset"
    name:   "Scroll Offset"
    author: "lijyze"
    repo:   "lijyze/scroll-offset"

    html_url:    "https://community.obsidian.md/plugins/obsidian-scroll-offset"
    github_url:  "https://github.com/lijyze/scroll-offset"
    description: "Preserve custom distances before or after cursor."
    about:       "Keep a custom vertical margin around the cursor while scrolling, emulating Vim's scrolloff so the cursor stays away from window edges. Set the offset in pixels or as a proportion of the content height; auto-adjust at boundaries so it never exceeds half the view."

    stats: {
        downloads:  10616
        updated_at: 1658471870000
    }
}
```

[^template]: [[Obsidian plugin]]
