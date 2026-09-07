---
uid: 200b3a92-7999-5f15-aaed-f8fcfc602518
xid:
  - cleaning-service
aliases:
  - cleaning-service
  - Cleaning Service
  - dpvpro/obsidian-cleaning-service
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cleaning-service
alt:
  - https://github.com/dpvpro/obsidian-cleaning-service
downloads: 221
updated at: "2026-07-11T14:14:08Z"
related to:
  - "[[GitHub - 1066677783]]"
remind me:
---

# Cleaning Service

Runs cleanup passes over the vault, finding and removing orphan attachments, empty files, empty directories, oversized files and notes whose frontmatter expiry date has passed. Files are excluded by Obsidian's own rules or by custom patterns, scans run on demand or at startup, and the results are reviewed before anything moves to trash or is deleted permanently.

```cue
plugin: {
    id:     "cleaning-service"
    name:   "Cleaning Service"
    author: "dpvpro"
    repo:   "dpvpro/obsidian-cleaning-service"

    html_url:    "https://community.obsidian.md/plugins/cleaning-service"
    github_url:  "https://github.com/dpvpro/obsidian-cleaning-service"
    description: "Performs cleanup tasks on the vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Clean and prune your vault by finding and removing orphan attachments, empty files, empty directories, oversized files, and notes expired via a frontmatter date. Exclude files by Obsidian rules or custom patterns, run scans on demand or at startup, review results, and choose trash or permanent deletion."

    stats: {
        downloads:  221
        updated_at: 1783779248000
    }
}
```

[^template]: [[Obsidian plugin]]
