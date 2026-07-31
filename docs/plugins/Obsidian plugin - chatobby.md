---
uid: 1157502a-5b5f-5ab9-843f-8709bf56e5b2
xid:
  - chatobby
aliases:
  - chatobby
  - Chatobby
  - titaniceclair/chatobby-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/chatobby
alt:
  - https://github.com/titaniceclair/chatobby-obsidian
downloads:
updated at:
related to:
  - "[[GitHub - 1303305167]]"
remind me:
---

# Chatobby

Chatobby connects Obsidian to a Chatobby agent runtime installed locally, over an authenticated loopback transport. The plugin manages the runtime lifecycle, the vault-authority bridge and the interface, while models, prompts, memory, tasks, subagents and workflows are handled by that local runtime. API keys are supplied by the reader and many LLM providers are supported.

```cue
plugin: {
    id:     "chatobby"
    name:   "Chatobby"
    author: "Madelyn"
    repo:   "titaniceclair/chatobby-obsidian"

    html_url:    "https://community.obsidian.md/plugins/chatobby"
    github_url:  "https://github.com/titaniceclair/chatobby-obsidian"
    description: "A local agent with chat and tool use, with MCP and plugin support. Bring your own API key, Chatobby supports many LLM providers - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect Obsidian to a locally installed Chatobby agent runtime over an authenticated loopback transport. Manage runtime lifecycle, vault-authority bridge operations, and UI integration while the local runtime handles models, prompts, memory, tasks, subagents and workflows."
}
```

[^template]: [[Obsidian plugin]]
