---
uid: b49723e9-3d9f-5efa-afdc-a3070d968691
xid:
  - wiki-copilot
aliases:
  - wiki-copilot
  - Wiki Copilot
  - deanxizian/obisidian-wiki-copilot
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/wiki-copilot
alt:
  - https://github.com/deanxizian/obisidian-wiki-copilot
downloads: 41
updated at: "2026-08-10T08:03:00Z"
related to:
  - "[[GitHub - 1326396523]]"
remind me:
---

# Wiki Copilot

Answers questions about the vault with an LLM, backed by a compact local lexical index that recognizes Schema, Index and Wiki roles alongside Stable and Pending source states. Retrieval uses CJK-aware MiniSearch with one-hop expansion along wikilinks, and only the selected passages are sent to an OpenAI-compatible model. Source tags in the answer render as clickable links back into the vault, and the index itself stays local.

```cue
plugin: {
    id:     "wiki-copilot"
    name:   "Wiki Copilot"
    author: "deanxi"
    repo:   "deanxizian/obisidian-wiki-copilot"

    html_url:    "https://community.obsidian.md/plugins/wiki-copilot"
    github_url:  "https://github.com/deanxizian/obisidian-wiki-copilot"
    description: "Ask your persistent LLM Wiki with local lexical retrieval, Wikilink expansion, and traceable citations. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Query your Vault with an LLM-aware wiki Q&A that recognizes Schema/Index/Wiki and Stable/Pending source roles and keeps a compact local lexical index. Send only selected passages to OpenAI-compatible models, use CJK-aware MiniSearch with Wikilink one-hop expansion, and render source tags as clickable Obsidian links while keeping data local."

    stats: {
        downloads:  41
        updated_at: 1786348980000
    }
}
```

[^template]: [[Obsidian plugin]]
