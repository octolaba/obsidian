---
uid: f79e2b4d-4d51-5615-bbf9-8db1370d9132
xid:
  - cjk-cross-search
aliases:
  - cjk-cross-search
  - CJK Cross-Script Search
  - sai1047976/obsidian-cjk-cross-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cjk-cross-search
alt:
  - https://github.com/sai1047976/obsidian-cjk-cross-search
downloads: 91
updated at: "2026-05-07T17:08:32Z"
related to:
  - "[[GitHub - 1232174750]]"
remind me:
---

# CJK Cross-Script Search

Rewrites global search queries so that a term typed in Simplified Chinese also matches its Traditional form and the reverse. Variant expansion uses OpenCC in its Taiwan or Basic mapping, covering common Mainland and Taiwan variants. Rewriting pauses during IME composition, and both typed and programmatic searches are handled on desktop and mobile.

```cue
plugin: {
    id:     "cjk-cross-search"
    name:   "CJK Cross-Script Search"
    author: "sai1047976"
    repo:   "sai1047976/obsidian-cjk-cross-search"

    html_url:    "https://community.obsidian.md/plugins/cjk-cross-search"
    github_url:  "https://github.com/sai1047976/obsidian-cjk-cross-search"
    description: "Type 萬維鋼 and find 万维钢 (and vice versa) in global search. Uses OpenCC to expand queries across Simplified and Traditional Chinese. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bridge Simplified and Traditional Chinese in Obsidian global search by rewriting queries to include variant forms (e.g., 萬維鋼 ↔ 万维钢). Pause rewrites during IME composition, apply OpenCC Taiwan or Basic mappings for common Mainland/Taiwan variants, and handle both typed and programmatic searches on desktop and mobile."

    stats: {
        downloads:  91
        updated_at: 1778173712000
    }
}
```

[^template]: [[Obsidian plugin]]
