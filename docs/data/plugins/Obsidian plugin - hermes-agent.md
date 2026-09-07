---
uid: d2d6f09e-1107-5661-aeb3-eb8a39273991
xid:
  - hermes-agent
aliases:
  - hermes-agent
  - Hermes Agent
  - jsun2020/hermes-agent-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/hermes-agent
alt:
  - https://github.com/jsun2020/hermes-agent-obsidian-plugin
downloads: 5630
updated at: "2026-08-03T13:04:46Z"
related to:
  - "[[GitHub - 1273319739]]"
remind me:
---

# Hermes Agent

Hermes Agent chats with a locally installed Hermes Agent from the vault and streams replies into a multi-tab sidebar panel. The current note or the selected text is sent as context to the local Hermes gateway, authenticated with an API server key. The Runs transport is used when it is available, with Chat Completions as the fallback, and the plugin offers agent file tools and saved chat history.

```cue
plugin: {
    id:     "hermes-agent"
    name:   "Hermes Agent"
    author: "Jason"
    repo:   "jsun2020/hermes-agent-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/hermes-agent"
    github_url:  "https://github.com/jsun2020/hermes-agent-obsidian-plugin"
    description: "Chat with a locally installed Hermes Agent from your vault. Send the current note or selection to the local Hermes gateway and stream replies in a sidebar, with agent file tools and saved chat history. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Chat with your locally running Hermes Agent directly inside Obsidian and stream model replies into a multi-tab sidebar panel. Send the current note or selected text as context and connect to the local Hermes gateway using your API server key, with Runs transport when available or Chat Completions as fallback."

    stats: {
        downloads:  5630
        updated_at: 1785762286000
    }
}
```

[^template]: [[Obsidian plugin]]
