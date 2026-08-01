---
uid: 4c407625-2985-5b70-8723-0d9d1f9e828d
xid:
  - dualyze-structure
aliases:
  - dualyze-structure
  - Dualyze Structure
  - dualyze-ai/obsidian-dualyze-structure
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/dualyze-structure
alt:
  - https://github.com/dualyze-ai/obsidian-dualyze-structure
downloads: 151
updated at: "2026-06-13T09:47:09Z"
related to:
  - "[[GitHub - 1264838966]]"
remind me:
---

# Dualyze Structure

Splits a long note into subnotes, giving each H2 section its own note while H3 and deeper headings stay nested inside it. Each subnote receives a parent link in its frontmatter, the original note is rewritten as an index of links to the parts, and an MOC with Mermaid knowledge maps can be generated.

```cue
plugin: {
    id:     "dualyze-structure"
    name:   "Dualyze Structure"
    author: "DualyzeAI"
    repo:   "dualyze-ai/obsidian-dualyze-structure"

    html_url:    "https://community.obsidian.md/plugins/dualyze-structure"
    github_url:  "https://github.com/dualyze-ai/obsidian-dualyze-structure"
    description: "Turn long notes into structured knowledge: split notes, parent links, structure index, and MOC. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Split long notes into structured subnotes by converting each H2 section into its own note while keeping H3+ headings nested inside their parent. Add a parent: [[Source Note]] frontmatter link, rewrite the original as a clean structure index of links, and generate an MOC with Mermaid visual knowledge maps."

    stats: {
        downloads:  151
        updated_at: 1781344029000
    }
}
```

[^template]: [[Obsidian plugin]]
