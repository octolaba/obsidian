---
uid: 87a5604e-ec81-5382-a8f1-c21ff1609fce
xid:
  - github-octokit
aliases:
  - github-octokit
  - GitHub Octokit Sync
  - rhoades-brown/obsidian-github
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/github-octokit
alt:
  - https://github.com/rhoades-brown/obsidian-github
downloads: 273
updated at: "2026-05-30T20:29:46Z"
related to:
  - "[[GitHub - 1110822751]]"
remind me:
---

# GitHub Octokit Sync

Syncs a vault with GitHub through the Octokit API rather than the Git command line, on desktop and mobile, with two-way sync in batch commits and either selective or full vault coverage. Sync can run on save, on an interval or at startup, with subfolder mapping, multi-repository support carrying independent branches and ignore patterns, and configuration sync for themes, snippets and hotkeys. Conflicts are detected automatically and resolved through side-by-side or inline diffs, and the required personal access token is kept in Obsidian's encrypted secret storage.

```cue
plugin: {
    id:     "github-octokit"
    name:   "GitHub Octokit Sync"
    author: "rhoades-brown"
    repo:   "rhoades-brown/obsidian-github"

    html_url:    "https://community.obsidian.md/plugins/github-octokit"
    github_url:  "https://github.com/rhoades-brown/obsidian-github"
    description: "Sync your Obsidian vault with GitHub using the Octokit API. Two-way sync, multi-repo support, visual diffs, conflict resolution, and auto-sync — no Git CLI required. Works on desktop and mobile. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with GitHub using the official Octokit API. No Git CLI required. Works on desktop and mobile. Two-way sync with batch commits. Selective or full vault sync. Auto-sync on save, on interval, or on startup. Subfolder mapping to sync your vault to a specific path within a repository. Configuration sync for themes, snippets, and hotkeys across devices. Multi-repo support lets you sync additional GitHub repos into specific vault directories, each with independent branches, subfolder mapping, and ignore patterns. Shared repo configs sync automatically across devices. Conflict resolution with automatic detection, side-by-side and inline diff views, and manual editing. Sync panel shows file changes grouped by status, commit history, and live logs. Glob-based ignore patterns for files and folders. GitHub tokens stored securely in Obsidian's encrypted SecretStorage. Requires a GitHub Personal Access Token with repo scope."

    stats: {
        downloads:  273
        updated_at: 1780172986000
    }
}
```

[^template]: [[Obsidian plugin]]
