---
uid: 8a35ff3f-c08b-5ac3-9d57-fe9e687e77ad
xid:
  - voxnote
aliases:
  - voxnote
  - VoxNote
  - moonjuun/obsidian-voxnote
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/voxnote
alt:
  - https://github.com/moonjuun/obsidian-voxnote
downloads: 261
updated at: "2026-05-21T04:14:53Z"
related to:
  - "[[GitHub - 1236097416]]"
remind me:
---

# VoxNote

VoxNote transcribes meeting recordings into Markdown through Deepgram, labelling each line by speaker with an HH:MM:SS timestamp. Google Gemini can then produce structured digests covering action items, decisions and key quotes, backlinked to the transcript and driven by editable Markdown templates. It creates its own vault folder, defaults to zero-retention speech-to-text, and runs on mobile with an English or Korean interface.

```cue
plugin: {
    id:     "voxnote"
    name:   "VoxNote"
    author: "Moonjuun"
    repo:   "moonjuun/obsidian-voxnote"

    html_url:    "https://community.obsidian.md/plugins/voxnote"
    github_url:  "https://github.com/moonjuun/obsidian-voxnote"
    description: "Transcribe meeting recordings via Deepgram, then generate template-based AI summaries via Gemini. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Transcribe meeting recordings into Markdown with per-speaker [HH:MM:SS] timestamps using Deepgram. Generate optional Google Gemini summaries as structured digests (action items, decisions, key quotes) backlinked to transcripts and driven by editable Markdown templates in VoxNote/Templates. Auto-create a VoxNote/ vault folder, default to zero-retention for STT, and run on mobile with English/Korean UI."

    stats: {
        downloads:  261
        updated_at: 1779336893000
    }
}
```

[^template]: [[Obsidian plugin]]
