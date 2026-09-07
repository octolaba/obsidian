---
uid: fb8d3624-9de1-582b-b04d-de5bbc76a4dd
xid:
  - send-note
aliases:
  - send-note
  - Send Note
  - jvsteiner/send-note
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/send-note
alt:
  - https://github.com/jvsteiner/send-note
downloads: 513
updated at: "2024-12-18T19:00:28Z"
related to:
  - "[[GitHub - 881985929]]"
remind me:
---

# Send Note

Send Note shares a note by uploading it to your own AWS S3 bucket as an encrypted Markdown file. The share URL carries the encryption key, so that a recipient who opens it in Obsidian can import the note into their vault. The uploaded copy can be deleted from S3 from the note's frontmatter.

```cue
plugin: {
    id:     "send-note"
    name:   "Send Note"
    author: "jvsteiner"
    repo:   "jvsteiner/send-note"

    html_url:    "https://community.obsidian.md/plugins/send-note"
    github_url:  "https://github.com/jvsteiner/send-note"
    description: "Instantly send a note, to other users so they can import them into their vault via URL."
    about:       "Share notes instantly via your AWS S3 bucket as encrypted Markdown files. Create a secure share URL with the encryption key embedded so recipients can open it in Obsidian to import the note into their vault. Delete the uploaded note from S3 directly from the note's frontmatter."

    stats: {
        downloads:  513
        updated_at: 1734548428000
    }
}
```

[^template]: [[Obsidian plugin]]
