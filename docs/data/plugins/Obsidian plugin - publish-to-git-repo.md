---
uid: 5e4f8ac8-c99f-5b6c-9d39-1889c31b494f
xid:
  - publish-to-git-repo
aliases:
  - publish-to-git-repo
  - Publish to Git Repo
  - satlxq/obsidian-publish-to-git-repo
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/publish-to-git-repo
alt:
  - https://github.com/satlxq/obsidian-publish-to-git-repo
downloads: 38
updated at: "2026-08-01T02:21:23Z"
related to:
  - "[[GitHub - 1312382562]]"
remind me:
---

# Publish to Git Repo

Publishes notes marked with a gh-publish frontmatter flag to a GitHub repository, uploading each note as Markdown together with the images it embeds. The transfer is incremental, atomic and safe to re-run. It copies files only and does not render or host a site, leaving the repository usable as a Markdown archive or as input to a static-site generator.

```cue
plugin: {
    id:     "publish-to-git-repo"
    name:   "Publish to Git Repo"
    author: "Novelty Liu"
    repo:   "satlxq/obsidian-publish-to-git-repo"

    html_url:    "https://community.obsidian.md/plugins/publish-to-git-repo"
    github_url:  "https://github.com/satlxq/obsidian-publish-to-git-repo"
    description: "An Obsidian plugin that publishes vault notes **together with their images** to a GitHub repository. Incremental, atomic, and safe to re-run. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Flag a note with `gh-publish: true` and run **Publish to Git Repo** — the note (and any images it embeds) lands in your repo as clean Markdown + image files. It is **pure file sync**: it does not render or host a website. Pair it with any static-site generator (Jekyll, Hugo, Eleventy, Astro, …) or simply use the repo as a Markdown archive."

    stats: {
        downloads:  38
        updated_at: 1785550883000
    }
}
```

[^template]: [[Obsidian plugin]]
