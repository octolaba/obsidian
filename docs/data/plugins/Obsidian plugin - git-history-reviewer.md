---
uid: 6d8e863c-69c7-581c-9c8d-1ab455b9166c
xid:
  - git-history-reviewer
aliases:
  - git-history-reviewer
  - Git History Reviewer
  - timdommett/Obsidian-Git-History-Reviewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/git-history-reviewer
alt:
  - https://github.com/timdommett/Obsidian-Git-History-Reviewer
downloads: 133
updated at: "2026-06-21T11:22:57Z"
related to:
  - "[[GitHub - 1275067276]]"
remind me:
---

# Git History Reviewer

Walks through every commit in the vault's Git history and shows dark-mode diffs with per-file collapsing, line numbers, rename detection and add or remove highlighting. Changed files can be ticked off and commits approved, with filters for all, needs review and approved, auto-advance and bulk approval by date. Review state is stored outside tracked files, so reviewing never creates new commits.

```cue
plugin: {
    id:     "git-history-reviewer"
    name:   "Git History Reviewer"
    author: "timdommett"
    repo:   "timdommett/Obsidian-Git-History-Reviewer"

    html_url:    "https://community.obsidian.md/plugins/git-history-reviewer"
    github_url:  "https://github.com/timdommett/Obsidian-Git-History-Reviewer"
    description: "Review every commit in your vault's git history with a dark-mode diff view, and track which commits you've reviewed and approved. Review state is stored locally so it never creates new commits. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Walk through every commit in your vault's Git history and view dark-mode diffs with per-file collapse, line numbers, rename detection, and add/remove highlighting. Tick off changed files and approve commits with filters for All / Needs review / Approved, auto-advance, and bulk-approve by date. Store approval state outside tracked files to avoid infinite commit loops."

    stats: {
        downloads:  133
        updated_at: 1782040977000
    }
}
```

[^template]: [[Obsidian plugin]]
