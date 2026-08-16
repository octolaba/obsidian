---
uid: ac80dfbe-3cf9-592d-8a48-02b4079ae460
xid:
  - scoped-snippets
aliases:
  - scoped-snippets
  - Scoped Snippets
  - san-schx/scoped-snippets
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/scoped-snippets
alt:
  - https://github.com/san-schx/scoped-snippets
downloads: 375
updated at: "2026-07-10T11:15:21Z"
related to:
  - "[[GitHub - 1275417393]]"
remind me:
---

# Scoped Snippets

Scoped Snippets binds a CSS snippet to an individual Markdown or Base file instead of enabling it across the whole vault. A snippet is assigned or removed per file from the file-view dropdown, and it must stay disabled in Obsidian's global CSS snippets list for the scoping to take effect.

```cue
plugin: {
    id:     "scoped-snippets"
    name:   "Scoped Snippets"
    author: "SAN-SchX"
    repo:   "san-schx/scoped-snippets"

    html_url:    "https://community.obsidian.md/plugins/scoped-snippets"
    github_url:  "https://github.com/san-schx/scoped-snippets"
    description: "Choose a CSS snippet per Obsidian .base or .md file, and apply it only to that Base or Markdown view. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Apply CSS snippets to individual Markdown (.md) and Base (.base) files instead of enabling them vault-wide. Assign or remove snippets per file from the file-view dropdown and keep those snippets disabled in Obsidian’s global CSS snippets list so scoping takes effect."

    stats: {
        downloads:  375
        updated_at: 1783682121000
    }
}
```

[^template]: [[Obsidian plugin]]
