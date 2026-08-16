---
uid: 23c931db-0cb5-5574-89ae-7d55aaa561bb
xid:
  - confluence-publisher
aliases:
  - confluence-publisher
  - Confluence Publisher
  - grhawk/obsidian-2-confluence
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/confluence-publisher
alt:
  - https://github.com/grhawk/obsidian-2-confluence
downloads: 217
updated at: "2026-01-31T22:24:33Z"
related to:
  - "[[GitHub - 1136592602]]"
remind me:
---

# Confluence Publisher

Confluence Publisher syncs the active note to Confluence through the REST API, converting Obsidian Markdown to Confluence storage HTML. An existing page is updated by the page ID in frontmatter or by a title lookup, and a new page is otherwise created under an optional parent, with its Confluence page ID written back to the frontmatter.

```cue
plugin: {
    id:     "confluence-publisher"
    name:   "Confluence Publisher"
    author: "grhawk"
    repo:   "grhawk/obsidian-2-confluence"

    html_url:    "https://community.obsidian.md/plugins/confluence-publisher"
    github_url:  "https://github.com/grhawk/obsidian-2-confluence"
    description: "Sync the active note to Confluence using the REST API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync the active Obsidian note to Confluence using the REST API. Convert Obsidian Markdown to Confluence storage HTML, update pages by frontmatter page ID or title lookup, or create new pages under an optional parent and write the Confluence page ID back to frontmatter."

    stats: {
        downloads:  217
        updated_at: 1769898273000
    }
}
```

[^template]: [[Obsidian plugin]]
