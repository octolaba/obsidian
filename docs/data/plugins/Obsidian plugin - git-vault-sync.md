---
uid: 9ca1c06b-f59f-5643-9bea-6224942690b7
xid:
  - git-vault-sync
aliases:
  - git-vault-sync
  - Git Vault Sync
  - heeeyman/ObsSync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/git-vault-sync
alt:
  - https://github.com/heeeyman/ObsSync
downloads: 1031
updated at: "2026-08-06T10:06:32Z"
related to:
  - "[[GitHub - 1263616371]]"
remind me:
---

# Git Vault Sync

Syncs the whole vault to a GitHub repository from a single ribbon action that stages, commits, fetches, merges and pushes, without a command line or a system Git installation. Written in JavaScript, it ships two engines and picks one automatically: a full Git engine on desktop and a lighter GitHub API engine on mobile. Conflicts are resolved interactively, a commit preview lets files be unchecked before syncing, and authentication uses HTTPS with a personal access token stored locally and kept out of the sync.

```cue
plugin: {
    id:     "git-vault-sync"
    name:   "Git Vault Sync"
    author: "alexandervasin"
    repo:   "heeeyman/ObsSync"

    html_url:    "https://community.obsidian.md/plugins/git-vault-sync"
    github_url:  "https://github.com/heeeyman/ObsSync"
    description: "Sync your whole vault to GitHub with one click — on desktop and mobile.  Interactive conflict resolution, commit preview, and auto-sync. Pure JavaScript, no system Git required. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Git Vault Sync backs up and syncs your whole vault through your own GitHub repo — one button, no command line, no system Git. Pure JavaScript, so it works on **Android and iOS** just like desktop. It ships **two engines** and picks one automatically: a full Git engine on desktop, and a lighter GitHub-API engine on mobile that syncs even large vaults without running out of memory. - **One-click sync** from the ribbon — stage, commit, fetch, merge, push. - **Interactive conflict resolution** — keep local, keep remote, or edit by hand. - **Commit preview** — uncheck what you're not ready to sync. - **Auto-sync**, status-bar indicator, excluded paths, and an EN/RU UI. Auth is HTTPS + a Personal Access Token, stored locally; the plugin's own token file is never synced."

    stats: {
        downloads:  1031
        updated_at: 1786010792000
    }
}
```

[^template]: [[Obsidian plugin]]
