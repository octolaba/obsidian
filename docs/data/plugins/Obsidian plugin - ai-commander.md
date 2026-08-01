---
uid: f619b399-9b64-5f4c-94b5-32189d9996b3
xid:
  - ai-commander
aliases:
  - ai-commander
  - AI Commander
  - yzh503/obsidian-aicommander-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ai-commander
alt:
  - https://github.com/yzh503/obsidian-aicommander-plugin
downloads: 19146
updated at: "2024-10-15T11:32:53Z"
related to:
  - "[[GitHub - 610622662]]"
remind me:
---

# AI Commander

AI Commander generates text or images from a prompt, the current line or a selection using OpenAI models, and can include web results when a Bing Web Search API key is configured. It transcribes the last audio above the cursor with Whisper and queries embedded PDFs for context-aware responses. Custom prompt commands can be created, with their prompts improved automatically.

```cue
plugin: {
    id:     "ai-commander"
    name:   "AI Commander"
    author: "yzh503"
    repo:   "yzh503/obsidian-aicommander-plugin"

    html_url:    "https://community.obsidian.md/plugins/ai-commander"
    github_url:  "https://github.com/yzh503/obsidian-aicommander-plugin"
    description: "Generate audio transcripts, images, and text in context of PDF attachments or web search results using OpenAI and Bing API."
    about:       "Generate text or images from a prompt, the current line, or selected text using OpenAI models (GPT, DALL·E; requires OpenAI API key); add a Bing Web Search API key to include web results. Transcribe the last audio above the cursor with Whisper, query embedded PDFs for context-aware responses, and create custom prompt commands with prompts auto‑improved via Prompt Perfect."

    stats: {
        downloads:  19146
        updated_at: 1728991973000
    }
}
```

[^template]: [[Obsidian plugin]]
