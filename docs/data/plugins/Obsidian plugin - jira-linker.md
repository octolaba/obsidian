---
uid: 72deb539-4105-5ca0-a37b-032c7f26a3a2
xid:
  - jira-linker
aliases:
  - jira-linker
  - Jira Linker
  - srz2/obsidian-jira-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/jira-linker
alt:
  - https://github.com/srz2/obsidian-jira-linker
downloads: 4390
updated at: "2024-06-23T01:37:18Z"
related to:
  - "[[GitHub - 709124728]]"
remind me:
---

# Jira Linker

Jira Linker formats a Jira issue tag in the editor as a link, either to the issue on a Jira instance or to a local issue folder and file. Links can point at a default instance or at a specified one, so multiple instances are supported. Missing local issue paths and a main info file are created automatically.

```cue
plugin: {
    id:     "jira-linker"
    name:   "Jira Linker"
    author: "srz2"
    repo:   "srz2/obsidian-jira-linker"

    html_url:    "https://community.obsidian.md/plugins/jira-linker"
    github_url:  "https://github.com/srz2/obsidian-jira-linker"
    description: "Quickly format a Jira issue tag as a link to you Jira instance."
    about:       "Link Jira issues to their web URLs or to local issue folders and files directly from the editor. Insert links to a default or specified Jira instance, support multiple instances, and create missing local issue paths and a main info file automatically."

    stats: {
        downloads:  4390
        updated_at: 1719106638000
    }
}
```

[^template]: [[Obsidian plugin]]
