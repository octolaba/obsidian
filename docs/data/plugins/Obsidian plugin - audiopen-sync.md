---
uid: 1c846e26-128d-5f08-a8aa-d36b5c6062b6
xid:
  - audiopen-sync
aliases:
  - audiopen-sync
  - AudioPen Sync
  - jonashaefele/audiopen-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/audiopen-sync
alt:
  - https://github.com/jonashaefele/audiopen-obsidian
downloads: 606
updated at: "2024-12-23T22:13:30Z"
related to:
  - "[[GitHub - 797110356]]"
remind me:
---

# AudioPen Sync

Syncs the vault with AudioPen and VoiceNotes, transcribing audio files and inserting the transcripts into notes. Updates arrive through a webhook, and custom templates with variables for title, body, original transcript, id and creation date decide how a transcript is created or appended.

```cue
plugin: {
    id:     "audiopen-sync"
    name:   "AudioPen Sync"
    author: "jonashaefele"
    repo:   "jonashaefele/audiopen-obsidian"

    html_url:    "https://community.obsidian.md/plugins/audiopen-sync"
    github_url:  "https://github.com/jonashaefele/audiopen-obsidian"
    description: "Sync notes from AudioPen."
    about:       "Sync Obsidian with AudioPen and VoiceNotes to transcribe audio files and insert transcripts directly into your notes. Use webhook-driven updates and custom templates with variables like {title}, {body}, {orig_transcript}, {id}, and {date_created} to create or append formatted transcripts."

    stats: {
        downloads:  606
        updated_at: 1734992010000
    }
}
```

[^template]: [[Obsidian plugin]]
