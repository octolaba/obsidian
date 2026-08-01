---
uid: 0e5390c0-b09b-5ea0-ae1c-79bd9044d682
xid:
  - obsidian-etherpad-plugin
aliases:
  - obsidian-etherpad-plugin
  - Etherpad
  - egradman/obsidian-etherpad-lite
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-etherpad-plugin
alt:
  - https://github.com/egradman/obsidian-etherpad-lite
downloads: 4565
updated at: "2022-03-21T21:34:12Z"
related to:
  - "[[GitHub - 469993344]]"
remind me:
---

# Etherpad

Uploads a note to an Etherpad-Lite server and records an etherpad_id in the frontmatter, marking the server copy as canonical. Note contents are replaced from the pad on open or on command, so the file stays in the vault while collaborators edit it through the Etherpad web editor. The pad can also be opened in a browser to share its URL.

```cue
plugin: {
    id:     "obsidian-etherpad-plugin"
    name:   "Etherpad"
    author: "egradman"
    repo:   "egradman/obsidian-etherpad-lite"

    html_url:    "https://community.obsidian.md/plugins/obsidian-etherpad-plugin"
    github_url:  "https://github.com/egradman/obsidian-etherpad-lite"
    description: "Copy and sync notes with an Etherpad Lite server to unlock easy web-based collaboration with others."
    about:       "Upload notes to an Etherpad-Lite server and add an etherpad_id to the frontmatter to mark the server copy as canonical. Replace note contents from the pad on open or on command and keep the file in your vault while collaborators edit via the Etherpad web editor. Open the pad in your browser to share the URL."

    stats: {
        downloads:  4565
        updated_at: 1647898452000
    }
}
```

[^template]: [[Obsidian plugin]]
