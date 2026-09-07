---
uid: b791053f-835b-5c5f-bfd9-ead888f85722
xid:
  - frontmatter-date-manager
aliases:
  - frontmatter-date-manager
  - Frontmatter Date Manager
  - smetdenis/obsidian-frontmatter-date-manager
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/frontmatter-date-manager
alt:
  - https://github.com/smetdenis/obsidian-frontmatter-date-manager
downloads: 1908
updated at: "2026-08-09T09:57:47Z"
related to:
  - "[[GitHub - 1208052720]]"
remind me:
---

# Frontmatter Date Manager

Maintains created, updated and viewed date properties in a note's YAML frontmatter: created is stamped on file creation, updated refreshed on every real edit, and viewed optionally recorded each time a note is opened. SHA-256 content hashing is used to detect genuine changes so that sync tools do not trigger false updates, and a configurable delay is meant to keep it compatible with Templater, Daily Notes and QuickAdd. The date format, an IANA timezone and gitignore-style filter rules are configurable, and bulk tools populate timestamps from filesystem dates, rename keys, reformat dates and fix updated-before-created inversions with dry-run previews.

```cue
plugin: {
    id:     "frontmatter-date-manager"
    name:   "Frontmatter Date Manager"
    author: "Denis"
    repo:   "smetdenis/obsidian-frontmatter-date-manager"

    html_url:    "https://community.obsidian.md/plugins/frontmatter-date-manager"
    github_url:  "https://github.com/smetdenis/obsidian-frontmatter-date-manager"
    description: "Automatically update created, modified, and last-viewed dates in frontmatter when editing notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Automatically maintain created, updated, and viewed date properties in your notes' YAML frontmatter. Frontmatter Date Manager stamps created on file creation, refreshes updated on every real edit, and can optionally record viewed each time you open a note - a unique feature for spaced-repetition and review workflows with Dataview. SHA-256 content hashing detects genuine changes, so sync tools (Obsidian Sync, iCloud, Syncthing, Dropbox, Git) never trigger false updates. A configurable delay keeps it compatible with Templater, Daily Notes, and QuickAdd. Pick any date format (date-fns syntax), set an IANA timezone, and use gitignore-style filter rules to control which files are tracked. Powerful bulk tools populate timestamps from filesystem dates, rename frontmatter keys, reformat existing dates, and fix updated-before-created inversions - all with dry-run previews."

    stats: {
        downloads:  1908
        updated_at: 1786269467000
    }
}
```

[^template]: [[Obsidian plugin]]
