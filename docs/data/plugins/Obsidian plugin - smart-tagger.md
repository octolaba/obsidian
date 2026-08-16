---
uid: debd61f9-b92e-5ba3-9d12-00dd8fec68c0
xid:
  - smart-tagger
aliases:
  - smart-tagger
  - Smart Tagger
  - jdenoy/obsidian-smart-tagger
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/smart-tagger
alt:
  - https://github.com/jdenoy/obsidian-smart-tagger
downloads: 269
updated at: "2026-06-12T09:05:03Z"
related to:
  - "[[GitHub - 1010040641]]"
remind me:
---

# Smart Tagger

Two to five tags are generated for a note by OpenAI or Claude, matched against tags the vault already carries so that existing casing prevails. Tags are previewed and applied per note or generated for the whole vault in a batch run, with rate limiting and automatic retry and backoff.

```cue
plugin: {
    id:     "smart-tagger"
    name:   "Smart Tagger"
    author: "Johan Denoyer"
    repo:   "jdenoy/obsidian-smart-tagger"

    html_url:    "https://community.obsidian.md/plugins/smart-tagger"
    github_url:  "https://github.com/jdenoy/obsidian-smart-tagger"
    description: "Automatically generate 2-5 relevant tags for your notes using ChatGPT or Claude AI. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Generate 2–5 contextually relevant tags for notes using OpenAI (ChatGPT) or Claude, with AI suggestions matched to your vault’s existing tags so vault casing prevails. Preview and apply tags per note or process the whole vault in batch, with rate limiting and automatic retry/backoff."

    stats: {
        downloads:  269
        updated_at: 1781255103000
    }
}
```

[^template]: [[Obsidian plugin]]
