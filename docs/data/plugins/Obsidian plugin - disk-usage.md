---
uid: a1081ae8-8f64-5791-b3f8-04aefe0f98d5
xid:
  - disk-usage
aliases:
  - disk-usage
  - Disk Usage
  - promptier/disk-usage
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/disk-usage
alt:
  - https://github.com/promptier/disk-usage
downloads: 3326
updated at: "2023-10-22T20:35:18Z"
related to:
  - "[[GitHub - 705920625]]"
remind me:
---

# Disk Usage

Aggregates file sizes across the vault into totals per folder and per file type. Results are written as a Markdown report, with the raw data also exposed for browsing in developer tools. Only file sizes are measured, not operating-system disk allocation, and the hidden .obsidian metadata folder is excluded.

```cue
plugin: {
    id:     "disk-usage"
    name:   "Disk Usage"
    author: "promptier"
    repo:   "promptier/disk-usage"

    html_url:    "https://community.obsidian.md/plugins/disk-usage"
    github_url:  "https://github.com/promptier/disk-usage"
    description: "Measure disk usage for tracking size of folders and file types."
    about:       "Aggregate file sizes across your vault to produce totals broken down by folder and file type. Generate a Markdown report and expose the raw data for browsing in developer tools. Measure file sizes only (not OS disk allocation) and exclude hidden .obsidian metadata."

    stats: {
        downloads:  3326
        updated_at: 1698006918000
    }
}
```

[^template]: [[Obsidian plugin]]
