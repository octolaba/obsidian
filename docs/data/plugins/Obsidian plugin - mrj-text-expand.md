---
uid: 1bf0005c-07ad-5261-b806-3ea96f53f942
xid:
  - mrj-text-expand
aliases:
  - mrj-text-expand
  - Text expand
  - mrjackphil/obsidian-text-expand
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mrj-text-expand
alt:
  - https://github.com/mrjackphil/obsidian-text-expand
downloads: 38343
updated at: "2025-04-04T15:05:39Z"
related to:
  - "[[GitHub - 307895327]]"
remind me:
---

# Text expand

Runs an Obsidian search from an expander code block and pastes the found files into the note as links or transclusions. The output is shaped by eta or legacy templates, and file data is reachable through the it object, including it.current, it.files, frontmatter, links and headings.

```cue
plugin: {
    id:     "mrj-text-expand"
    name:   "Text expand"
    author: "mrjackphil"
    repo:   "mrjackphil/obsidian-text-expand"

    html_url:    "https://community.obsidian.md/plugins/mrj-text-expand"
    github_url:  "https://github.com/mrjackphil/obsidian-text-expand"
    description: "Search and paste/transclude links to found files."
    about:       "Search files with Obsidian search and paste the results directly into your note using expander code blocks. Customize output with eta or legacy templates and access file data via the it object (it.current, it.files, frontmatter, links, headings, etc.)."

    stats: {
        downloads:  38343
        updated_at: 1743779139000
    }
}
```

[^template]: [[Obsidian plugin]]
