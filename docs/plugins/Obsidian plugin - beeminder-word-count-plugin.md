---
uid: 5d757b29-3bef-5f8e-bf7b-fc4f7aa21e3e
xid:
  - beeminder-word-count-plugin
aliases:
  - beeminder-word-count-plugin
  - Beeminder Word Count Plugin
  - kenzan100/beeminder-obsidian-word-count
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/beeminder-word-count-plugin
alt:
  - https://github.com/kenzan100/beeminder-obsidian-word-count
downloads: 4358
updated at: "2021-05-09T22:00:26Z"
related to:
  - "[[GitHub - 363487558]]"
remind me:
---

# Beeminder Word Count Plugin

Beeminder Word Count Plugin posts a word count from the active editor to a Beeminder goal. Only the current selection is counted, which avoids reporting the same text twice, and the value is submitted using the configured goal name and auth token.

```cue
plugin: {
    id:     "beeminder-word-count-plugin"
    name:   "Beeminder Word Count Plugin"
    author: "kenzan100"
    repo:   "kenzan100/beeminder-obsidian-word-count"

    html_url:    "https://community.obsidian.md/plugins/beeminder-word-count-plugin"
    github_url:  "https://github.com/kenzan100/beeminder-obsidian-word-count"
    description: "Post word counts directly to Beeminder."
    about:       "Send the selected text's word count from the active editor to a Beeminder goal. Count only the active selection to avoid duplicate reporting and submit the value to your Beeminder account using your goal name and auth token."

    stats: {
        downloads:  4358
        updated_at: 1620597626000
    }
}
```

[^template]: [[Obsidian plugin]]
