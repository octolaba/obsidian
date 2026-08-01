---
uid: 46a2afbc-7e18-50ae-8c77-4d1bf2065aa2
xid:
  - clippings-dedupe
aliases:
  - clippings-dedupe
  - Clippings Dedupe
  - somasekimoto/obsidian-clippings-dedupe
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/clippings-dedupe
alt:
  - https://github.com/somasekimoto/obsidian-clippings-dedupe
downloads: 19
updated at: "2026-07-16T16:37:27Z"
related to:
  - "[[GitHub - 1301887586]]"
remind me:
---

# Clippings Dedupe

Merges the duplicate highlights that Web Clipper appends when a page is clipped again, matching them by their quoted text. Comments written under each quote are preserved, appended highlight sections are folded back into the main highlights area, and a backup snapshot is saved before the note is rewritten. It can run automatically after a clip or be triggered by hand.

```cue
plugin: {
    id:     "clippings-dedupe"
    name:   "Clippings Dedupe"
    author: "Soma Sekimoto"
    repo:   "somasekimoto/obsidian-clippings-dedupe"

    html_url:    "https://community.obsidian.md/plugins/clippings-dedupe"
    github_url:  "https://github.com/somasekimoto/obsidian-clippings-dedupe"
    description: "Merge duplicate highlights that Web Clipper appends when re-clipping a page, while protecting the comments you write under each quote. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Merge duplicate highlights appended by the Obsidian Web Clipper by matching quoted text and preserve all comments under each quote. Consolidate appended highlight sections into the main highlights area, fold appended sections back, and save a backup snapshot before rewriting; run automatically after a clip or trigger manually."

    stats: {
        downloads:  19
        updated_at: 1784219847000
    }
}
```

[^template]: [[Obsidian plugin]]
