---
uid: 34da80b7-3388-5ddf-a7c3-008d7569666a
xid:
  - frontmatter-to-html-attributes
aliases:
  - frontmatter-to-html-attributes
  - Frontmatter to HTML Attributes
  - illdepence/obsidian-frontmatter-to-html-attributes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/frontmatter-to-html-attributes
alt:
  - https://github.com/illdepence/obsidian-frontmatter-to-html-attributes
downloads: 324
updated at: "2026-03-06T22:43:25Z"
related to:
  - "[[GitHub - 1056405023]]"
remind me:
---

# Frontmatter to HTML Attributes

Exposes YAML frontmatter as data attributes on a note's HTML container so notes can be styled from their metadata. Those data attributes are targeted in CSS selectors; lists and objects serialize to JSON while primitives become strings.

```cue
plugin: {
    id:     "frontmatter-to-html-attributes"
    name:   "Frontmatter to HTML Attributes"
    author: "illdepence"
    repo:   "illdepence/obsidian-frontmatter-to-html-attributes"

    html_url:    "https://community.obsidian.md/plugins/frontmatter-to-html-attributes"
    github_url:  "https://github.com/illdepence/obsidian-frontmatter-to-html-attributes"
    description: "Makes YAML frontmatter available as data-* attributes in HTML, enabling metadata based CSS styling."
    about:       "Expose YAML frontmatter as data-* attributes on a note's HTML container for CSS-based metadata styling. Target those data attributes in CSS selectors to style notes by frontmatter values — lists and objects serialize to JSON while primitives become strings."

    stats: {
        downloads:  324
        updated_at: 1772837005000
    }
}
```

[^template]: [[Obsidian plugin]]
