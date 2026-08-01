---
uid: e0eafb73-ce93-5e0b-8326-dbb11acc3752
xid:
  - madr
aliases:
  - madr
  - MADR Author
  - vanerp/obsidian-madr
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/madr
alt:
  - https://github.com/vanerp/obsidian-madr
downloads: 29
updated at: "2026-07-08T19:58:33Z"
related to:
  - "[[GitHub - 1293723351]]"
remind me:
---

# MADR Author

Authors architectural decision records in MADR format as plain Markdown notes in the vault, with a rendered template for each new record. A sidebar panel creates records and shows a live checklist that flags missing sections and leftover template placeholders. The recorded text states that reads and writes stay local to the vault, with no network calls.

```cue
plugin: {
    id:     "madr"
    name:   "MADR Author"
    author: "Tijs van Erp"
    repo:   "vanerp/obsidian-madr"

    html_url:    "https://community.obsidian.md/plugins/madr"
    github_url:  "https://github.com/vanerp/obsidian-madr"
    description: "Author Markdown Architectural Decision Records directly in your vault - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Author MADR-format architecture decision records as plain Markdown notes with rendered templates for each new record. Open the sidebar ADR panel to create records and view a live checklist that flags missing sections and leftover template placeholders. Keep all reads and writes local to your vault — no network calls."

    stats: {
        downloads:  29
        updated_at: 1783540713000
    }
}
```

[^template]: [[Obsidian plugin]]
