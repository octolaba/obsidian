---
uid: 3c273803-b26d-5ecd-9865-ff370e573899
xid:
  - onegayi-smart-tagger
aliases:
  - onegayi-smart-tagger
  - Smart Tagger AI
  - onegayi/Obsidian-Smart-Tagger
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/onegayi-smart-tagger
alt:
  - https://github.com/onegayi/Obsidian-Smart-Tagger
downloads: 194
updated at: "2026-06-19T09:51:21Z"
related to:
  - "[[GitHub - 1274109024]]"
remind me:
---

# Smart Tagger AI

Smart Tagger AI generates tags for notes with OpenAI-compatible or local Ollama models and writes them into frontmatter. Single files or whole folders are processed in bulk, prompt templates are reused, and existing vault tags are preferred for consistency. Extra frontmatter fields are added through a key-and-prompt template, gitignore-style rules skip files, and API keys are stored encrypted.

```cue
plugin: {
    id:     "onegayi-smart-tagger"
    name:   "Smart Tagger AI"
    author: "ONEGAYI"
    repo:   "onegayi/Obsidian-Smart-Tagger"

    html_url:    "https://community.obsidian.md/plugins/onegayi-smart-tagger"
    github_url:  "https://github.com/onegayi/Obsidian-Smart-Tagger"
    description: "使用 AI 为文档自动生成标签 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Generate AI tags for notes and write them to frontmatter using OpenAI‑compatible or local Ollama models. Process single files or folders in bulk, reuse prompt templates, prefer existing vault tags for consistency, add extra frontmatter fields via {{key: prompt}}, skip files with gitignore‑style rules and keep API keys encrypted."

    stats: {
        downloads:  194
        updated_at: 1781862681000
    }
}
```

[^template]: [[Obsidian plugin]]
