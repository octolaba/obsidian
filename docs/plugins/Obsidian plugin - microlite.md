---
uid: 731813af-6eb2-51c1-bbd0-f315120a4ef7
xid:
  - microlite
aliases:
  - microlite
  - Microlite
  - jaanaltosaar/obsidian-microlite
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/microlite
alt:
  - https://github.com/jaanaltosaar/obsidian-microlite
downloads: 36
updated at: "2026-07-22T17:13:41Z"
related to:
  - "[[GitHub - 1291584195]]"
remind me:
---

# Microlite

Microlite reads Obsidian's File Recovery snapshots and writes one dated note holding only the lines changed during the week: a per-day activity table followed by heading-aware diffs, newest first. It folds in live content, accounts for bulk syncs and renamed notes, and drops notes that were merely opened. The resulting single note is meant to be handed to an LLM such as Claude or ChatGPT in place of whole notes, so the model sees only what moved.

```cue
plugin: {
    id:     "microlite"
    name:   "Microlite"
    author: "Jaan Altosaar"
    repo:   "jaanaltosaar/obsidian-microlite"

    html_url:    "https://community.obsidian.md/plugins/microlite"
    github_url:  "https://github.com/jaanaltosaar/obsidian-microlite"
    description: "Turn a week of edits across all your notes into one LLM-ready review; like \"track changes\" for your whole vault, ready to paste into Claude or ChatGPT. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Microlite reads Obsidian's File Recovery snapshots and writes one dated note that shows only the lines you changed this week: a per-day activity table, then heading-aware diffs, newest first. It handles the messy parts such as bulk syncs, renamed notes, live content folded in, and notes you merely opened dropped. Hand that single note to Claude or ChatGPT instead of the whole notes you would like the LLM to analyze (giving whole notes can lead the model to forget important context and add noise). The model sees only what moved, so it connects ideas across notes on its own. Edit a project plan on Monday and a journal entry on Thursday, and the model surfaces the thread between them, i.e. no manual [[links]] needed. No other tool does this today, apart from a cumbersome manual Python script. In short, you get to skip the work of curating context and lower the cognitive load of writing. In using this for therapy-adjacent and life coaching-adjacent use cases, we've found it fun! :)"

    stats: {
        downloads:  36
        updated_at: 1784740421000
    }
}
```

[^template]: [[Obsidian plugin]]
