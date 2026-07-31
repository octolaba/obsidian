---
uid: c4c3a5db-0246-5bd6-9988-a21d0a4551c5
xid:
  - fix-math
aliases:
  - fix-math
  - Fix Math
  - loglux/fix-math-for-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/fix-math
alt:
  - https://github.com/loglux/fix-math-for-obsidian
downloads: 4794
updated at: "2026-07-10T00:13:08Z"
related to:
  - "[[GitHub - 1071043157]]"
remind me:
---

# Fix Math

Converts LaTeX equations pasted from ChatGPT and other AI assistants into Markdown math in the current file, turning parenthesis delimiters into inline math and bracket delimiters into display math. Fenced code blocks and delimiters that are already correct are preserved. Math inside plain parentheses and brackets is detected, and the counts of converted inline and display formulas are reported.

```cue
plugin: {
    id:     "fix-math"
    name:   "Fix Math"
    author: "loglux"
    repo:   "loglux/fix-math-for-obsidian"

    html_url:    "https://community.obsidian.md/plugins/fix-math"
    github_url:  "https://github.com/loglux/fix-math-for-obsidian"
    description: "Convert LaTeX equations from ChatGPT and AI assistants to the correct Markdown format: block equations to display math, inline to inline math."
    about:       "Convert LaTeX delimiters \\(…\\) → $…$ and \\[…\\] → $$…$$ in the current file while preserving fenced code blocks and existing $…$/$\\$\\$…\\$\\$ delimiters. Detect math inside plain parentheses and brackets and display counts of converted inline and display formulas."

    stats: {
        downloads:  4794
        updated_at: 1783642388000
    }
}
```

[^template]: [[Obsidian plugin]]
