---
uid: f6daee73-1b63-5849-ae58-55de112918b3
xid:
  - note-codes
aliases:
  - note-codes
  - Note Codes
  - silverezhik/obsidian-note-codes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/note-codes
alt:
  - https://github.com/silverezhik/obsidian-note-codes
downloads: 1441
updated at: "2025-08-28T00:01:42Z"
related to:
  - "[[GitHub - 1018815062]]"
remind me:
---

# Note Codes

Note Codes assigns every note a four-character code that can be used to reference it from other notes or from handwritten references. The code appears in the status bar and the metadata pane, where clicking it opens the note-code search or copies the code or its URL, and a note can also be opened through an obsidian://note-codes/open URI. Codes are derived from each note's path, update when a note is renamed, and ambiguous letters are handled.

```cue
plugin: {
    id:     "note-codes"
    name:   "Note Codes"
    author: "silverezhik"
    repo:   "silverezhik/obsidian-note-codes"

    html_url:    "https://community.obsidian.md/plugins/note-codes"
    github_url:  "https://github.com/silverezhik/obsidian-note-codes"
    description: "Reference your notes from anywhere with simple 4-character codes."
    about:       "Assign 4-character codes to every note for quick cross-references from other notes or handwritten references. Display codes in the status bar and metadata pane, click to open the note-code search or copy the code/URL, and open notes via obsidian://note-codes/open?code=XX-XX; codes derive from each note's path and update on rename with ambiguous letters handled."

    stats: {
        downloads:  1441
        updated_at: 1756339302000
    }
}
```

[^template]: [[Obsidian plugin]]
