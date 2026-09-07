---
uid: 95398684-d8e3-5b98-9b34-c0eac93f5681
xid:
  - local-voiceover
aliases:
  - local-voiceover
  - Local Voiceover - Private TTS
  - giacolees/obsidian-local-voiceover
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/local-voiceover
alt:
  - https://github.com/giacolees/obsidian-local-voiceover
downloads: 58
updated at: "2026-07-26T16:52:55Z"
related to:
  - "[[GitHub - 1312202782]]"
remind me:
---

# Local Voiceover - Private TTS

Speaks the selected text with the Inflect Micro v2 model run locally through ONNX Runtime Web and WebAssembly, so note content stays on the machine. The model is cached after the first run so playback works offline. Long passages are synthesized in a background worker to keep the editor responsive.

```cue
plugin: {
    id:     "local-voiceover"
    name:   "Local Voiceover - Private TTS"
    author: "giacolees"
    repo:   "giacolees/obsidian-local-voiceover"

    html_url:    "https://community.obsidian.md/plugins/local-voiceover"
    github_url:  "https://github.com/giacolees/obsidian-local-voiceover"
    description: "Speak selected text with local Inflect Micro v2 synthesis. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Turn selected text into speech instantly using Inflect Micro v2 locally via ONNX Runtime Web and WebAssembly so your notes never leave your machine. Cache the model locally after first run for offline playback and synthesize long passages in a background worker to keep the editor responsive."

    stats: {
        downloads:  58
        updated_at: 1785084775000
    }
}
```

[^template]: [[Obsidian plugin]]
