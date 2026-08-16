---
uid: 0f2a30d1-3c78-5f4c-853e-35a183050ca3
xid:
  - gitlab-gitless-sync
aliases:
  - gitlab-gitless-sync
  - GitLab Gitless Sync
  - terekhinao/obsidian-gitlab-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gitlab-gitless-sync
alt:
  - https://github.com/terekhinao/obsidian-gitlab-sync
downloads: 3
updated at: "2026-08-11T18:19:58Z"
related to:
  - "[[GitHub - 1314142756]]"
remind me:
---

# GitLab Gitless Sync

Syncs a vault with a branch of a GitLab repository through the GitLab REST API alone, so no local Git installation is needed. Desktop and mobile stay in step through automatic or manual sync modes, and the result remains compatible with ordinary desktop Git workflows. Conflicts are handled by an auto-merge-first strategy that keeps both versions, and the GitLab token is held in Obsidian SecretStorage.

```cue
plugin: {
    id:     "gitlab-gitless-sync"
    name:   "GitLab Gitless Sync"
    author: "Aleksandr Terekhin"
    repo:   "terekhinao/obsidian-gitlab-sync"

    html_url:    "https://community.obsidian.md/plugins/gitlab-gitless-sync"
    github_url:  "https://github.com/terekhinao/obsidian-gitlab-sync"
    description: "Sync a vault with a GitLab repository without requiring Git. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync an Obsidian vault with a GitLab repository branch using only the GitLab REST API, so no local Git is required. Keep desktop and mobile apps in sync with automatic and manual sync modes and remain interoperable with ordinary desktop Git workflows. Preserve data with an auto-merge-first strategy that keeps both versions on conflict and store your GitLab token securely in Obsidian SecretStorage."

    stats: {
        downloads:  3
        updated_at: 1786472398000
    }
}
```

[^template]: [[Obsidian plugin]]
