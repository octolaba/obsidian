---
uid: 50877a9f-46ef-5505-989a-9ad2c045bae4
xid:
  - tag-to-page
aliases:
  - tag-to-page
  - Tag to Page
  - agarcabin/obsdian-tag-to-page
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tag-to-page
alt:
  - https://github.com/agarcabin/obsdian-tag-to-page
downloads: 24
updated at: "2026-07-20T10:06:56Z"
related to:
  - "[[GitHub - 1293803089]]"
remind me:
---

# Tag to Page

Tag to Page turns a tag into a link to its own page, opening that note when the tag is clicked in Reading view or Live Preview and creating the Markdown note when it is missing. Frontmatter aliases are resolved, nested tags map to folders, and a modifier key opens the note in a new pane. Typing the tag character can optionally complete to an existing page.

```cue
plugin: {
    id:     "tag-to-page"
    name:   "Tag to Page"
    author: "AQiong 阿琼"
    repo:   "agarcabin/obsdian-tag-to-page"

    html_url:    "https://community.obsidian.md/plugins/tag-to-page"
    github_url:  "https://github.com/agarcabin/obsdian-tag-to-page"
    description: "Click #tag to navigate to [[tag]] page like Logseq - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open tag notes by clicking tags in Reading view or Live Preview, creating a matching Markdown note if missing and resolving frontmatter aliases. Support nested tags as folders, allow opening in a new pane with a modifier key, and offer optional page completion when typing #."

    stats: {
        downloads:  24
        updated_at: 1784542016000
    }
}
```

[^template]: [[Obsidian plugin]]
