---
uid: a14e5c26-e761-5f82-a16a-1560dde19b10
xid:
  - meeting-detector
aliases:
  - meeting-detector
  - Meeting Detector
  - yut0takagi/obsidian-meeting-detector
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/meeting-detector
alt:
  - https://github.com/yut0takagi/obsidian-meeting-detector
downloads: 254
updated at: "2026-05-30T17:00:26Z"
related to:
  - "[[GitHub - 1202415352]]"
remind me:
---

# Meeting Detector

Detects Zoom, Google Meet and Teams on macOS and prompts to start a recording, create a meeting note, or both. Notes are created from a template carrying date, time and application placeholders, and recordings stop automatically or raise a notification when the meeting ends. The recorded text states that recording uses the Audio Recorder core plugin.

```cue
plugin: {
    id:     "meeting-detector"
    name:   "Meeting Detector"
    author: "Yuto Takagi"
    repo:   "yut0takagi/obsidian-meeting-detector"

    html_url:    "https://community.obsidian.md/plugins/meeting-detector"
    github_url:  "https://github.com/yut0takagi/obsidian-meeting-detector"
    description: "Auto-detect online meetings (Zoom, Google Meet, Teams) and prompt to record or create meeting notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Detect Zoom, Google Meet, and Teams on macOS and prompt to start recording, create a meeting note, or both. Create templated notes with {{date}}, {{time}} and {{app}}, and optionally auto-stop recordings or notify when meetings end. Use the Audio Recorder core plugin for recording."

    stats: {
        downloads:  254
        updated_at: 1780160426000
    }
}
```

[^template]: [[Obsidian plugin]]
