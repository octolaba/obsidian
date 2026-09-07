---
uid: 97481cc2-52ef-5e50-9636-c35084b85a14
xid:
  - publish-to-wordpress
aliases:
  - publish-to-wordpress
  - Publish to WordPress
  - devidcode/obsidian-publish-to-wordpress
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/publish-to-wordpress
alt:
  - https://github.com/devidcode/obsidian-publish-to-wordpress
downloads: 185
updated at: "2026-06-28T15:37:21Z"
related to:
  - "[[GitHub - 1283108559]]"
remind me:
---

# Publish to WordPress

Publishes the active note as a WordPress draft, either directly through the REST API or through a custom webhook. Markdown is converted to HTML, the title is taken from frontmatter or the filename, and a featured image is attached from frontmatter or from the first embedded image. Publishing is triggered from a ribbon icon or a command.

```cue
plugin: {
    id:     "publish-to-wordpress"
    name:   "Publish to WordPress"
    author: "DevidCode"
    repo:   "devidcode/obsidian-publish-to-wordpress"

    html_url:    "https://community.obsidian.md/plugins/publish-to-wordpress"
    github_url:  "https://github.com/devidcode/obsidian-publish-to-wordpress"
    description: "Publish the active note as a WordPress draft, directly via the REST API or through a custom webhook. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish the active Obsidian note as a WordPress draft via the REST API or a custom webhook. Convert Markdown to HTML, set the title from frontmatter or filename, attach a featured image from frontmatter or the first embedded image, and send the note with a ribbon icon or command."

    stats: {
        downloads:  185
        updated_at: 1782661041000
    }
}
```

[^template]: [[Obsidian plugin]]
