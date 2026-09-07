---
uid: e5627f04-1310-59f0-8ad5-1a06f810f9ab
xid:
  - table-calc
aliases:
  - table-calc
  - Table Calc
  - benruns/table-calc-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/table-calc
alt:
  - https://github.com/benruns/table-calc-plugin
downloads: 761
updated at: "2026-07-03T01:50:08Z"
related to:
  - "[[GitHub - 1279278734]]"
remind me:
---

# Table Calc

Adds spreadsheet-style formulas to Markdown tables and renders their results inline in Live Preview and Reading view. A table opts in by making a calc marker its first header cell, which then becomes a row-number column. Cell references, ranges, arithmetic and functions including SUM, AVG, MIN, MAX, COUNT, ABS and ROUND are supported, and hovering a result reveals the original formula.

```cue
plugin: {
    id:     "table-calc"
    name:   "Table Calc"
    author: "Benjamin Patterson"
    repo:   "benruns/table-calc-plugin"

    html_url:    "https://community.obsidian.md/plugins/table-calc"
    github_url:  "https://github.com/benruns/table-calc-plugin"
    description: "Adds formula support to markdown tables. Use =SUM(A1:A5), =AVG(B1:B3), =A1*B1, etc. in any table cell. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Add spreadsheet-style formulas to your markdown tables and render results inline in Live Preview and Reading view. Opt a table into formula evaluation by adding {calc} as the first header cell, which becomes a row-number column. Use cell references (A1), ranges (A1:A5), functions like SUM/AVG/MIN/MAX/COUNT/ABS/ROUND and arithmetic; hover results to reveal original formulas."

    stats: {
        downloads:  761
        updated_at: 1783043408000
    }
}
```

[^template]: [[Obsidian plugin]]
