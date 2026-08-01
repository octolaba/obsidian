---
uid: 97df40ca-008d-5fb9-8e2b-dfa8edeb00a8
xid:
  - live-preview-bold-fix
aliases:
  - live-preview-bold-fix
  - Live Preview Bold Fix
  - konoyo-014/obsidian-live-preview-bold-fix
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/live-preview-bold-fix
alt:
  - https://github.com/konoyo-014/obsidian-live-preview-bold-fix
downloads: 150
updated at: "2026-02-21T13:39:14Z"
related to:
  - "[[GitHub - 1163342938]]"
remind me:
---

# Live Preview Bold Fix

Addresses bold rendering drift in Live Preview by overriding the styling ranges applied to strong text, without changing the Markdown files. Inconsistent bold boundaries around punctuation and brackets, including mixed CJK and English text, are corrected, and inline and block math previews are aligned with Obsidian's native math widget.

```cue
plugin: {
    id:     "live-preview-bold-fix"
    name:   "Live Preview Bold Fix"
    author: "konoyo-014"
    repo:   "konoyo-014/obsidian-live-preview-bold-fix"

    html_url:    "https://community.obsidian.md/plugins/live-preview-bold-fix"
    github_url:  "https://github.com/konoyo-014/obsidian-live-preview-bold-fix"
    description: "Fixes bold rendering drift in Live Preview by overriding strong styling ranges. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Stabilize Live Preview rendering for bold text and math without changing markdown files. Fix inconsistent bold boundaries around punctuation and brackets (including mixed CJK/English) and align inline/block math previews with Obsidian's native math widget."

    stats: {
        downloads:  150
        updated_at: 1771681154000
    }
}
```

[^template]: [[Obsidian plugin]]
