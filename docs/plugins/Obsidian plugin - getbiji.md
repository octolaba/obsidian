---
uid: 4699bcb9-f73a-54fa-9039-347bd213bc2a
xid:
  - getbiji
aliases:
  - getbiji
  - GetBiji
  - jiashu329/obsidian-getbiji
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/getbiji
alt:
  - https://github.com/jiashu329/obsidian-getbiji
downloads: 471
updated at: "2026-05-15T03:35:17Z"
related to:
  - "[[GitHub - 1208341413]]"
remind me:
---

# GetBiji

Syncs cloud notes from the Get service into the vault through the biji.com open platform API, generating standard Markdown files with YAML metadata such as note id, title and tags, the full body and a summarized links section. Folders are created automatically, existing notes are either fully overwritten or skipped by note id, internal links are rewritten as Obsidian wikilinks where possible, and a running sync can be cancelled at any time.

```cue
plugin: {
    id:     "getbiji"
    name:   "GetBiji"
    author: "jiashu329"
    repo:   "jiashu329/obsidian-getbiji"

    html_url:    "https://community.obsidian.md/plugins/getbiji"
    github_url:  "https://github.com/jiashu329/obsidian-getbiji"
    description: "Sync Get notes to your vault using the biji.com Open API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Get 笔记 cloud notes to your Obsidian vault via the open platform API, generating standard Markdown files with YAML metadata (get_note_id, title, tags), full body content and a summarized links section. Create folders automatically, choose full overwrite or skip by get_note_id, rewrite internal Get links to Obsidian [[wikilinks]] when possible, and cancel sync anytime."

    stats: {
        downloads:  471
        updated_at: 1778816117000
    }
}
```

[^template]: [[Obsidian plugin]]
