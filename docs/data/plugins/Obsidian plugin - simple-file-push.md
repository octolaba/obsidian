---
uid: e891cdf8-4e7a-5fb5-bf21-a7beb7e256ac
xid:
  - simple-file-push
aliases:
  - simple-file-push
  - Simple File Push
  - huedaya/obsidian-simple-file-push
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-file-push
alt:
  - https://github.com/huedaya/obsidian-simple-file-push
downloads: 1236
updated at: "2024-02-20T10:48:37Z"
related to:
  - "[[GitHub - 756405078]]"
remind me:
---

# Simple File Push

Simple File Push posts a Markdown file to an API endpoint as JSON carrying the file name and the content. The endpoint can be protected with Bearer authentication, and the upload is triggered from a note by a dedicated sync command.

```cue
plugin: {
    id:     "simple-file-push"
    name:   "Simple File Push"
    author: "huedaya"
    repo:   "huedaya/obsidian-simple-file-push"

    html_url:    "https://community.obsidian.md/plugins/simple-file-push"
    github_url:  "https://github.com/huedaya/obsidian-simple-file-push"
    description: "Push Markdown file to API endpoint."
    about:       "Push Markdown files to a POST endpoint as JSON containing file_name and content. Protect the API with Bearer auth and trigger uploads from a note via the Sync file to my Blog command."

    stats: {
        downloads:  1236
        updated_at: 1708426117000
    }
}
```

[^template]: [[Obsidian plugin]]
