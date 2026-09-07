---
uid: 8cd1881d-a762-560c-b67a-26a52fa97bff
xid:
  - microblog-publisher
aliases:
  - microblog-publisher
  - Micro.blog Publisher
  - bradbarrish/microblog-publisher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/microblog-publisher
alt:
  - https://github.com/bradbarrish/microblog-publisher
downloads: 104
updated at: "2026-05-15T22:11:33Z"
related to:
  - "[[GitHub - 1227020665]]"
remind me:
---

# Micro.blog Publisher

Micro.blog Publisher posts the active note to Micro.blog through the Micropub API, covering published posts, drafts, image uploads, categories and updates to existing posts. Cross-posting to Mastodon happens only when a note explicitly opts in. The plugin writes microblog_url, microblog_published and media links back into the note's frontmatter.

```cue
plugin: {
    id:     "microblog-publisher"
    name:   "Micro.blog Publisher"
    author: "bradbarrish"
    repo:   "bradbarrish/microblog-publisher"

    html_url:    "https://community.obsidian.md/plugins/microblog-publisher"
    github_url:  "https://github.com/bradbarrish/microblog-publisher"
    description: "Publish notes to micro.blog using the Micropub API. Supports drafts, categories, image uploads, and editing existing posts. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish the active note to Micro.blog via Micropub, supporting published posts, Micro.blog drafts, image uploads, categories, and updates to existing posts. Cross-post to Mastodon only when a note explicitly opts in, and write microblog_url, microblog_published, and media links back into the note's frontmatter."

    stats: {
        downloads:  104
        updated_at: 1778883093000
    }
}
```

[^template]: [[Obsidian plugin]]
