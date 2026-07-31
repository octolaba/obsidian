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
downloads: 792
updated at: "2026-07-23T07:17:44Z"
related to:
  - "[[GitHub - 1197500954]]"
remind me:
---

# Git File Sync

Syncs individual notes with GitHub, GitLab or a self-hosted Gitea through an API key, on desktop and mobile, without installing Git or creating a local repository. Each push, pull, remote deletion or file move is preceded by a sync plan describing the changes to be applied. A searchable tree view shows sync status, compares local and remote content with diffs, resolves conflicts visually and handles renamed files and moved folders without leaving remote duplicates.

```cue
plugin: {
    id:     "git-file-sync"
    name:   "Git File Sync"
    author: "ClaudiaFang"
    repo:   "firstsun-dev/git-files-sync"

    html_url:    "https://community.obsidian.md/plugins/git-file-sync"
    github_url:  "https://github.com/firstsun-dev/git-files-sync"
    description: "Selectively sync individual notes with GitLab or GitHub. Use API key to push, pull, diff, and resolve conflicts — file by file, on mobile and desktop. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Git File Sync gives you safe, file-by-file Git sync for Obsidian on desktop and mobile—without installing Git or creating a local .git repository. Connect directly to GitHub, GitLab, or self-hosted Gitea, then choose exactly which notes to push or pull. Keep personal notes private while sharing, publishing, or backing up selected files through your existing Git repository. Before every push, pull, remote deletion, or file move, review a clear sync plan of the changes that will be applied. Browse sync status in a searchable tree view, compare local and remote content with built-in diffs, resolve conflicts visually, and sync renamed files or moved folders without leaving duplicates behind remotely. Git File Sync is for people who want Git’s portability and ownership without turning their entire vault into a Git working tree."

    stats: {
        downloads:  792
        updated_at: 1784791064000
    }
}
```

[^template]: [[Obsidian plugin]]
