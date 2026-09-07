---
uid: 093f7000-6a6c-5ca1-92f3-5cd714d89856
xid:
  - llm-auto-tagger
aliases:
  - llm-auto-tagger
  - LLM Auto Tagger
  - matbo1/llm-auto-tagger
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/llm-auto-tagger
alt:
  - https://github.com/matbo1/llm-auto-tagger
downloads: 232
updated at: "2026-06-22T09:50:13Z"
related to:
  - "[[GitHub - 1239659196]]"
remind me:
---

# LLM Auto Tagger

Adds tags that already exist in the vault to notes, choosing them with a configured LLM and writing them into the frontmatter tags field. Existing frontmatter fields and tags are kept, tagging can run automatically once a note has been idle, and the recorded providers include OpenAI-compatible endpoints, Anthropic, and Google Gemini.

```cue
plugin: {
    id:     "llm-auto-tagger"
    name:   "LLM Auto Tagger"
    author: "Matboi"
    repo:   "matbo1/llm-auto-tagger"

    html_url:    "https://community.obsidian.md/plugins/llm-auto-tagger"
    github_url:  "https://github.com/matbo1/llm-auto-tagger"
    description: "Automatically adds existing vault tags to notes with your configured LLM API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Auto-tag notes using your configured LLM to pick matching tags from your vault and write them to frontmatter.tags. Keep existing frontmatter fields and tags, run automatically after a note is idle, and support OpenAI-compatible, Anthropic, Google Gemini and other common providers."

    stats: {
        downloads:  232
        updated_at: 1782121813000
    }
}
```

[^template]: [[Obsidian plugin]]
