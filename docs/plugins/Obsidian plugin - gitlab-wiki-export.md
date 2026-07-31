---
uid: cbf032f7-488b-5bc7-8f45-98bcf475becb
xid:
  - gitlab-wiki-export
aliases:
  - gitlab-wiki-export
  - Gitlab Wiki Exporter
  - jrabmer/obsidian-to-gitlab-wiki
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gitlab-wiki-export
alt:
  - https://github.com/jrabmer/obsidian-to-gitlab-wiki
downloads: 2359
updated at: "2025-11-09T08:59:09Z"
related to:
  - "[[GitHub - 757924815]]"
remind me:
---

# Gitlab Wiki Exporter

Exports the whole vault to a chosen location in GitLab Wiki format, converting filenames and links as it goes. Spaces become dashes, the .md extension is stripped from links, a chosen start page is renamed to home, and the conversion writes relative-path links into the exported folder without altering the vault.

```cue
plugin: {
    id:     "gitlab-wiki-export"
    name:   "Gitlab Wiki Exporter"
    author: "jrabmer"
    repo:   "jrabmer/obsidian-to-gitlab-wiki"

    html_url:    "https://community.obsidian.md/plugins/gitlab-wiki-export"
    github_url:  "https://github.com/jrabmer/obsidian-to-gitlab-wiki"
    description: "Makes your entire vault Gitlab Wiki compatible and exports it to a specified location."
    about:       "Export your Obsidian vault as a GitLab Wiki, converting filenames and links to GitLab Wiki format. Replace spaces with dashes, strip .md extensions from links, rename a chosen start page to home, and export the converted files to a folder without altering your vault (uses relative-path links)."

    stats: {
        downloads:  2359
        updated_at: 1762678749000
    }
}
```

[^template]: [[Obsidian plugin]]
