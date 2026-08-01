---
uid: 0b81b851-5cd8-5986-a802-ce10b253f265
xid:
  - mblog-publish
aliases:
  - mblog-publish
  - MBlog Publish
  - kingwrcy/obsidian-mblog
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mblog-publish
alt:
  - https://github.com/kingwrcy/obsidian-mblog
downloads: 1001
updated at: "2024-02-29T07:48:05Z"
related to:
  - "[[GitHub - 759287353]]"
remind me:
---

# MBlog Publish

MBlog Publish sends a single Markdown note from Obsidian to the MBlog platform, taking its metadata from front matter where the title is required and link, pubDate, tags and draft are optional. The MBlog API has to be enabled and an API token added, after which a note is published from its right-click menu and the result is reported as a success or failure notice.

```cue
plugin: {
    id:     "mblog-publish"
    name:   "MBlog Publish"
    author: "kingwrcy"
    repo:   "kingwrcy/obsidian-mblog"

    html_url:    "https://community.obsidian.md/plugins/mblog-publish"
    github_url:  "https://github.com/kingwrcy/obsidian-mblog"
    description: "Publish articles from Obsidian to the MBlog platform."
    about:       "Publish single Markdown notes from Obsidian to MBlog using front matter metadata (title required; optional link, pubDate, tags, draft). Enable MBlog API and add your API token, then right-click a note to publish and receive success/failure notifications."

    stats: {
        downloads:  1001
        updated_at: 1709192885000
    }
}
```

[^template]: [[Obsidian plugin]]
