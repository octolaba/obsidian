---
uid: 7710ce8a-43ba-5c77-aaa6-187bf869d1b5
xid:
  - chemical-structure-renderer
aliases:
  - chemical-structure-renderer
  - Chemical Structure Renderer
  - xaya1001/obsidian-Chemical-Structure-Renderer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/chemical-structure-renderer
alt:
  - https://github.com/xaya1001/obsidian-Chemical-Structure-Renderer
downloads: 6347
updated at: "2025-02-04T10:06:51Z"
related to:
  - "[[GitHub - 649044324]]"
remind me:
---

# Chemical Structure Renderer

Chemical Structure Renderer draws chemical structures from SMILES code blocks in live preview using Ketcher and Indigo, producing PNG or SVG. Diagrams come either from the bundled Ketcher and Indigo render service or from a self-hosted server. The recorded description warns against running another SMILES transformer such as Obsidian-Chem alongside it, to avoid conflicts.

```cue
plugin: {
    id:     "chemical-structure-renderer"
    name:   "Chemical Structure Renderer"
    author: "xaya1001"
    repo:   "xaya1001/obsidian-Chemical-Structure-Renderer"

    html_url:    "https://community.obsidian.md/plugins/chemical-structure-renderer"
    github_url:  "https://github.com/xaya1001/obsidian-Chemical-Structure-Renderer"
    description: "Render chemical structures from SMILES strings into PNG or SVG format using Ketcher and Indigo Service."
    about:       "Render chemical structures from SMILES code blocks directly in Obsidian's live preview using Ketcher and Indigo. Display inline molecular diagrams via the bundled Ketcher+Indigo render service or a self-hosted server. Avoid running other SMILES transformers (e.g., Obsidian-Chem) to prevent conflicts."

    stats: {
        downloads:  6347
        updated_at: 1738663611000
    }
}
```

[^template]: [[Obsidian plugin]]
