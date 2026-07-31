---
uid: 0558b815-e357-5250-ae6f-f0008447e997
xid:
  - obsidian-pretext
aliases:
  - obsidian-pretext
  - Pretext Optimizer
  - wuyifan-code/Obsidian-pretext
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-pretext
alt:
  - https://github.com/wuyifan-code/Obsidian-pretext
downloads: 550
updated at: "2026-07-23T07:11:22Z"
related to:
  - "[[GitHub - 1201256127]]"
remind me:
---

# Pretext Optimizer

This plugin integrates the Pretext library to reduce DOM measurement overhead in Obsidian's rendering pipeline, aimed at large documents. It precomputes element heights and sets min-height so expensive layout reads can be skipped, applying in preview and in the CodeMirror editor with text and font caching, visible-area scanning, RAF throttling and batched processing. The recorded text reports faster first render and less reflow on scroll, especially for callouts, blockquotes and tables. The Plugin Index records that this plugin has not been manually reviewed by Obsidian staff.

```cue
plugin: {
    id:     "obsidian-pretext"
    name:   "Pretext Optimizer"
    author: "wuyifan-code"
    repo:   "wuyifan-code/Obsidian-pretext"

    html_url:    "https://community.obsidian.md/plugins/obsidian-pretext"
    github_url:  "https://github.com/wuyifan-code/Obsidian-pretext"
    description: "Integrates Pretext library to reduce DOM measurement overhead in Obsidian's rendering pipeline, improving performance for large documents. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Reduce DOM measurement overhead and speed up rendering of large Obsidian notes by precomputing element heights and setting min-height to skip expensive layout reads. Apply in preview and editor (CodeMirror) with smart text+font caching, visible-area scanning, RAF throttling and batched processing to speed first render and cut reflow on scroll, especially for callouts, blockquotes and tables."

    stats: {
        downloads:  550
        updated_at: 1784790682000
    }
}
```

[^template]: [[Obsidian plugin]]
