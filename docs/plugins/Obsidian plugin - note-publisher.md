---
uid: 333b3048-9bb4-5439-b8fe-7a59c94403fa
xid:
  - note-publisher
aliases:
  - note-publisher
  - Note publisher
  - obsidian-note-publisher/obsidian-plugin-note-publisher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/note-publisher
alt:
  - https://github.com/obsidian-note-publisher/obsidian-plugin-note-publisher
downloads: 16
updated at: "2026-07-13T21:04:39Z"
related to:
  - "[[GitHub - 1298620300]]"
remind me:
---

# Note publisher

Publishes a single note together with its embedded images to a private GitHub repository, committing the note and its assets under a stable UUID folder as index.md. The UUID is generated and kept in the note's frontmatter, embeds are rewritten to relative filenames, and a public link containing only the UUID is written into the note and the clipboard. That link is rendered by a Cloudflare Worker the user deploys.

```cue
plugin: {
    id:     "note-publisher"
    name:   "Note publisher"
    author: "bvn13"
    repo:   "obsidian-note-publisher/obsidian-plugin-note-publisher"

    html_url:    "https://community.obsidian.md/plugins/note-publisher"
    github_url:  "https://github.com/obsidian-note-publisher/obsidian-plugin-note-publisher"
    description: "Publishes a note (with its images) to a private GitHub repo and creates a UUID-only public link rendered by a Cloudflare Worker. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish a single note and its embedded images to a private GitHub repository, committing the note and assets under a stable UUID folder as index.md. Generate and persist a UUID in the note's frontmatter, rewrite embeds to relative filenames, and write a clean UUID-only public link (served by a worker you deploy) into the note and clipboard."

    stats: {
        downloads:  16
        updated_at: 1783976679000
    }
}
```

[^template]: [[Obsidian plugin]]
