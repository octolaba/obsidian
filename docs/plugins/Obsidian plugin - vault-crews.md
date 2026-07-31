---
uid: 491e71a8-672c-591f-b7b4-3d23b7592465
xid:
  - vault-crews
aliases:
  - vault-crews
  - Vault Crews
  - johannes-kaindl/vault-crews
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-crews
alt:
  - https://github.com/johannes-kaindl/vault-crews
downloads: 60
updated at: "2026-07-12T18:12:14Z"
related to:
  - "[[GitHub - 1290656804]]"
remind me:
---

# Vault Crews

Runs autonomous local LLM agent teams over the vault through LM Studio, sequenced by an orchestrator along a deterministic collector, llm and actions pipeline. Every model output is constrained and verified against versioned schemas before any write happens, and each run is committed as a single git commit with one-click undo. Human-readable run logs and machine-readable state are kept for observability and crash recovery.

```cue
plugin: {
    id:     "vault-crews"
    name:   "Vault Crews"
    author: "Johannes Kaindl"
    repo:   "johannes-kaindl/vault-crews"

    html_url:    "https://community.obsidian.md/plugins/vault-crews"
    github_url:  "https://github.com/johannes-kaindl/vault-crews"
    description: "Run autonomous local LLM agent teams (crews) on your vault via LM Studio - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run autonomous local LLM crews in your vault with an orchestrator-led, deterministic pipeline that sequences collector → llm → actions. Constrain and verify every LLM output against versioned schemas before any write, then commit each run as a single git commit with one-click undo. View human-readable run logs and machine-readable state for full observability and crash recovery."

    stats: {
        downloads:  60
        updated_at: 1783879934000
    }
}
```

[^template]: [[Obsidian plugin]]
