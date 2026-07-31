---
uid: 69a458ae-cb05-50e8-96c2-131c5382e162
xid:
  - autogen
aliases:
  - autogen
  - Autogen
  - aidantilgner/AutogenObsidianPlugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/autogen
alt:
  - https://github.com/aidantilgner/AutogenObsidianPlugin
downloads: 1557
updated at: "2024-02-19T23:41:46Z"
related to:
  - "[[GitHub - 751522765]]"
remind me:
---

# Autogen

Autogen generates text in place inside a note, driven by a prompt written in the note itself with the @[prompt] trigger. Completions come from OpenAI or from an OpenAI-compatible endpoint such as LocalAI or Ollama, chosen by model name and custom API URL, so inference can be run in the cloud or locally.

```cue
plugin: {
    id:     "autogen"
    name:   "Autogen"
    author: "aidantilgner"
    repo:   "aidantilgner/AutogenObsidianPlugin"

    html_url:    "https://community.obsidian.md/plugins/autogen"
    github_url:  "https://github.com/aidantilgner/AutogenObsidianPlugin"
    description: "In place autogeneration of content based on prompts within notes"
    about:       "Generate in-place text completions inside notes using OpenAI or OpenAI-compatible local models. Trigger generations with @[prompt] and point to a chosen model or custom API URL (LocalAI, Ollama, etc.) for cloud or local inference."

    stats: {
        downloads:  1557
        updated_at: 1708386106000
    }
}
```

[^template]: [[Obsidian plugin]]
