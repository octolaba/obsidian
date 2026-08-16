---
uid: 8c901d24-d75a-5ed2-8ace-6d72a36e083d
xid:
  - open-note-to-window-title
aliases:
  - open-note-to-window-title
  - Custom window title
  - jplattel/open-note-to-window-title
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/open-note-to-window-title
alt:
  - https://github.com/jplattel/open-note-to-window-title
downloads: 16042
updated at: "2022-05-23T17:54:34Z"
related to:
  - "[[GitHub - 338442190]]"
remind me:
---

# Custom window title

Custom window title shows the currently open note in the Obsidian window title, which gives context when switching between applications. The title is templated with placeholders for filename, filepath, vault and workspace, or with frontmatter keys, so it can carry file- or project-specific labels.

```cue
plugin: {
    id:     "open-note-to-window-title"
    name:   "Custom window title"
    author: "jplattel"
    repo:   "jplattel/open-note-to-window-title"

    html_url:    "https://community.obsidian.md/plugins/open-note-to-window-title"
    github_url:  "https://github.com/jplattel/open-note-to-window-title"
    description: "Show the current open note in the window title."
    about:       "Add the current open note to the Obsidian window title to track activity and provide context when switching apps. Template the title with {{filename}}, {{filepath}}, {{vault}}, {{workspace}} or frontmatter keys to show file- or project-specific labels."

    stats: {
        downloads:  16042
        updated_at: 1653328474000
    }
}
```

[^template]: [[Obsidian plugin]]
