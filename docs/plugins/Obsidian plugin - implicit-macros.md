---
uid: d1e671c6-3fc3-5667-a214-3d3ee739c1f6
xid:
  - implicit-macros
aliases:
  - implicit-macros
  - Implicit Macros
  - isolyth/implicit-macros
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/implicit-macros
alt:
  - https://github.com/isolyth/implicit-macros
downloads: 86
updated at: "2026-05-12T23:14:06Z"
related to:
  - "[[GitHub - 1223008681]]"
remind me:
---

# Implicit Macros

Expands an inline AI macro written in the note as a bracketing exclamation-mark syntax, calling an OpenAI-compatible chat endpoint and streaming the response in place of the macro. While the call runs, braille-dot spinners sized to the original text stand in, and the arriving tokens replace them with a brief highlight that fades.

```cue
plugin: {
    id:     "implicit-macros"
    name:   "Implicit Macros"
    author: "eriskii"
    repo:   "isolyth/implicit-macros"

    html_url:    "https://community.obsidian.md/plugins/implicit-macros"
    github_url:  "https://github.com/isolyth/implicit-macros"
    description: "Inline AI macros: type !!prompt! and have it expand in place via an OpenAI-compatible chat endpoint. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run inline AI macros by typing !!prompt! to call an OpenAI-compatible chat endpoint and stream the response back in place of the macro. Show braille-dot spinners sized to the original text while the call runs, then replace them with arriving tokens that briefly highlight and fade."

    stats: {
        downloads:  86
        updated_at: 1778627646000
    }
}
```

[^template]: [[Obsidian plugin]]
