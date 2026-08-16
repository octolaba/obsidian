---
uid: 759b674a-ad07-5a69-abe2-1795fd27d339
xid:
  - file-index
aliases:
  - file-index
  - File Index
  - steffo99/obsidian-file-index
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/file-index
alt:
  - https://github.com/steffo99/obsidian-file-index
downloads: 3361
updated at: "2023-11-17T14:19:49Z"
related to:
  - "[[GitHub - 711234800]]"
remind me:
---

# File Index

File Index maintains a file-index.json at the vault root that lists every file path and maps basenames to their paths, so external tools can work with the vault's contents. Files are excluded through a file-index-ignore.json holding regex patterns. The index is used to render wikilinks or to feed those external tools.

```cue
plugin: {
    id:     "file-index"
    name:   "File Index"
    author: "steffo99"
    repo:   "steffo99/obsidian-file-index"

    html_url:    "https://community.obsidian.md/plugins/file-index"
    github_url:  "https://github.com/steffo99/obsidian-file-index"
    description: "Create a metadata file about the files present in the Vault."
    about:       "Create and maintain a file-index.json at your vault root that lists all file paths and maps basenames to their file paths for external processing. Exclude files with a file-index-ignore.json of regex patterns and use the index to render wikilinks or feed external tools."

    stats: {
        downloads:  3361
        updated_at: 1700230789000
    }
}
```

[^template]: [[Obsidian plugin]]
