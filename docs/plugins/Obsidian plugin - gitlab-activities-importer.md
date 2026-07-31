---
uid: b3d8f2a4-b2cc-5165-9d15-1bea6e185703
xid:
  - gitlab-activities-importer
aliases:
  - gitlab-activities-importer
  - GitLab Activities Importer
  - anindyaspaul/obsidian-gitlab-activities-importer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gitlab-activities-importer
alt:
  - https://github.com/anindyaspaul/obsidian-gitlab-activities-importer
downloads: 100
updated at: "2026-03-14T17:11:08Z"
related to:
  - "[[GitHub - 944606308]]"
remind me:
---

# GitLab Activities Importer

Imports GitLab activities into the active daily note through the GitLab REST API, matching events to the note's date taken from its filename. It works with gitlab.com and self-managed instances, replaces a dedicated section on each run so repeated imports stay idempotent, and includes push metadata such as branch, commit count and the latest commit title.

```cue
plugin: {
    id:     "gitlab-activities-importer"
    name:   "GitLab Activities Importer"
    author: "anindyaspaul"
    repo:   "anindyaspaul/obsidian-gitlab-activities-importer"

    html_url:    "https://community.obsidian.md/plugins/gitlab-activities-importer"
    github_url:  "https://github.com/anindyaspaul/obsidian-gitlab-activities-importer"
    description: "Imports GitLab daily activities into the active daily note. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import GitLab activities into the active daily note via the GitLab REST API, matching events to the note's date based on the filename. Support GitLab.com and self‑managed instances, replace a dedicated section on each run for idempotent updates, and include push metadata like branch, commit count, and latest commit title."

    stats: {
        downloads:  100
        updated_at: 1773508268000
    }
}
```

[^template]: [[Obsidian plugin]]
