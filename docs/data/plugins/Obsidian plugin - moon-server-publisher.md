---
uid: 93503208-d314-5ab1-9a54-74360dbec798
xid:
  - moon-server-publisher
aliases:
  - moon-server-publisher
  - Moon server publisher
  - dzoukr/MoonServerObsidianPlugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/moon-server-publisher
alt:
  - https://github.com/dzoukr/MoonServerObsidianPlugin
downloads: 2463
updated at: "2023-10-20T13:33:50Z"
related to:
  - "[[GitHub - 696217331]]"
remind me:
---

# Moon server publisher

Moon server publisher publishes notes to a Moon server instance and removes them again when needed. The returned Moon ID is attached to the note as a metadata property and removed on unpublish. The server URL and an optional API key and secret are configured first, after which Publish and Unpublish run from the command palette or the note context menu.

```cue
plugin: {
    id:     "moon-server-publisher"
    name:   "Moon server publisher"
    author: "dzoukr"
    repo:   "dzoukr/MoonServerObsidianPlugin"

    html_url:    "https://community.obsidian.md/plugins/moon-server-publisher"
    github_url:  "https://github.com/dzoukr/MoonServerObsidianPlugin"
    description: "Publish your notes directly to Moon server instance."
    about:       "Publish notes to a Moon server instance and remove them when needed. Attach the returned Moon ID to the note as a metadata property and remove it on unpublish. Configure the server URL and optional API key/secret, then run Publish or Unpublish from the command palette or note context menu."

    stats: {
        downloads:  2463
        updated_at: 1697808830000
    }
}
```

[^template]: [[Obsidian plugin]]
