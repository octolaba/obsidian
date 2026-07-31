---
uid: 2f320c73-0f4a-53a9-8962-4a97823b6f1d
xid:
  - title-sync
aliases:
  - title-sync
  - Title Sync
  - igor-kupczynski/obsidian-title-sync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/title-sync
alt:
  - https://github.com/igor-kupczynski/obsidian-title-sync-plugin
downloads: 117
updated at: "2026-01-24T10:37:19Z"
related to:
  - "[[GitHub - 1138281130]]"
remind me:
---

# Title Sync

Title Sync copies the first H1 header after the frontmatter into the file name through a manual command. Markdown formatting is stripped, code blocks skipped, illegal filename characters replaced with dashes and the result truncated to 200 characters for cross-platform safety, with a notification reporting success or failure.

```cue
plugin: {
    id:     "title-sync"
    name:   "Title Sync"
    author: "igor-kupczynski"
    repo:   "igor-kupczynski/obsidian-title-sync-plugin"

    html_url:    "https://community.obsidian.md/plugins/title-sync"
    github_url:  "https://github.com/igor-kupczynski/obsidian-title-sync-plugin"
    description: "Sync the first H1 header with the filename via a manual command. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync the first H1 header after frontmatter to the file name using a manual command. Strip markdown formatting, skip code blocks, replace illegal filename characters with dashes, truncate to 200 characters for cross-platform safety, and show success or failure notifications."

    stats: {
        downloads:  117
        updated_at: 1769251039000
    }
}
```

[^template]: [[Obsidian plugin]]
