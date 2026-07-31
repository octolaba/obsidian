---
uid: 26eb7196-a166-5b0a-b05b-c731c3dc8e36
xid:
  - update-title-on-rename
aliases:
  - update-title-on-rename
  - Update Title on Rename
  - r3fuze/obsidian-update-title-on-rename
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/update-title-on-rename
alt:
  - https://github.com/r3fuze/obsidian-update-title-on-rename
downloads: 127
updated at: "2026-05-13T08:06:10Z"
related to:
  - "[[GitHub - 1168452738]]"
remind me:
---

# Update Title on Rename

Keeps the frontmatter title in sync when a file is renamed. On a rename the existing title is compared with the old filename and, if the two match, the new filename is written; a title that was customised is left alone. The frontmatter key is configurable, a title property can optionally be added to files that lack one, and a full sync mode always updates the title.

```cue
plugin: {
    id:     "update-title-on-rename"
    name:   "Update Title on Rename"
    author: "fz"
    repo:   "r3fuze/obsidian-update-title-on-rename"

    html_url:    "https://community.obsidian.md/plugins/update-title-on-rename"
    github_url:  "https://github.com/r3fuze/obsidian-update-title-on-rename"
    description: "Automatically keep your frontmatter title in sync when renaming files, updating it to match the new filename while preserving any custom titles you've set. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Automatically keep your frontmatter title property in sync when you rename files in Obsidian. When you rename a file, the plugin checks if your frontmatter title matches the old filename. If it does, it updates it to the new filename. If you've customized the title, it leaves it alone. You can configure which frontmatter key to use, optionally add a title property when renaming files that don't have one, and enable full sync mode if you want to always update titles. Useful if you like having your frontmatter reflect your file organization without worrying about accidentally overwriting titles you've intentionally set."

    stats: {
        downloads:  127
        updated_at: 1778659570000
    }
}
```

[^template]: [[Obsidian plugin]]
