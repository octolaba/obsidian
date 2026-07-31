---
uid: 39960560-bb88-525f-9b21-08697debbcd7
xid:
  - chatgpt-math-clipboard
aliases:
  - chatgpt-math-clipboard
  - ChatGPT Math Clipboard
  - vofen430/obsidian-chatgpt-math-clipboard
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/chatgpt-math-clipboard
alt:
  - https://github.com/vofen430/obsidian-chatgpt-math-clipboard
downloads: 137
updated at: "2026-05-30T06:53:52Z"
related to:
  - "[[GitHub - 1254114617]]"
remind me:
---

# ChatGPT Math Clipboard

ChatGPT Math Clipboard copies responses from the ChatGPT Web Viewer as Obsidian Markdown, converting inline KaTeX into single-dollar math and display KaTeX into double-dollar math. It operates locally on chatgpt.com pages, writes only plain text to the clipboard so no rich HTML is pasted, and falls back to the native copy when extraction fails.

```cue
plugin: {
    id:     "chatgpt-math-clipboard"
    name:   "ChatGPT Math Clipboard"
    author: "vofen"
    repo:   "vofen430/obsidian-chatgpt-math-clipboard"

    html_url:    "https://community.obsidian.md/plugins/chatgpt-math-clipboard"
    github_url:  "https://github.com/vofen430/obsidian-chatgpt-math-clipboard"
    description: "Copies ChatGPT Web Viewer responses as Markdown with strict KaTeX-to-LaTeX conversion. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert ChatGPT formulas in the Web Viewer into strict Obsidian Markdown, turning inline KaTeX into $...$ and display KaTeX into $$...$$. Operate locally on chatgpt.com pages, write plain-text clipboard only to avoid rich HTML pastes, and fall back to native copy if extraction fails."

    stats: {
        downloads:  137
        updated_at: 1780124032000
    }
}
```

[^template]: [[Obsidian plugin]]
