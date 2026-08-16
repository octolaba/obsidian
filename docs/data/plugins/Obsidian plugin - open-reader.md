---
uid: 94b7338f-4d15-559b-84e7-9f2ed9c6eb40
xid:
  - open-reader
aliases:
  - open-reader
  - Open Reader
  - lornezhang66/open-reader
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/open-reader
alt:
  - https://github.com/lornezhang66/open-reader
downloads: 246
updated at: "2026-07-20T14:53:40Z"
related to:
  - "[[GitHub - 1249862435]]"
remind me:
---

# Open Reader

Open Reader reads selected text or a whole Markdown note aloud through a local ttsctl command-line tool, keeping text-to-speech offline and local-first. Long notes are split into chunks and YAML and Markdown formatting is stripped, with fenced code optionally skipped. The generated WAV files play inside Obsidian from a floating controller that pauses, resumes, stops and manages the output files. Because it calls a local CLI, it runs on desktop only.

```cue
plugin: {
    id:     "open-reader"
    name:   "Open Reader"
    author: "lornezhang"
    repo:   "lornezhang66/open-reader"

    html_url:    "https://community.obsidian.md/plugins/open-reader"
    github_url:  "https://github.com/lornezhang66/open-reader"
    description: "Obsidian local TTS plugin for reading selected text and Markdown notes aloud with an offline text-to-speech CLI. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Read selected text or entire Markdown notes aloud with a local ttsctl CLI for offline, local-first text-to-speech. Split long notes into chunks, strip YAML and Markdown formatting (optionally skip fenced code), generate and play WAV files inside Obsidian with a floating controller to pause, resume, stop, and manage output files. Run on Obsidian desktop only since the plugin calls a local CLI."

    stats: {
        downloads:  246
        updated_at: 1784559220000
    }
}
```

[^template]: [[Obsidian plugin]]
