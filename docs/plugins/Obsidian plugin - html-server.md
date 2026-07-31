---
uid: ba28435d-fd01-5d02-8f11-36ed216c2aa0
xid:
  - html-server
aliases:
  - html-server
  - Html Server
  - pr0dt0s/obsidian-html-server
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/html-server
alt:
  - https://github.com/pr0dt0s/obsidian-html-server
downloads: 11562
updated at: "2023-11-22T23:41:11Z"
related to:
  - "[[GitHub - 614124872]]"
remind me:
---

# Html Server

Html Server serves the vault over HTTP so notes can be read in a browser with the theme, images and file links preserved. Access is read-only and reachable over localhost or the device address on a local network, a Markdown file can be set as the index page, and the served HTML is customized through per-file frontmatter variables.

```cue
plugin: {
    id:     "html-server"
    name:   "Html Server"
    author: "pr0dt0s"
    repo:   "pr0dt0s/obsidian-html-server"

    html_url:    "https://community.obsidian.md/plugins/html-server"
    github_url:  "https://github.com/pr0dt0s/obsidian-html-server"
    description: "Spin up a local http server to access your vault via a web browser."
    about:       "Serve your Obsidian vault over HTTP and view notes in a browser while preserving your theme, images, and file links. Share read-only access across a local network via localhost or device IP, set a markdown file as the index page, and customize served HTML with per-file frontmatter variables."

    stats: {
        downloads:  11562
        updated_at: 1700696471000
    }
}
```

[^template]: [[Obsidian plugin]]
