---
uid: ac137585-b4f3-53d8-9590-ba0b60657df1
xid:
  - safe-filename-linter
aliases:
  - safe-filename-linter
  - Safe Filename Linter
  - sneakyfoxes/obsidian-safe-filename-linter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/safe-filename-linter
alt:
  - https://github.com/sneakyfoxes/obsidian-safe-filename-linter
downloads: 6012
updated at: "2023-08-08T01:46:28Z"
related to:
  - "[[GitHub - 675442108]]"
remind me:
---

# Safe Filename Linter

Safe Filename Linter checks vault filenames for characters that are invalid or troublesome, such as pipes, colons and brackets, and flags names that may break on Android or across sync. Flagged files can be renamed by replacing those characters with substitutes you choose, going through Obsidian's own renaming calls so that link-update settings are respected.

```cue
plugin: {
    id:     "safe-filename-linter"
    name:   "Safe Filename Linter"
    author: "sneakyfoxes"
    repo:   "sneakyfoxes/obsidian-safe-filename-linter"

    html_url:    "https://community.obsidian.md/plugins/safe-filename-linter"
    github_url:  "https://github.com/sneakyfoxes/obsidian-safe-filename-linter"
    description: "Lint filenames for invalid or troublesome characters."
    about:       "Lint filenames for invalid or troublesome characters like pipes, colons, and brackets, and spot names that may break on Android or across sync. Rename files by replacing flagged characters with chosen substitutes while using Obsidian's renaming calls and respecting link-update settings."

    stats: {
        downloads:  6012
        updated_at: 1691459188000
    }
}
```

[^template]: [[Obsidian plugin]]
