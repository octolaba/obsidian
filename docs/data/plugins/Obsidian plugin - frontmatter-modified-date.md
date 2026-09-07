---
uid: 79033af8-729c-5ac7-9914-292334c1d152
xid:
  - frontmatter-modified-date
aliases:
  - frontmatter-modified-date
  - Update modified date
  - alangrainger/obsidian-frontmatter-modified-date
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/frontmatter-modified-date
alt:
  - https://github.com/alangrainger/obsidian-frontmatter-modified-date
downloads: 54290
updated at: "2026-05-27T13:23:40Z"
related to:
  - "[[GitHub - 673024074]]"
remind me:
---

# Update modified date

Updates a modified field in the frontmatter whenever a note is edited inside Obsidian, using editor events rather than the filesystem modification time. The YAML field name and the MomentJS date format can be chosen, folders or files excluded, and each edit timestamp optionally appended to a history array.

```cue
plugin: {
    id:     "frontmatter-modified-date"
    name:   "Update modified date"
    author: "Alan Grainger"
    repo:   "alangrainger/obsidian-frontmatter-modified-date"

    html_url:    "https://community.obsidian.md/plugins/frontmatter-modified-date"
    github_url:  "https://github.com/alangrainger/obsidian-frontmatter-modified-date"
    description: "Automatically update a frontmatter modified date field when the file is modified."
    about:       "Update a frontmatter modified field whenever you edit a note inside Obsidian, using editor events instead of filesystem modification time. Choose a custom YAML field and MomentJS date format, exclude folders or files from updates, and optionally append each edit timestamp to a history array."

    stats: {
        downloads:  54290
        updated_at: 1779888220000
    }
}
```

[^template]: [[Obsidian plugin]]
