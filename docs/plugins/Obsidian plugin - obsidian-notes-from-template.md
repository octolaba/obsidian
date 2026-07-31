---
uid: 13b605f6-fdd3-5d60-ab26-a3bc6617c47b
xid:
  - obsidian-notes-from-template
aliases:
  - obsidian-notes-from-template
  - From Template
  - mo-seph/obsidian-note-from-template
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-notes-from-template
alt:
  - https://github.com/mo-seph/obsidian-note-from-template
downloads: 14653
updated at: "2024-08-08T08:43:53Z"
related to:
  - "[[GitHub - 401343564]]"
remind me:
---

# From Template

This plugin creates new notes from files in the templates folder and registers a From Template command for each one. A popup prompts for the Mustache variables in the template and can populate YAML frontmatter. The editor selection can be replaced with a replacement string, or the new note opened in a new pane.

```cue
plugin: {
    id:     "obsidian-notes-from-template"
    name:   "From Template"
    author: "mo-seph"
    repo:   "mo-seph/obsidian-note-from-template"

    html_url:    "https://community.obsidian.md/plugins/obsidian-notes-from-template"
    github_url:  "https://github.com/mo-seph/obsidian-note-from-template"
    description: "Create new notes from Templates - for each Template, provides a Command to trigger it, and a form to fill in any variables in the template."
    about:       "Create notes from files in your templates folder and add a From Template command for each template. Prompt for Mustache variables via a popup, populate YAML frontmatter, and replace the editor selection with a replacement string or open the new note in a new pane."

    stats: {
        downloads:  14653
        updated_at: 1723106633000
    }
}
```

[^template]: [[Obsidian plugin]]
