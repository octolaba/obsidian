---
uid: b83ba908-115b-5d7b-9c5c-2db51502651d
xid:
  - obsidian-save-as-gist
aliases:
  - obsidian-save-as-gist
  - Save as Gist
  - ghedamat/obsidian-save-as-gist
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-save-as-gist
alt:
  - https://github.com/ghedamat/obsidian-save-as-gist
downloads: 4398
updated at: "2022-01-25T03:36:12Z"
related to:
  - "[[GitHub - 448434840]]"
remind me:
---

# Save as Gist

This plugin saves the current note, or a selected range of it, as a private GitHub Gist. It requires a GitHub API token with permission to create gists and copies the created Gist URL to the clipboard. Public gists and updates to existing gists are not supported.

```cue
plugin: {
    id:     "obsidian-save-as-gist"
    name:   "Save as Gist"
    author: "ghedamat"
    repo:   "ghedamat/obsidian-save-as-gist"

    html_url:    "https://community.obsidian.md/plugins/obsidian-save-as-gist"
    github_url:  "https://github.com/ghedamat/obsidian-save-as-gist"
    description: "Save current note as a GitHub Gist."
    about:       "Save the current file or a selected range to a private GitHub Gist. Provide a GitHub API token with \"Create Gist\" permission to create gists and copy the created Gist URL to your clipboard; public gists and gist updates are not supported."

    stats: {
        downloads:  4398
        updated_at: 1643081772000
    }
}
```

[^template]: [[Obsidian plugin]]
