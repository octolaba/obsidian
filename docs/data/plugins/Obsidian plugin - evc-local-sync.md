---
uid: 0bc2dd1d-d831-5e40-818e-93b059610ddf
xid:
  - evc-local-sync
aliases:
  - evc-local-sync
  - EVC Local Sync to AI Agent
  - entire-vc/evc-local-sync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/evc-local-sync
alt:
  - https://github.com/entire-vc/evc-local-sync-plugin
downloads: 981
updated at: "2026-06-29T22:43:58Z"
related to:
  - "[[GitHub - 1145961573]]"
remind me:
---

# EVC Local Sync to AI Agent

Mirrors a chosen vault folder and an external project's documentation folder in both directions on the same machine, without a cloud account. Documentation that a coding assistant writes or edits in the project appears in the notes, and specifications refined in the notes update the project's docs, which is meant to stop the two from drifting apart. Files move directly between the two folders on disk, so the sync works offline, and the paired folders are chosen by the user.

```cue
plugin: {
    id:     "evc-local-sync"
    name:   "EVC Local Sync to AI Agent"
    author: "entire-vc"
    repo:   "entire-vc/evc-local-sync-plugin"

    html_url:    "https://community.obsidian.md/plugins/evc-local-sync"
    github_url:  "https://github.com/entire-vc/evc-local-sync-plugin"
    description: "Keep a vault folder and an external project documentation folder in two-way sync, so your notes and a codebase's docs stay current automatically without manual copy-paste. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Local Sync keeps a chosen vault folder and an external project's documentation folder (for example a repository's docs directory) continuously mirrored in both directions, on your own machine, with no cloud account required. It is built for AI-assisted coding workflows. When a coding assistant such as Cursor, Claude Code, or Copilot writes or edits documentation inside a project, those changes appear in your notes automatically; when you refine specifications in your notes, the project's docs are updated in step. This stops documentation from drifting out of date and removes the manual copy-paste that usually keeps the two in sync. Sync is local-first and bidirectional: files move directly between the two folders on disk, so it works offline and your content never leaves your device. You choose which folders are paired, and edits on either side propagate to the other."

    stats: {
        downloads:  981
        updated_at: 1782773038000
    }
}
```

[^template]: [[Obsidian plugin]]
