---
uid: 449a8e27-d6fb-5831-95a4-3fbba8cae745
xid:
  - pika-publish
aliases:
  - pika-publish
  - Pika.publish
  - otaviocc/obsidian-pika
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pika-publish
alt:
  - https://github.com/otaviocc/obsidian-pika
downloads: 136
updated at: "2026-05-26T18:56:44Z"
related to:
  - "[[GitHub - 1210260531]]"
remind me:
---

# Pika.publish

Pika.publish sends notes from the vault to a Pika blog through the Micropub API. Local images are found and uploaded, links are replaced with the hosted URLs, and the mappings are cached in note properties so re-publishing is quick. Title, tags and visibility come from YAML frontmatter or defaults, and the resulting post URL is saved for later updates.

```cue
plugin: {
    id:     "pika-publish"
    name:   "Pika.publish"
    author: "Otávio Cordeiro"
    repo:   "otaviocc/obsidian-pika"

    html_url:    "https://community.obsidian.md/plugins/pika-publish"
    github_url:  "https://github.com/otaviocc/obsidian-pika"
    description: "Publish notes to Pika. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish notes to your Pika blog via the Micropub API straight from your vault. Find and upload local images, replace links with hosted URLs, and cache mappings in note properties for quick re-publishes. Use YAML frontmatter or defaults for title, tags, visibility (Draft/Public), and save the post URL for updates."

    stats: {
        downloads:  136
        updated_at: 1779821804000
    }
}
```

[^template]: [[Obsidian plugin]]
