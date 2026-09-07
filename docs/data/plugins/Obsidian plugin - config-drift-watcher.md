---
uid: 9b775d01-adb0-5bf3-b92e-422e6e58ce61
xid:
  - config-drift-watcher
aliases:
  - config-drift-watcher
  - Config Drift Watcher
  - rixct/config-drift-watcher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/config-drift-watcher
alt:
  - https://github.com/rixct/config-drift-watcher
downloads: 82
updated at: "2026-07-04T14:09:41Z"
related to:
  - "[[GitHub - 1284786572]]"
remind me:
---

# Config Drift Watcher

Config Drift Watcher compares configuration documented in a note against the real file on a server, read-only over SFTP. A code block is annotated with a server alias and a remote path, and the plugin shows a line-by-line inline diff marking the block as in sync or drifted; a snapshot command captures the current remote file into the note as a baseline. Credentials stay in server profiles rather than in notes, SSH host keys are verified with trust on first use and manual pinning, and no remote command is ever executed because an SFTP read can only read a file. It is desktop-only, uses key-based SSH authentication, and can ignore whitespace and comment-only lines.

```cue
plugin: {
    id:     "config-drift-watcher"
    name:   "Config Drift Watcher"
    author: "rixct"
    repo:   "rixct/config-drift-watcher"

    html_url:    "https://community.obsidian.md/plugins/config-drift-watcher"
    github_url:  "https://github.com/rixct/config-drift-watcher"
    description: "Detects when a server's actual configuration has diverged from what you documented in your notes. Read-only over SFTP. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Keep your server documentation honest. Annotate a code block in a note with a server alias and a remote file path, then compare your documented config against the real file – read-only, over SFTP. The plugin shows an inline, line-by-line diff and marks each block as in sync or drifted, so you can see at a glance when a reboot, a manual fix, or a script changed reality out from under your notes. \"Snapshot from server\" captures the current remote file into the note as a baseline. Server profiles keep credentials out of your notes – a note only ever references an alias. SSH host keys are verified (trust on first use, with manual pinning), and no remote command is ever executed: an SFTP read can only read a file, never run code on the host. Desktop only. Key-based SSH authentication. Optional ignore rules for whitespace and comment-only lines."

    stats: {
        downloads:  82
        updated_at: 1783174181000
    }
}
```

[^template]: [[Obsidian plugin]]
