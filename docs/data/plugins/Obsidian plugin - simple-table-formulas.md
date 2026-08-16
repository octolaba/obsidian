---
uid: 676b7314-e140-51c2-92d0-60f4e681362a
xid:
  - simple-table-formulas
aliases:
  - simple-table-formulas
  - Simple Table Formulas
  - maxcohn/obsidian-simple-table-formulas
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-table-formulas
alt:
  - https://github.com/maxcohn/obsidian-simple-table-formulas
downloads: 52
updated at: "2026-07-12T18:55:23Z"
related to:
  - "[[GitHub - 1298529174]]"
remind me:
---

# Simple Table Formulas

Simple Table Formulas adds spreadsheet-style formulas to Markdown tables, written into a cell as expressions such as =SUM(B2:B4). A command evaluates the formula and bakes the computed value into the cell while preserving the original formula in an inline comment, so it can be edited later. Data and formulas therefore stay in plain Markdown.

```cue
plugin: {
    id:     "simple-table-formulas"
    name:   "Simple Table Formulas"
    author: "Maxwell Cohn"
    repo:   "maxcohn/obsidian-simple-table-formulas"

    html_url:    "https://community.obsidian.md/plugins/simple-table-formulas"
    github_url:  "https://github.com/maxcohn/obsidian-simple-table-formulas"
    description: "Add spreadsheet-style formulas to Markdown tables. Write a formula into a cell, run a command to bake it into a computed value with the formula preserved in a comment for later editing. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Add spreadsheet-style formulas to Markdown tables by writing expressions like =SUM(B2:B4) directly in cells. Evaluate formulas to bake computed values into cells while preserving the original formula in an inline %%...%% comment, keeping all data and formulas in plain Markdown for portability."

    stats: {
        downloads:  52
        updated_at: 1783882523000
    }
}
```

[^template]: [[Obsidian plugin]]
