---
uid: 014d9c96-3766-4f49-8bed-3ad14c835d8d
xid:
  - id
aliases:
  - id
  - name
  - repo
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: html_url
alt:
  - github_url
downloads:  # stats.downloads
updated at: # stats.updated_at
related to:
  - "[[GitHub repository]]"
remind me:
---

# name

Semantic description of the $plugin based on $plugin.description and $plugin.about.

```cue
plugin: {
	id:           string
	name:         string
	author:       string
	repo:         string

  html_url:     string
  github_url:   string
	description:  string
  about?:       string

	stats?: {
		downloads:  int
		updated_at: int
	}
}
```

[^template]: [[Obsidian plugin]]
