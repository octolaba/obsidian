---
uid: 38c6c8b0-c107-5800-8ef6-752508905bb2
xid:
  - outline-converter
aliases:
  - outline-converter
  - Outline Converter
  - masaki39/outline-converter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/outline-converter
alt:
  - https://github.com/masaki39/outline-converter
downloads: 2493
updated at: "2026-05-21T12:42:33Z"
related to:
  - "[[GitHub - 784221400]]"
remind me:
---

# Outline Converter

Converts a bullet-point outline into continuous text, promoting items that have children into headers while leaf items become prose. Text can be inserted before and after each item per indentation level, the conversion runs on a selection or on the whole note, lines starting with a double slash are ignored, and up to five sequential regular-expression replacements are applied afterwards.

```cue
plugin: {
    id:     "outline-converter"
    name:   "Outline Converter"
    author: "masaki39"
    repo:   "masaki39/outline-converter"

    html_url:    "https://community.obsidian.md/plugins/outline-converter"
    github_url:  "https://github.com/masaki39/outline-converter"
    description: "Convert outline to continuous text."
    about:       "Convert bullet-point outlines into continuous text with intelligent header promotion: items with children become headers while leaf items become prose. Customize per-indentation-level before/after text, run on a selection or the whole note, ignore lines starting with //, and apply up to five sequential regex replacements."

    stats: {
        downloads:  2493
        updated_at: 1779367353000
    }
}
```

[^template]: [[Obsidian plugin]]
