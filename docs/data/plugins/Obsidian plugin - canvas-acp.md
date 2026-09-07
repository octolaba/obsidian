---
uid: 34cc28e2-bbfe-5da4-ae77-c88770fda7e2
xid:
  - canvas-acp
aliases:
  - canvas-acp
  - Canvas ACP
  - genozhou/canvas-acp
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/canvas-acp
alt:
  - https://github.com/genozhou/canvas-acp
downloads: 133
updated at: "2026-05-20T04:45:21Z"
related to:
  - "[[GitHub - 1236124989]]"
remind me:
---

# Canvas ACP

Canvas ACP sends a question about a selected canvas node to an ACP-compatible agent and streams the response into a new text node, labeling the connecting edge with that question. Upstream context or all nodes in a group can be included as context. The prompt can be previewed and edited before sending, optionally keeping or stripping think blocks.

```cue
plugin: {
    id:     "canvas-acp"
    name:   "Canvas ACP"
    author: "Geno Zhou"
    repo:   "genozhou/canvas-acp"

    html_url:    "https://community.obsidian.md/plugins/canvas-acp"
    github_url:  "https://github.com/genozhou/canvas-acp"
    description: "Ask an ACP agent a question about a canvas note, then add the generated note back to the canvas. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Ask an ACP-compatible LLM about a selected canvas node and stream the agent response into a new text node, labeling the edge with your question. Include upstream context or combine all nodes in a group as context, and preview or edit the prompt (optionally keep or strip <think> blocks) before sending."

    stats: {
        downloads:  133
        updated_at: 1779252321000
    }
}
```

[^template]: [[Obsidian plugin]]
