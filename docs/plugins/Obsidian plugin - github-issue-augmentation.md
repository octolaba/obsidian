---
uid: 243038b2-a921-5826-9494-a4f93c833c5a
xid:
  - github-issue-augmentation
aliases:
  - github-issue-augmentation
  - GitHub Issue Augmentation
  - samprintz/obsidian-issue-augmentation-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/github-issue-augmentation
alt:
  - https://github.com/samprintz/obsidian-issue-augmentation-plugin
downloads: 3847
updated at: "2023-10-14T17:11:21Z"
related to:
  - "[[GitHub - 627768965]]"
remind me:
---

# GitHub Issue Augmentation

Augments bare GitHub issue identifiers in notes with the corresponding issue title and links each title to its repository. Titles are fetched from GitHub or mapped from a CSV file, and the CSV entry is preferred when both sources supply a title.

```cue
plugin: {
    id:     "github-issue-augmentation"
    name:   "GitHub Issue Augmentation"
    author: "samprintz"
    repo:   "samprintz/obsidian-issue-augmentation-plugin"

    html_url:    "https://community.obsidian.md/plugins/github-issue-augmentation"
    github_url:  "https://github.com/samprintz/obsidian-issue-augmentation-plugin"
    description: "Augment GitHub issue IDs."
    about:       "Augment GitHub issue IDs with their titles and link each title to the corresponding repository. Fetch titles from GitHub or map IDs to titles from a CSV file, preferring CSV entries when both sources provide a title."

    stats: {
        downloads:  3847
        updated_at: 1697303481000
    }
}
```

[^template]: [[Obsidian plugin]]
