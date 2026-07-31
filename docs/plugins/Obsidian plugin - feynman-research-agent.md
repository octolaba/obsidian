---
uid: 5c4c5a33-4f73-5fc3-b2c6-3c6400d6b203
xid:
  - feynman-research-agent
aliases:
  - feynman-research-agent
  - Feynman - AI research assistant
  - icarian-systems/feynman-research-agent
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/feynman-research-agent
alt:
  - https://github.com/icarian-systems/feynman-research-agent
downloads: 139
updated at: "2026-05-23T21:05:37Z"
related to:
  - "[[GitHub - 1244120646]]"
remind me:
---

# Feynman - AI research assistant

Feynman is a research agent that runs locally in Docker to analyze and query the vault, authenticated with your own Anthropic API key or an OAuth login. The plugin states that API keys are stored on your machine, in plaintext at ~/.feynman/secrets.json, and that the agent is reached over a token-protected localhost loopback server.

```cue
plugin: {
    id:     "feynman-research-agent"
    name:   "Feynman - AI research assistant"
    author: "Icarian Systems"
    repo:   "icarian-systems/feynman-research-agent"

    html_url:    "https://community.obsidian.md/plugins/feynman-research-agent"
    github_url:  "https://github.com/icarian-systems/feynman-research-agent"
    description: "A research agent for your vault. Runs locally in Docker against your own Anthropic API key. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run a local research agent in Docker to analyze and query your vault using your Anthropic API key or OAuth login. Store API keys on your machine (plaintext at ~/.feynman/secrets.json) while the agent communicates over a token‑protected localhost loopback server."

    stats: {
        downloads:  139
        updated_at: 1779570337000
    }
}
```

[^template]: [[Obsidian plugin]]
