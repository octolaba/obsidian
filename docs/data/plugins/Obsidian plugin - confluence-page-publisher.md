---
uid: 1e2922ff-1c1a-5cd1-9e42-cf60423c87ab
xid:
  - confluence-page-publisher
aliases:
  - confluence-page-publisher
  - Confluence Page Publisher
  - gibranbadrul/obsidian-confluence-page
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/confluence-page-publisher
alt:
  - https://github.com/gibranbadrul/obsidian-confluence-page
downloads: 51
updated at: "2026-08-04T08:33:02Z"
related to:
  - "[[GitHub - 1292470296]]"
remind me:
---

# Confluence Page Publisher

Confluence Page Publisher publishes notes to Confluence as Storage Format XHTML, rendering diagrams and uploading local attachments along the way. A note is bound to its Confluence page through frontmatter, unchanged content is skipped by comparing content hashes, and the page ID, timestamp and hash are written back into the note.

```cue
plugin: {
    id:     "confluence-page-publisher"
    name:   "Confluence Page Publisher"
    author: "Gibran"
    repo:   "gibranbadrul/obsidian-confluence-page"

    html_url:    "https://community.obsidian.md/plugins/confluence-page-publisher"
    github_url:  "https://github.com/gibranbadrul/obsidian-confluence-page"
    description: "Publish notes to Confluence pages using frontmatter bindings and custom Markdown conversion. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish Obsidian notes to Confluence as Confluence Storage XHTML, rendering diagrams and uploading local attachments. Bind notes to Confluence pages via frontmatter, skip unchanged content using content hashes, and write publish metadata (page ID, timestamp, hash) back into the note."

    stats: {
        downloads:  51
        updated_at: 1785832382000
    }
}
```

[^template]: [[Obsidian plugin]]
