---
uid: 7da5a9db-c4fa-52de-9876-3f8c9a74dbd0
xid:
  - unlink-on-delete
aliases:
  - unlink-on-delete
  - Unlink on Delete
  - lorite/obsidian-unlink-on-delete
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/unlink-on-delete
alt:
  - https://github.com/lorite/obsidian-unlink-on-delete
downloads: 28
updated at: "2026-08-09T17:23:23Z"
related to:
  - "[[GitHub - 1328924319]]"
remind me:
---

# Unlink on Delete

Rewrites links that pointed at a deleted note so they no longer reference a missing file. Deletion can happen normally with cleanup afterwards, or through the plugin's own delete command, which previews and confirms the edits across notes and folders before the file is removed. Only links that resolved to the deleted file are touched, and unresolved placeholder links to notes that never existed are left alone.

```cue
plugin: {
    id:     "unlink-on-delete"
    name:   "Unlink on Delete"
    author: "Alejandro Lorite Mora"
    repo:   "lorite/obsidian-unlink-on-delete"

    html_url:    "https://community.obsidian.md/plugins/unlink-on-delete"
    github_url:  "https://github.com/lorite/obsidian-unlink-on-delete"
    description: "When you delete a file, clean up the links that pointed to it instead of leaving them broken. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Remove links to a note when its file is deleted, rewriting references so they no longer point to a missing file. Choose to delete normally and clean up afterward, or use the plugin's delete command to preview and confirm edits across notes and folders before removal. Touch only links that referenced the deleted file, leaving unresolved placeholder links to non-existent notes untouched."

    stats: {
        downloads:  28
        updated_at: 1786296203000
    }
}
```

[^template]: [[Obsidian plugin]]
