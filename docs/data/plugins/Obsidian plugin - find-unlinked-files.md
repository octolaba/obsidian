---
uid: b2eb148c-56b4-5c8d-9bad-c0131a9dda64
xid:
  - find-unlinked-files
aliases:
  - find-unlinked-files
  - Find orphaned files and broken links
  - vinzent03/find-unlinked-files
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/find-unlinked-files
alt:
  - https://github.com/vinzent03/find-unlinked-files
downloads: 218572
updated at: "2026-07-28T23:17:10Z"
related to:
  - "[[GitHub - 313361341]]"
remind me:
---

# Find orphaned files and broken links

Finds files in the vault that nothing links to, the files with no backlinks that would otherwise be lost, and reports broken links and empty notes alongside them. The results are written into a generated output file. Missing notes can be created for unresolved links, and unused files can be moved to the system trash by extension.

```cue
plugin: {
    id:     "find-unlinked-files"
    name:   "Find orphaned files and broken links"
    author: "Vinzent"
    repo:   "vinzent03/find-unlinked-files"

    html_url:    "https://community.obsidian.md/plugins/find-unlinked-files"
    github_url:  "https://github.com/vinzent03/find-unlinked-files"
    description: "Find files that are not linked anywhere and would otherwise be lost in your vault. In other words: files with no backlinks."
    about:       "Find orphaned files, broken links, and empty notes across your vault and generate an output file listing them. Create missing linked notes for unresolved links and move unused files by extension to the system trash."

    stats: {
        downloads:  218572
        updated_at: 1785280630000
    }
}
```

[^template]: [[Obsidian plugin]]
