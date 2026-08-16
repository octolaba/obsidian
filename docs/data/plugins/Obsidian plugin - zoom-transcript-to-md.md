---
uid: 2a6960b6-25fe-5c20-b94f-24d0275b4322
xid:
  - zoom-transcript-to-md
aliases:
  - zoom-transcript-to-md
  - Meeting Transcript Converter
  - ibatura/obsidian-meeting-transcript-converter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/zoom-transcript-to-md
alt:
  - https://github.com/ibatura/obsidian-meeting-transcript-converter
downloads: 93
updated at: "2026-07-05T21:44:18Z"
related to:
  - "[[GitHub - 1290138920]]"
remind me:
---

# Meeting Transcript Converter

This plugin converts .txt and .vtt meeting transcripts into clean Markdown offline, rendering WebVTT cues as bulleted items that can be prefixed with timestamps based on the file creation time. A watched folder converts new files automatically, YAML frontmatter carrying meeting_name, date, duration and participants is added, and the original file can optionally be deleted.

```cue
plugin: {
    id:     "zoom-transcript-to-md"
    name:   "Meeting Transcript Converter"
    author: "Ivan Batura"
    repo:   "ibatura/obsidian-meeting-transcript-converter"

    html_url:    "https://community.obsidian.md/plugins/zoom-transcript-to-md"
    github_url:  "https://github.com/ibatura/obsidian-meeting-transcript-converter"
    description: "Convert .txt or .vtt meeting transcript files into cleaned .md notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert .txt and .vtt meeting transcripts to clean Markdown offline, render WebVTT cues as bulleted items, and optionally prefix bullets with timestamps based on the file creation time. Watch a folder to auto-convert new files, add YAML frontmatter with meeting_name, date, duration and participants, and optionally delete the original."

    stats: {
        downloads:  93
        updated_at: 1783287858000
    }
}
```

[^template]: [[Obsidian plugin]]
