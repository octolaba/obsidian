---
uid: 8d5a664c-0be9-5364-b70e-bfaf8ee115e4
xid:
  - claude-vault-citations
aliases:
  - claude-vault-citations
  - Claude Vault Citations
  - nord342/obsidian-claude-citations
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/claude-vault-citations
alt:
  - https://github.com/nord342/obsidian-claude-citations
downloads: 141
updated at: "2026-05-19T14:25:26Z"
related to:
  - "[[GitHub - 1243630783]]"
remind me:
---

# Claude Vault Citations

Answers questions about the vault with paragraph-level citations that link to the exact note and passage. It calls Anthropic's Citations API, which the recorded inputs credit with guaranteeing that cited passages come from the notes themselves, and caches context to make follow-up questions faster. Only the top-ranked paragraphs are sent, and the API key is stored locally.

```cue
plugin: {
    id:     "claude-vault-citations"
    name:   "Claude Vault Citations"
    author: "nord342"
    repo:   "nord342/obsidian-claude-citations"

    html_url:    "https://community.obsidian.md/plugins/claude-vault-citations"
    github_url:  "https://github.com/nord342/obsidian-claude-citations"
    description: "Ask questions about your vault and get answers with verified citations to the exact notes and passages, powered by Claude's native Citations API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Ask questions about your vault and get answers with verified paragraph-level citations that link directly to the exact note and passage. Use Anthropic's Citations API to guarantee cited passages come from your notes, speed follow-ups with cached context, and keep your API key stored locally while only top-ranked paragraphs are sent."

    stats: {
        downloads:  141
        updated_at: 1779200726000
    }
}
```

[^template]: [[Obsidian plugin]]
