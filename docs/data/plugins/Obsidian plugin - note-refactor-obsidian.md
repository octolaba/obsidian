---
uid: a1b30eb9-e210-501d-8429-2ad4ca683453
xid:
  - note-refactor-obsidian
aliases:
  - note-refactor-obsidian
  - Note Refactor
  - lynchjames/note-refactor-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/note-refactor-obsidian
alt:
  - https://github.com/lynchjames/note-refactor-obsidian
downloads: 338926
updated at: "2023-09-18T23:06:00Z"
related to:
  - "[[GitHub - 307868592]]"
remind me:
---

# Note Refactor

Extracts selected text into a new note, either taking the first line as the filename or prompting for a name, and can split notes this way. The original selection is replaced with a link to the new note, and characters are sanitized so the resulting filename is valid.

```cue
plugin: {
    id:     "note-refactor-obsidian"
    name:   "Note Refactor"
    author: "lynchjames"
    repo:   "lynchjames/note-refactor-obsidian"

    html_url:    "https://community.obsidian.md/plugins/note-refactor-obsidian"
    github_url:  "https://github.com/lynchjames/note-refactor-obsidian"
    description: "Extract note content into new notes and split notes."
    about:       "Extract selected text into a new note, optionally use the first line as the filename or prompt for a name. Replace the original selection with a link to the new note and sanitize characters to produce a valid filename."

    stats: {
        downloads:  338926
        updated_at: 1695078360000
    }
}
```

[^template]: [[Obsidian plugin]]
