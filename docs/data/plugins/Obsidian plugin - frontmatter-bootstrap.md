---
uid: 98fd7249-75a8-5f6b-96e0-6d802b09cef0
xid:
  - frontmatter-bootstrap
aliases:
  - frontmatter-bootstrap
  - Frontmatter Bootstrap
  - gmcheck/frontmatter-bootstrap
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/frontmatter-bootstrap
alt:
  - https://github.com/gmcheck/frontmatter-bootstrap
downloads: 38
updated at: "2026-07-29T00:46:06Z"
related to:
  - "[[GitHub - 1314996472]]"
remind me:
---

# Frontmatter Bootstrap

Inserts a configurable YAML frontmatter template into new, empty Markdown files while leaving any keys already present untouched, and refreshes an updated date when a note is saved. A read-only Metadata Health Check runs over a note, a folder or the whole vault and reports core fields that are missing or that do not match the configured vocabulary. It works locally alongside Obsidian Properties, Dataview and Bases.

```cue
plugin: {
    id:     "frontmatter-bootstrap"
    name:   "Frontmatter Bootstrap"
    author: "Joe"
    repo:   "gmcheck/frontmatter-bootstrap"

    html_url:    "https://community.obsidian.md/plugins/frontmatter-bootstrap"
    github_url:  "https://github.com/gmcheck/frontmatter-bootstrap"
    description: "Auto-insert stable YAML frontmatter metadata template on new notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bootstrap a stable YAML frontmatter convention by inserting a configurable template into new empty Markdown files and preserving any existing keys. Update the updated date on save and run a read-only Metadata Health Check across a note, folder, or vault to report missing or vocabulary-mismatched core fields; works locally with Obsidian Properties, Dataview, and Bases."

    stats: {
        downloads:  38
        updated_at: 1785285966000
    }
}
```

[^template]: [[Obsidian plugin]]
