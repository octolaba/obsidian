---
uid: 8de53904-5c61-525a-9b82-b1e39a447d26
xid:
  - arxiv-papers
aliases:
  - arxiv-papers
  - arXiv Papers
  - ar4l/obsidian-papers
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/arxiv-papers
alt:
  - https://github.com/ar4l/obsidian-papers
downloads: 308
updated at: "2026-06-08T10:40:45Z"
related to:
  - "[[GitHub - 1258108519]]"
remind me:
---

# arXiv Papers

Searches arXiv and imports research papers into the vault, saving structured metadata such as title, authors, year and URL and downloading or embedding the PDF. OpenAlex serves as a fallback source, and arXiv rate limits, timeouts and retries are handled during import. The recorded description identifies it as a fork of willjhliang/obsidian-papers.

```cue
plugin: {
    id:     "arxiv-papers"
    name:   "arXiv Papers"
    author: "Ar4l"
    repo:   "ar4l/obsidian-papers"

    html_url:    "https://community.obsidian.md/plugins/arxiv-papers"
    github_url:  "https://github.com/ar4l/obsidian-papers"
    description: "Retrieve and import research papers from arXiv. Fork of willjhliang/obsidian-papers with rate-limit handling and OpenAlex fallback. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Search and import arXiv research papers into your vault, saving structured metadata (title, authors, year, URL) and downloading or embedding the PDF. Fall back to OpenAlex and handle arXiv rate limits, timeouts, and retries to keep imports reliable."

    stats: {
        downloads:  308
        updated_at: 1780915245000
    }
}
```

[^template]: [[Obsidian plugin]]
