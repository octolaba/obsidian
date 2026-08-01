---
uid: ae7fce98-2d9d-501d-8458-7e78fb51982b
xid:
  - persistent-links
aliases:
  - persistent-links
  - Persistent Links
  - ivan-lednev/obsidian-persistent-links
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/persistent-links
alt:
  - https://github.com/ivan-lednev/obsidian-persistent-links
downloads: 7310
updated at: "2023-04-17T15:35:33Z"
related to:
  - "[[GitHub - 627387363]]"
remind me:
---

# Persistent Links

Persistent Links keeps wiki links to headings and blocks pointing at the right target when that content is moved between files. Broken links in a file are repaired by scanning the metadata cache for the relocated heading or block. Repairs run automatically on cut and paste and can also be triggered manually.

```cue
plugin: {
    id:     "persistent-links"
    name:   "Persistent Links"
    author: "ivan-lednev"
    repo:   "ivan-lednev/obsidian-persistent-links"

    html_url:    "https://community.obsidian.md/plugins/persistent-links"
    github_url:  "https://github.com/ivan-lednev/obsidian-persistent-links"
    description: "Automatically repair internal links to blocks and headings when moving them between files."
    about:       "Keep wiki links to headings and blocks intact when you move or cut-and-paste content by automatically updating their targets. Repair broken wiki links in a file by scanning the metadata cache to find relocated headings or blocks; updates run automatically on cut/paste and can be triggered manually."

    stats: {
        downloads:  7310
        updated_at: 1681745733000
    }
}
```

[^template]: [[Obsidian plugin]]
