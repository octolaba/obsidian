---
uid: 51726253-2189-5cff-8929-6916786422be
xid:
  - contentful-publisher
aliases:
  - contentful-publisher
  - Contentful Publisher
  - ziyafenn/obsidian-contentful-publisher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/contentful-publisher
alt:
  - https://github.com/ziyafenn/obsidian-contentful-publisher
downloads: 2791
updated at: "2023-09-03T11:03:22Z"
related to:
  - "[[GitHub - 686602114]]"
remind me:
---

# Contentful Publisher

Contentful Publisher syncs content types and entries from Contentful and generates Obsidian templates and notes organised into folders by content type. Edits made in a note can be pushed back to Contentful, with conflict warnings and automatic copies when an entry is out of sync. All content fields except title and body are written as frontmatter, while RichText, ResourceLink, Link, Object and Location fields are ignored.

```cue
plugin: {
    id:     "contentful-publisher"
    name:   "Contentful Publisher"
    author: "ziyafenn"
    repo:   "ziyafenn/obsidian-contentful-publisher"

    html_url:    "https://community.obsidian.md/plugins/contentful-publisher"
    github_url:  "https://github.com/ziyafenn/obsidian-contentful-publisher"
    description: "Manage your Contentful content."
    about:       "Sync content types and entries from Contentful and generate Obsidian templates and notes organized into folders by content type. Edit notes and push updates back to Contentful, with conflict warnings and automatic copies when entries are out of sync. Add all content fields as frontmatter (except title and body), ignoring RichText, ResourceLink, Link, Object and Location fields."

    stats: {
        downloads:  2791
        updated_at: 1693739002000
    }
}
```

[^template]: [[Obsidian plugin]]
