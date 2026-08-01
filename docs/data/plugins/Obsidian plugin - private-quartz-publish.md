---
uid: ad474cd1-9f63-5543-bfd2-e095256a53c9
xid:
  - private-quartz-publish
aliases:
  - private-quartz-publish
  - Private Quartz Publish
  - jagajaga/private-quartz-publish
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/private-quartz-publish
alt:
  - https://github.com/jagajaga/private-quartz-publish
downloads: 138
updated at: "2026-06-02T11:48:12Z"
related to:
  - "[[GitHub - 1254676700]]"
remind me:
---

# Private Quartz Publish

Publishes individual notes or whole folders to a self-hosted Quartz site, giving each item a cryptographically random, unguessable slug as its public URL. Sharing a file link reveals only that file and a folder link only its bundled notes. Locally only frontmatter is edited, while a separate server stack serves the content, hides filenames and vault structure, and prevents sitemap or URL enumeration.

```cue
plugin: {
    id:     "private-quartz-publish"
    name:   "Private Quartz Publish"
    author: "Arseniy Seroka"
    repo:   "jagajaga/private-quartz-publish"

    html_url:    "https://community.obsidian.md/plugins/private-quartz-publish"
    github_url:  "https://github.com/jagajaga/private-quartz-publish"
    description: "Opt-in publish individual notes or whole folders from Obsidian to a self-hosted Quartz site. Each URL is an unguessable random slug; sharing a file link reveals only that file, sharing a folder link reveals only its bundled notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish individual notes or entire folders to a self-hosted Quartz site using cryptographically random, unguessable slugs for public URLs. Edit only frontmatter locally while a separate server stack serves content, hides filenames and vault structure, and prevents sitemap or URL enumeration."

    stats: {
        downloads:  138
        updated_at: 1780400892000
    }
}
```

[^template]: [[Obsidian plugin]]
