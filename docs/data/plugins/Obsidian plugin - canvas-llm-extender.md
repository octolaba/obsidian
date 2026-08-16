---
uid: 63f33574-0653-5c58-86ab-d6eaac08dd44
xid:
  - canvas-llm-extender
aliases:
  - canvas-llm-extender
  - Canvas LLM Extender
  - phasip/obsidian-canvas-llm-extender
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/canvas-llm-extender
alt:
  - https://github.com/phasip/obsidian-canvas-llm-extender
downloads: 4104
updated at: "2026-01-17T14:30:48Z"
related to:
  - "[[GitHub - 704359127]]"
remind me:
---

# Canvas LLM Extender

Canvas LLM Extender adds AI-generated text nodes to a canvas from a selected text node, creating an outgoing edge to the new node and using nearby edge-wise text as context. It requires the user's own OpenAI API key, and the inputs state that it currently works with text nodes only.

```cue
plugin: {
    id:     "canvas-llm-extender"
    name:   "Canvas LLM Extender"
    author: "phasip"
    repo:   "phasip/obsidian-canvas-llm-extender"

    html_url:    "https://community.obsidian.md/plugins/canvas-llm-extender"
    github_url:  "https://github.com/phasip/obsidian-canvas-llm-extender"
    description: "Let the OpenAI LLM / GPT add nodes to your canvas for you."
    about:       "Add AI-generated text nodes to your Canvas from a selected text node, automatically creating an outgoing edge to the new node using nearby edge-wise text as context. Require your own OpenAI API key; currently works with text nodes only."

    stats: {
        downloads:  4104
        updated_at: 1768660248000
    }
}
```

[^template]: [[Obsidian plugin]]
