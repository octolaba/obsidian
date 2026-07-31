---
uid: 21684e95-a607-5865-8499-19675ea49ff5
xid:
  - import-github-readme
aliases:
  - import-github-readme
  - Import GitHub Readme
  - chasebank87/import-github-readme
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/import-github-readme
alt:
  - https://github.com/chasebank87/import-github-readme
downloads: 1104
updated at: "2024-06-29T07:53:01Z"
related to:
  - "[[GitHub - 820827070]]"
remind me:
---

# Import GitHub Readme

Fetches the README of a GitHub repository and inserts it into the current note. Embedded HTML is converted to Markdown, unnecessary tags and empty lines are removed, and relative image URLs are rewritten as absolute ones so that they render.

```cue
plugin: {
    id:     "import-github-readme"
    name:   "Import GitHub Readme"
    author: "chasebank87"
    repo:   "chasebank87/import-github-readme"

    html_url:    "https://community.obsidian.md/plugins/import-github-readme"
    github_url:  "https://github.com/chasebank87/import-github-readme"
    description: "Allows you to import a GitHub README file into your vault."
    about:       "Fetch a GitHub repository README and insert it into the current note. Convert embedded HTML to Markdown, remove unnecessary tags and empty lines, and convert relative image URLs to absolute links for correct rendering."

    stats: {
        downloads:  1104
        updated_at: 1719647581000
    }
}
```

[^template]: [[Obsidian plugin]]
