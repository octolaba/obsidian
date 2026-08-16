---
uid: 234c0763-daa6-521a-bbf0-cba79c1e2800
xid:
  - publish-git
aliases:
  - publish-git
  - Publish on GitHub
  - fleker/publish-on-github-for-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/publish-git
alt:
  - https://github.com/fleker/publish-on-github-for-obsidian
downloads: 57
updated at: "2026-07-30T23:32:12Z"
related to:
  - "[[GitHub - 1308051467]]"
remind me:
---

# Publish on GitHub

Publishes only the notes carrying a chosen tag, such as a public tag, from the vault to a Git repository hosting a Jekyll site on GitHub Pages. Obsidian wikilinks and embedded images are converted to relative Markdown, HTML badges are generated from frontmatter, and links are validated so the published pages do not carry broken ones. Git commits and pushes run automatically, with WSL Git supported.

```cue
plugin: {
    id:     "publish-git"
    name:   "Publish on GitHub"
    author: "fleker"
    repo:   "fleker/publish-on-github-for-obsidian"

    html_url:    "https://community.obsidian.md/plugins/publish-git"
    github_url:  "https://github.com/fleker/publish-on-github-for-obsidian"
    description: "Publish selective notes marked with a tag (e.g. #public) to a Git repository hosting Jekyll. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish tagged notes from your vault to a GitHub Pages Jekyll site, syncing only files marked with your public tag. Convert Obsidian wikilinks and embedded images to relative Markdown, generate HTML badges from frontmatter, validate links to avoid broken public links, and run automated Git commits and pushes with WSL Git support."

    stats: {
        downloads:  57
        updated_at: 1785454332000
    }
}
```

[^template]: [[Obsidian plugin]]
