---
uid: db5fe253-51a4-5da0-9050-bf894103f0bc
xid:
  - voice-text-input
aliases:
  - voice-text-input
  - Voice2Text
  - chenxuan520/obsidian-voice2text
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/voice-text-input
alt:
  - https://github.com/chenxuan520/obsidian-voice2text
downloads:
updated at:
related to:
  - "[[GitHub - 1312065710]]"
remind me:
---

# Voice2Text

Voice2Text records audio in Obsidian on desktop and inserts the recognized text at the editor cursor, either in real time or once recording stops. Audio goes to the chosen ASR service, streaming over WebSocket for live partial transcription or uploaded as WAV for a final transcript, with Volcengine and Xiaomi MiMo supported. API credentials are stored locally in the vault.

```cue
plugin: {
    id:     "voice-text-input"
    name:   "Voice2Text"
    author: "chenxuan"
    repo:   "chenxuan520/obsidian-voice2text"

    html_url:    "https://community.obsidian.md/plugins/voice-text-input"
    github_url:  "https://github.com/chenxuan520/obsidian-voice2text"
    description: "Dictate notes with streaming Volcengine ASR or Xiaomi MiMo ASR. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Record audio in Obsidian desktop and insert recognized text at the editor cursor in real time or after stopping. Send audio to the chosen ASR service—stream via WebSocket for live partial transcription or upload WAV for a final transcript—and store API credentials locally in the vault."
}
```

[^template]: [[Obsidian plugin]]
