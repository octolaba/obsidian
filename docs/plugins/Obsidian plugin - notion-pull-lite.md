---
uid: e2724094-ca28-52c3-b59b-5fc64381c132
xid:
  - notion-pull-lite
aliases:
  - notion-pull-lite
  - N2O Sync Lite
  - n2osync/n2o-lite
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/notion-pull-lite
alt:
  - https://github.com/n2osync/n2o-lite
downloads:
updated at:
related to:
  - "[[GitHub - 1310852675]]"
remind me:
---

# N2O Sync Lite

Pulls Notion pages and databases into the vault as plain Markdown and can be re-run whenever Notion changes, rather than producing a single export. Callouts, toggles, columns, tables, code, math and synced blocks survive the transfer, images and attachments are downloaded before their Notion links expire, database properties become frontmatter so relations become wikilinks, and a database arrives as a folder of notes plus a Bases view. Re-pulls are described as preserving local edits instead of overwriting them. The sync is one-way from Notion to Obsidian, requires no account, and the recorded description states that content goes only to Notion and that the source is MIT-licensed so a release can be rebuilt and diffed.

```cue
plugin: {
    id:     "notion-pull-lite"
    name:   "N2O Sync Lite"
    author: "Simha"
    repo:   "n2osync/n2o-lite"

    html_url:    "https://community.obsidian.md/plugins/notion-pull-lite"
    github_url:  "https://github.com/n2osync/n2o-lite"
    description: "Your Notion workspace, in your vault, as plain Markdown you own. Pulls pages, databases, properties and media, and re-pulls any time Notion changes. One way, free, no account needed. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Notion raises its price, your account gets locked, or you want out. Your notes are already on your disk, in Markdown, readable in any text editor. N2O Sync Lite pulls your Notion pages and databases into Obsidian, and keeps pulling. Re-run it whenever Notion changes, unlike a one-shot export of UUID filenames and broken links. What survives the trip: callouts, toggles, columns, tables, code, math and synced blocks. Images and attachments download into your vault before Notion's links expire. Database properties become frontmatter, so relations turn into real wikilinks and a property named Tags lands in Obsidian's own tag search. A database arrives as a folder of notes plus a Bases view. Re-pulls preserve your local edits instead of overwriting them. This edition is one way, Notion to Obsidian. Nothing you write in Obsidian goes back. Your content never touches our servers, the plugin talks to Notion and nothing else, and the source is MIT so you can rebuild the release and diff it."
}
```

[^template]: [[Obsidian plugin]]
