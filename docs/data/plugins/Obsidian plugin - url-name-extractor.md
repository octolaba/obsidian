---
uid: 5368dcaf-4b5d-5cff-902c-0c361148239f
xid:
  - url-name-extractor
aliases:
  - url-name-extractor
  - URL Name Extractor
  - valenzine/obsidian-url-name-extractor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/url-name-extractor
alt:
  - https://github.com/valenzine/obsidian-url-name-extractor
downloads: 243
updated at: "2026-05-16T14:15:32Z"
related to:
  - "[[GitHub - 1120453021]]"
remind me:
---

# URL Name Extractor

Converts raw URLs in selected text into Markdown links by fetching each page title. Site-specific extraction is used where it exists, with fallbacks to Archive.org and Microlink for bot-protected pages. URLs are detected with a liberal, configurable regex, and a progressive request strategy is described as minimizing anti-bot triggers while reporting clear errors and degrading gracefully.

```cue
plugin: {
    id:     "url-name-extractor"
    name:   "URL Name Extractor"
    author: "valenzine"
    repo:   "valenzine/obsidian-url-name-extractor"

    html_url:    "https://community.obsidian.md/plugins/url-name-extractor"
    github_url:  "https://github.com/valenzine/obsidian-url-name-extractor"
    description: "Converts raw URLs into markdown links by automatically fetching webpage titles. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Name raw URLs in selected text by fetching page titles and inserting readable link text, with site-specific extraction and fallbacks to Archive.org and Microlink for bot-protected pages. Detect URLs using a liberal, configurable regex and apply a progressive request strategy to minimize anti-bot triggers while providing clear error messages and graceful degradation."

    stats: {
        downloads:  243
        updated_at: 1778940932000
    }
}
```

[^template]: [[Obsidian plugin]]
