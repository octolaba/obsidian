---
uid: 61fd1ccf-9ea0-5d3f-b05f-8094e2de44ca
xid:
  - file-publisher
aliases:
  - file-publisher
  - File Publisher
  - yiglas/obsidian-file-publisher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/file-publisher
alt:
  - https://github.com/yiglas/obsidian-file-publisher
downloads: 3668
updated at: "2023-03-06T22:16:55Z"
related to:
  - "[[GitHub - 601376533]]"
remind me:
---

# File Publisher

File Publisher sends the current file, and attachments, to a configured POST endpoint, authenticating with an API key and secret. A frontmatter template covering title, excerpt and timestamp determines how the note is formatted before it is sent.

```cue
plugin: {
    id:     "file-publisher"
    name:   "File Publisher"
    author: "yiglas"
    repo:   "yiglas/obsidian-file-publisher"

    html_url:    "https://community.obsidian.md/plugins/file-publisher"
    github_url:  "https://github.com/yiglas/obsidian-file-publisher"
    description: "Publish a file to a given POST API."
    about:       "Publish files and attachments directly to a POST endpoint with API key and secret support. Use a frontmatter template (title, excerpt, timestamp) to format the note and send the current file to the configured endpoint."

    stats: {
        downloads:  3668
        updated_at: 1678141015000
    }
}
```

[^template]: [[Obsidian plugin]]
