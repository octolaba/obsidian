---
uid: 583ff57b-a1e6-57f7-99da-3848b86edbf8
xid:
  - varinote
aliases:
  - varinote
  - Varinote
  - gsarig/obsidian-varinote
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/varinote
alt:
  - https://github.com/gsarig/obsidian-varinote
downloads: 874
updated at: "2025-02-17T18:14:00Z"
related to:
  - "[[GitHub - 893204563]]"
remind me:
---

# Varinote

Declares variables with optional default values inside a template, using a varinote syntax. When a note is created from that template, a modal prompts for and edits the values, which are then injected into the note through placeholders. Common field types such as text and dropdown are supported.

```cue
plugin: {
    id:     "varinote"
    name:   "Varinote"
    author: "Giorgos Sarigiannidis"
    repo:   "gsarig/obsidian-varinote"

    html_url:    "https://community.obsidian.md/plugins/varinote"
    github_url:  "https://github.com/gsarig/obsidian-varinote"
    description: "Add variables in Templates and set their values on-the-fly during the Note creation."
    about:       "Define variables with optional default values directly inside templates using a simple varinote syntax. Prompt for and edit variable values via a modal when creating a note, then inject them into the note with {{$variable}} placeholders. Support common field types like text and dropdown for flexible input."

    stats: {
        downloads:  874
        updated_at: 1739816040000
    }
}
```

[^template]: [[Obsidian plugin]]
