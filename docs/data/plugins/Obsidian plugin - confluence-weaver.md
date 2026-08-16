---
uid: 124bf679-270d-512f-b2df-1528f15f18af
xid:
  - confluence-weaver
aliases:
  - confluence-weaver
  - Confluence Weaver
  - gs-ax/confluence-weaver
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/confluence-weaver
alt:
  - https://github.com/gs-ax/confluence-weaver
downloads: 223
updated at: "2026-05-22T15:18:23Z"
related to:
  - "[[GitHub - 1245608539]]"
remind me:
---

# Confluence Weaver

Confluence Weaver syncs Confluence pages into the vault as Markdown, keeping headings, tables, code blocks, task lists, info panels and attachments, and downloading images to embed them locally. Pages are selected through CQL profiles or by pasting a Confluence URL, optionally collecting children, and incremental syncs skip unchanged pages. Ancestor pages are mirrored as folders, Confluence metadata goes into the frontmatter, and internal links are converted to Obsidian wiki-links.

```cue
plugin: {
    id:     "confluence-weaver"
    name:   "Confluence Weaver"
    author: "HJ"
    repo:   "gs-ax/confluence-weaver"

    html_url:    "https://community.obsidian.md/plugins/confluence-weaver"
    github_url:  "https://github.com/gs-ax/confluence-weaver"
    description: "Sync Confluence pages to your Vault - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Confluence pages into your Vault as Markdown, preserving headings, tables, code blocks, task lists, info panels, and attachments while downloading and embedding images locally. Define CQL profiles or paste a Confluence URL to import pages (with optional child collection), run incremental syncs that skip unchanged pages, mirror ancestor pages as folders, include Confluence metadata in frontmatter, and convert internal links to Obsidian [[wiki-links]]."

    stats: {
        downloads:  223
        updated_at: 1779463103000
    }
}
```

[^template]: [[Obsidian plugin]]
