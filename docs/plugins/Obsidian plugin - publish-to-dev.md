---
uid: 2ff813f2-f594-5e0c-b9b9-d06a5119b8cf
xid:
  - publish-to-dev
aliases:
  - publish-to-dev
  - Publish to DEV
  - stroiman/obsidian-dev-publish
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/publish-to-dev
alt:
  - https://github.com/stroiman/obsidian-dev-publish
downloads: 742
updated at: "2024-07-08T09:03:29Z"
related to:
  - "[[GitHub - 809666389]]"
remind me:
---

# Publish to DEV

Publishes the active note to DEV as a draft article, taking the title from the first H1 and the body from everything after it. Later note changes are pushed as updates to the DEV article, frontmatter link metadata is resolved, the DEV URL is added to frontmatter, and embedded images are mapped to public URLs. The recorded About states that the DEV API key is stored unencrypted in the vault.

```cue
plugin: {
    id:     "publish-to-dev"
    name:   "Publish to DEV"
    author: "stroiman"
    repo:   "stroiman/obsidian-dev-publish"

    html_url:    "https://community.obsidian.md/plugins/publish-to-dev"
    github_url:  "https://github.com/stroiman/obsidian-dev-publish"
    description: "Publish and update notes as articles on DEV (https://dev.to)"
    about:       "Publish the active note as a draft article on DEV using the first H1 as the title and everything after it as the body. Update DEV articles from note changes, resolve frontmatter link metadata, add the DEV URL to frontmatter, and map embedded images to public URLs. Note that the DEV API key is stored unencrypted in your vault."

    stats: {
        downloads:  742
        updated_at: 1720429409000
    }
}
```

[^template]: [[Obsidian plugin]]
