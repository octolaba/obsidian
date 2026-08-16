---
uid: e900b3df-e5d7-51df-8cb6-c1c29796d258
xid:
  - transmute
aliases:
  - transmute
  - Transmute
  - johannes-kaindl/obsidian-transmute
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/transmute
alt:
  - https://github.com/johannes-kaindl/obsidian-transmute
downloads: 53
updated at: "2026-08-08T07:58:48Z"
related to:
  - "[[GitHub - 1311974130]]"
remind me:
---

# Transmute

Takes a change described in plain language and has a local LLM produce the JavaScript regular expression, the replacement and a one-line explanation of what it does. Every match is listed with a before-and-after preview and a checkbox, and only checked edits are applied through the editor so Obsidian's undo still works. The request is refined iteratively and run over a selection or the whole note, with endpoint fallback across models.

```cue
plugin: {
    id:     "transmute"
    name:   "Transmute"
    author: "Johannes Kaindl"
    repo:   "johannes-kaindl/obsidian-transmute"

    html_url:    "https://community.obsidian.md/plugins/transmute"
    github_url:  "https://github.com/johannes-kaindl/obsidian-transmute"
    description: "Search and replace by intent — a local LLM writes the regex, you review every match before it runs. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Describe changes in plain language and let a local LLM generate the JavaScript regular expression, replacement, and a one-line explanation. Preview every match with before/after checkboxes and apply only checked edits through the editor so Obsidian's undo works; refine iteratively and run on selection or whole note with model-agnostic endpoint fallback."

    stats: {
        downloads:  53
        updated_at: 1786175928000
    }
}
```

[^template]: [[Obsidian plugin]]
