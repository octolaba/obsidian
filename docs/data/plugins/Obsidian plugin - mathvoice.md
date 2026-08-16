---
uid: fa0b5cf4-50a5-5210-bc97-099448edf54a
xid:
  - mathvoice
aliases:
  - mathvoice
  - MathVoice
  - freewheelerz/obsidian-mathvoice
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mathvoice
alt:
  - https://github.com/freewheelerz/obsidian-mathvoice
downloads: 11
updated at: "2026-08-07T14:54:56Z"
related to:
  - "[[GitHub - 1326773288]]"
remind me:
---

# MathVoice

Edits LaTeX math in a note through a right-side panel that embeds the MathVoice Studio, a separate web application the panel loads from a URL rather than code running inside the plugin. Moving the cursor inside an inline or display math environment loads that formula into the Studio automatically, a Load from editor button does the same on demand, and editing there is done by voice or typed commands. Apply to note writes the result back over the original math range, with delimiters stripped before loading and restored on write-back so that only the inner LaTeX is edited. Two commands open the Studio panel and load the math at the cursor, and a studioUrl setting points the panel at a self-hosted deployment.

```cue
plugin: {
    id:     "mathvoice"
    name:   "MathVoice"
    author: "Wei Liang Fong"
    repo:   "freewheelerz/obsidian-mathvoice"

    html_url:    "https://community.obsidian.md/plugins/mathvoice"
    github_url:  "https://github.com/freewheelerz/obsidian-mathvoice"
    description: " - This plugin has not been manually reviewed by Obsidian staff."

    stats: {
        downloads:  11
        updated_at: 1786114496000
    }
}
```

[^template]: [[Obsidian plugin]]
