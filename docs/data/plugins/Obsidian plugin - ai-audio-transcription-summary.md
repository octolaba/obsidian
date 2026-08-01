---
uid: 1c31c2f6-7913-58e6-9773-6f514da15873
xid:
  - ai-audio-transcription-summary
aliases:
  - ai-audio-transcription-summary
  - AI Audio Transcription and Summary
  - hackerhomelab/AITranscribe
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ai-audio-transcription-summary
alt:
  - https://github.com/hackerhomelab/AITranscribe
downloads: 444
updated at: "2026-07-09T11:32:19Z"
related to:
  - "[[GitHub - 1258806290]]"
remind me:
---

# AI Audio Transcription and Summary

AI Audio Transcription and Summary records meetings, lectures or voice notes inside Obsidian on macOS and iOS, with a waveform and timer while recording. Audio is chunked automatically to stay under provider payload limits and transcribed with Whisper or Gemini, then formatted or summarized by Claude, GPT or Gemini. If a request fails the raw recording is saved locally in the vault and linked in the note, and summaries are inserted at the cursor or generated as standalone notes from templates.

```cue
plugin: {
    id:     "ai-audio-transcription-summary"
    name:   "AI Audio Transcription and Summary"
    author: "HackerHomeLab"
    repo:   "hackerhomelab/AITranscribe"

    html_url:    "https://community.obsidian.md/plugins/ai-audio-transcription-summary"
    github_url:  "https://github.com/hackerhomelab/AITranscribe"
    description: "Record audio meetings locally, auto-chunk, and transcribe using Whisper or Gemini, then summarize using your LLM of choice. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "If you appreciate this - Please donate to continue to build the plugin: https://ko-fi.com/hackerh AI Audio Transcription & Summary is a premium Obsidian plugin (macOS & iOS) to record meetings, lectures, or voice notes directly inside your notes. It features dual-provider transcription and multi-LLM post-processing, combined with a robust local backup safeguard. Key Features: Direct Recording: Record high-quality audio inside Obsidian with active waveforms and timers. Whisper & Gemini Transcription: Automatic audio chunking (22MB for Whisper, 10MB for Gemini) to bypass API payload limits. LLM Summary & Formatting: Auto-format transcripts using Claude, GPT, or Gemini. Fail-Safe Recovery: If API or network requests fail, your raw audio recording is saved locally inside your vault and linked in your note so you never lose a file. Flexible Insertion: Insert summaries directly at your cursor or generate standalone notes from templates. Support development: https://ko-fi.com/hackerhomelab"

    stats: {
        downloads:  444
        updated_at: 1783596739000
    }
}
```

[^template]: [[Obsidian plugin]]
