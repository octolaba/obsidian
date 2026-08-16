---
uid: d8049e43-8a56-5c93-b83f-4ee9e5925ce1
xid:
  - ai-alias
aliases:
  - ai-alias
  - AI Alias
  - wendao10/ai-alias
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ai-alias
alt:
  - https://github.com/wendao10/ai-alias
downloads: 31
updated at: "2026-08-10T09:21:55Z"
related to:
  - "[[GitHub - 1324709465]]"
remind me:
---

# AI Alias

Replaces sensitive names in a note with deterministic local aliases before the text is sent to an AI service, and restores the originals in the reply. The name-to-alias mapping is held only on the local machine, in the plugin's data.json, so the original names are never sent. Alias formats are configurable and the mappings are managed locally.

```cue
plugin: {
    id:     "ai-alias"
    name:   "AI Alias"
    author: "文刀十寸"
    repo:   "wendao10/ai-alias"

    html_url:    "https://community.obsidian.md/plugins/ai-alias"
    github_url:  "https://github.com/wendao10/ai-alias"
    description: "Mask sensitive names in your notes with custom aliases before sending text to an AI, then restore them on the AI's reply. Your mapping table never leaves your machine. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Mask sensitive names in notes with deterministic local aliases before sending text to any public AI — inside or external — and restore originals from AI replies. Store the name-to-alias mapping only on your machine (data.json) so originals are never sent. Customize alias formats and manage mappings locally."

    stats: {
        downloads:  31
        updated_at: 1786353715000
    }
}
```

[^template]: [[Obsidian plugin]]
