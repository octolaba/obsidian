---
uid: 28f89f56-507d-5136-9e45-67381b8ca9c9
xid:
  - obsidian-dropbox-backups
aliases:
  - obsidian-dropbox-backups
  - Aut-O-Backups
  - ryanpcmcquen/obsidian-dropbox-backups
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-dropbox-backups
alt:
  - https://github.com/ryanpcmcquen/obsidian-dropbox-backups
downloads: 11791
updated at: "2021-12-27T05:20:30Z"
related to:
  - "[[GitHub - 369670376]]"
remind me:
---

# Aut-O-Backups

Aut-O-Backups copies the entire vault to Dropbox every 20 minutes, starting after a ten-minute delay, and a ribbon icon triggers a manual backup at any time. Backups are written under a dated path inside the Obsidian Backups app folder, down to the time with fractional seconds so that they do not collide, and non-text files can be excluded so that only md, org and txt files are uploaded.

```cue
plugin: {
    id:     "obsidian-dropbox-backups"
    name:   "Aut-O-Backups"
    author: "ryanpcmcquen"
    repo:   "ryanpcmcquen/obsidian-dropbox-backups"

    html_url:    "https://community.obsidian.md/plugins/obsidian-dropbox-backups"
    github_url:  "https://github.com/ryanpcmcquen/obsidian-dropbox-backups"
    description: "Automated Dropbox backups of your entire vault."
    about:       "Back up your entire vault to Dropbox every 20 minutes, starting after a 10-minute delay, and trigger manual backups anytime from the ribbon icon. Save backups under /Apps/Obsidian Backups/VAULT_NAME/YEAR/MONTH/DAY/TIME_WITH_FRACTIONAL_SECONDS to avoid collisions, and optionally exclude non-text files so only md, org and txt files are uploaded."

    stats: {
        downloads:  11791
        updated_at: 1640582430000
    }
}
```

[^template]: [[Obsidian plugin]]
