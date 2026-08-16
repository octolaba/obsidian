---
uid: f6311e46-0112-53b9-acb2-00709a1d3728
xid:
  - git-file-sync
aliases:
  - git-file-sync
  - Git File Sync
  - firstsun-dev/git-files-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/git-file-sync
alt:
  - https://github.com/firstsun-dev/git-files-sync
downloads: 1172
updated at: "2026-08-07T15:58:19Z"
related to:
  - "[[GitHub - 1197500954]]"
remind me:
---

# Git File Sync

Syncs selected notes rather than the whole vault to GitHub, GitLab or a self-hosted Gitea, on desktop and mobile, without installing Git or creating a local .git repository. Every push, pull, remote deletion or file move is preceded by a sync plan listing the changes that will be applied. A searchable tree view shows sync status, built-in diffs compare local and remote content, conflicts are resolved visually, and renamed files or moved folders sync without leaving duplicates behind remotely.

```cue
plugin: {
    id:     "git-file-sync"
    name:   "Git File Sync"
    author: "ClaudiaFang"
    repo:   "firstsun-dev/git-files-sync"

    html_url:    "https://community.obsidian.md/plugins/git-file-sync"
    github_url:  "https://github.com/firstsun-dev/git-files-sync"
    description: "Both mobile and desktop. Selectively sync the notes you choose—not your whole vault—with GitHub, GitLab, or Gitea. No local Git repository required. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Git File Sync gives you safe, file-by-file Git sync for Obsidian on desktop and mobile—without installing Git or creating a local .git repository. Connect directly to GitHub, GitLab, or self-hosted Gitea, then choose exactly which notes to push or pull. Keep personal notes private while sharing, publishing, or backing up selected files through your existing Git repository. Before every push, pull, remote deletion, or file move, review a clear sync plan of the changes that will be applied. Browse sync status in a searchable tree view, compare local and remote content with built-in diffs, resolve conflicts visually, and sync renamed files or moved folders without leaving duplicates behind remotely. Git File Sync is for people who want Git’s portability and ownership without turning their entire vault into a Git working tree."

    stats: {
        downloads:  1172
        updated_at: 1786118299000
    }
}
```

[^template]: [[Obsidian plugin]]
