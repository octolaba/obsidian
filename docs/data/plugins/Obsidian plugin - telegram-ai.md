---
uid: e15140c7-6fa6-5b4c-abaa-c7d5230dba86
xid:
  - telegram-ai
aliases:
  - telegram-ai
  - Telegram AI
  - realm74/obsidian-telegram-ai
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/telegram-ai
alt:
  - https://github.com/realm74/obsidian-telegram-ai
downloads: 232
updated at: "2026-06-22T20:55:13Z"
related to:
  - "[[GitHub - 1164949175]]"
remind me:
---

# Telegram AI

Telegram AI turns a personal Telegram bot into a capture inbox, so that text, voice, photo, document and video messages arrive in the vault as structured notes. OpenAI models analyze the content and generate titles, summaries and categories while Whisper transcribes voice, audio and video; PDF and DOCX files are parsed on the local machine, and the recorded text states that no data leaves the vault unless AI is enabled. Telegram photo and video groups stay together in a single note, messages that are only a URL skip AI processing, and each content type has its own prompt and toggle. Notes are organized through template variables for title, category and date, with keyword-based category routing.

```cue
plugin: {
    id:     "telegram-ai"
    name:   "Telegram AI"
    author: "realm74"
    repo:   "realm74/obsidian-telegram-ai"

    html_url:    "https://community.obsidian.md/plugins/telegram-ai"
    github_url:  "https://github.com/realm74/obsidian-telegram-ai"
    description: "AI-powered Telegram sync with smart categorization, media grouping, and local document processing. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Turn Telegram into a smart capture inbox for your Obsidian vault. Send any message — text, voice, photo, document, or video — to your personal bot. It arrives in your vault as a structured, AI-processed note. AI Processing — OpenAI models analyze content, generate titles, summaries, and categories. Whisper transcribes voice, audio, and video into searchable text. Local-First — PDF and DOCX files are parsed on your machine. No data leaves your vault unless you enable AI. Media Albums — Telegram photo/video groups stay together in a single note, preserving context. Smart Routing — URL-only messages skip AI to save tokens. Each content type gets its own prompt and processing toggle. ️ Dynamic Templates — Organize with {{ai:title}}, {{category}}, {{date:YYYY-MM}} variables and keyword-based category routing. Setup in under a minute: create a bot via @BotFather, paste the token, and start capturing."

    stats: {
        downloads:  232
        updated_at: 1782161713000
    }
}
```

[^template]: [[Obsidian plugin]]
