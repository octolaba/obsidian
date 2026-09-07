---
uid: feb2c180-1b9b-59de-9ea7-1f959f07321f
xid:
  - chatgpt-prompt
aliases:
  - chatgpt-prompt
  - Prompt ChatGPT
  - coduhuey/ChatGPT-Prompt-Plugin-For-Obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/chatgpt-prompt
alt:
  - https://github.com/coduhuey/ChatGPT-Prompt-Plugin-For-Obsidian
downloads: 21347
updated at: "2024-03-09T06:13:22Z"
related to:
  - "[[GitHub - 750724921]]"
remind me:
---

# Prompt ChatGPT

Prompt ChatGPT sends a templated prompt to ChatGPT when a note is opened or created, choosing the template by the note's tags. Templates fill a title placeholder and an optional context placeholder, and a built-in chatbox carries follow-up questions that refine the response.

```cue
plugin: {
    id:     "chatgpt-prompt"
    name:   "Prompt ChatGPT"
    author: "coduhuey"
    repo:   "coduhuey/ChatGPT-Prompt-Plugin-For-Obsidian"

    html_url:    "https://community.obsidian.md/plugins/chatgpt-prompt"
    github_url:  "https://github.com/coduhuey/ChatGPT-Prompt-Plugin-For-Obsidian"
    description: "Send templated prompts to ChatGPT when you open a file."
    about:       "Send templated prompts to ChatGPT when opening or creating a note by mapping note tags to templates that use {{title}} and optional {{context}} placeholders. Ask follow-up questions directly via the built-in chatbox to refine responses."

    stats: {
        downloads:  21347
        updated_at: 1709964802000
    }
}
```

[^template]: [[Obsidian plugin]]
