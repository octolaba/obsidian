---
uid: a94dc69f-0ee7-58a8-a2d1-12c1fe39eb45
xid:
  - at-link
aliases:
  - at-link
  - At Link
  - stefan-imbesi/obsidian-at-link
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/at-link
alt:
  - https://github.com/stefan-imbesi/obsidian-at-link
downloads: 271
updated at: "2026-05-19T05:27:44Z"
related to:
  - "[[GitHub - 1217460589]]"
remind me:
---

# At Link

Opens an autocomplete for internal links when the at sign is typed at the start of a line or after whitespace, searching vault files, headings and block identifiers. Choosing a suggestion replaces the typed query with a wikilink to the note, to a heading inside it, or to a block reference; a space or Escape closes the popup.

```cue
plugin: {
    id:     "at-link"
    name:   "At Link"
    author: "Stefan Imbesi"
    repo:   "stefan-imbesi/obsidian-at-link"

    html_url:    "https://community.obsidian.md/plugins/at-link"
    github_url:  "https://github.com/stefan-imbesi/obsidian-at-link"
    description: "Type @ to open an autocomplete for wikilinks to notes, headings, and blocks. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open an internal-link autocomplete by typing @ at the start of a line or after whitespace, searching vault files, headings, and blocks with ^id. Select a suggestion to replace @query with a wikilink ([[Note Title]], [[Note Title#Heading]] or [[Note Title#^blockid]]); typing space or Esc closes the popup."

    stats: {
        downloads:  271
        updated_at: 1779168464000
    }
}
```

[^template]: [[Obsidian plugin]]
