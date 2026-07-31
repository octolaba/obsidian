---
uid: aab1224e-cc35-5936-82eb-f51f300f7814
xid:
  - active-note
aliases:
  - active-note
  - Active Note
  - davidszp/obsidian-active-note
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/active-note
alt:
  - https://github.com/davidszp/obsidian-active-note
downloads: 407
updated at: "2026-02-02T15:47:30Z"
related to:
  - "[[GitHub - 1147833658]]"
remind me:
---

# Active Note

Active Note writes the path of the active note, and any selected text, into a JSON pointer file inside the vault configuration folder. The file records the vault-relative path plus the optional selection with 1-indexed start and end line numbers, so external scripts, command-line tools and assistants can read the current context.

```cue
plugin: {
    id:     "active-note"
    name:   "Active Note"
    author: "davidszp"
    repo:   "davidszp/obsidian-active-note"

    html_url:    "https://community.obsidian.md/plugins/active-note"
    github_url:  "https://github.com/davidszp/obsidian-active-note"
    description: "Writes the active note path and selection to a JSON pointer file for external tool integration (e.g. Claude Code, Gemini CLI etc.). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expose the active note and any selected text to external tools by writing a JSON pointer file (.obsidian/active-note.json). Include the vault-relative path plus optional selection text and 1-indexed start/end line numbers so scripts, CLIs, and assistants can read current context."

    stats: {
        downloads:  407
        updated_at: 1770047250000
    }
}
```

[^template]: [[Obsidian plugin]]
