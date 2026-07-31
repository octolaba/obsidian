---
uid: 240e7789-ea10-5ed0-bd5e-9d88d1ae6bb4
xid:
  - proofreader
aliases:
  - proofreader
  - Proofreader
  - chrisgrieser/obsidian-proofreader
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/proofreader
alt:
  - https://github.com/chrisgrieser/obsidian-proofreader
downloads: 3397
updated at: "2026-05-13T13:14:10Z"
related to:
  - "[[GitHub - 954701817]]"
remind me:
---

# Proofreader

Sends writing to an LLM for proofreading and stylistic improvement and inserts the result inline as suggestions, with highlights for additions and strikethroughs for removals, in the manner of tracked changes in a word processor. Each suggestion is accepted or rejected with a single hotkey, and concise style comments accompany the check. Checks run through your own LLM API key, and the recorded description notes that the network requests may incur usage costs.

```cue
plugin: {
    id:     "proofreader"
    name:   "Proofreader"
    author: "Chris Grieser"
    repo:   "chrisgrieser/obsidian-proofreader"

    html_url:    "https://community.obsidian.md/plugins/proofreader"
    github_url:  "https://github.com/chrisgrieser/obsidian-proofreader"
    description: "AI-based proofreading and stylistic improvements for your writing. Changes are inserted as suggestions directly in the editor, similar to suggested changes in word processing apps."
    about:       "Insert AI proofreading suggestions inline as ==highlights== for additions and ~~strikethroughs~~ for removals. Accept or reject suggestions with one hotkey, get concise style comments, and run checks via your LLM API key (network requests may incur usage costs)."

    stats: {
        downloads:  3397
        updated_at: 1778678050000
    }
}
```

[^template]: [[Obsidian plugin]]
