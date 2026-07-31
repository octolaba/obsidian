---
uid: 20c2a5de-b7af-56df-b900-2e393c7d31fc
xid:
  - paste-as-embed
aliases:
  - paste-as-embed
  - Paste as Embed
  - i-m-mll/obsidian-paste-as-embed
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/paste-as-embed
alt:
  - https://github.com/i-m-mll/obsidian-paste-as-embed
downloads: 406
updated at: "2024-07-22T18:56:21Z"
related to:
  - "[[GitHub - 828335211]]"
remind me:
---

# Paste as Embed

Intercepts pasted text and tests it against configured regular-expression rules. When a rule matches, the pasted content becomes a new note - optionally created from a template and saved under a specified folder and name - which is then embedded inline; text matching no rule is pasted normally.

```cue
plugin: {
    id:     "paste-as-embed"
    name:   "Paste as Embed"
    author: "i-m-mll"
    repo:   "i-m-mll/obsidian-paste-as-embed"

    html_url:    "https://community.obsidian.md/plugins/paste-as-embed"
    github_url:  "https://github.com/i-m-mll/obsidian-paste-as-embed"
    description: "Redirect pasted text into a separate note, and embed it."
    about:       "Intercept pasted text and test it against your regex rules. When a rule matches, create a new note from the pasted content (optionally via a template), save it to the specified folder/name, and embed that note inline; otherwise paste normally."

    stats: {
        downloads:  406
        updated_at: 1721674581000
    }
}
```

[^template]: [[Obsidian plugin]]
