---
uid: bb8a790d-1a29-5376-a4a4-43c1897b7814
xid:
  - remote-ssh
aliases:
  - remote-ssh
  - Remote SSH
  - sotashimozono/obsidian-remote-ssh
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/remote-ssh
alt:
  - https://github.com/sotashimozono/obsidian-remote-ssh
downloads: 1338
updated at: "2026-07-14T08:13:11Z"
related to:
  - "[[GitHub - 1220402965]]"
remind me:
---

# Remote SSH

Opens a vault that lives on a remote SSH host and edits it in an ordinary Obsidian window, with files, attachments, search, and live edits served from the remote. Existing plugins keep working, live edits sync across machines with a three-way merge for conflicts, and writes made offline are queued so a flaky network does not lose them. The connection uses the user's own SSH config.

```cue
plugin: {
    id:     "remote-ssh"
    name:   "Remote SSH"
    author: "sotashimozono"
    repo:   "sotashimozono/obsidian-remote-ssh"

    html_url:    "https://community.obsidian.md/plugins/remote-ssh"
    github_url:  "https://github.com/sotashimozono/obsidian-remote-ssh"
    description: "Edit remote vaults over SSH/SFTP — VS Code Remote-SSH style. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open a vault on a remote SSH host and edit it in a real Obsidian window with files, attachments, search, and live edits served transparently from the remote. Keep existing plugins working, sync live edits across machines with a 3-way merge for conflicts, and queue offline writes to survive flaky networks while using your SSH config."

    stats: {
        downloads:  1338
        updated_at: 1784016791000
    }
}
```

[^template]: [[Obsidian plugin]]
