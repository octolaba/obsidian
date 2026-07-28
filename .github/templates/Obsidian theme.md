---
uid: 99d29698-f0f5-4c0e-abdb-f10ccf60b38c
xid:
  - slug
aliases:
  - slug
  - name
  - repo
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/theme
url: html_url
alt:
  - github_url
modes:   # theme.modes
legacy:  # theme.legacy
related to:
  - "[[GitHub repository]]"
remind me:
---

# name

Semantic description of the $theme based on $theme.about.

![name screenshot](screenshot_url)

```cue
theme: {
	name:   string
	author: string
	repo:   string
	slug:   string

	html_url:       string
	github_url:     string
	screenshot_url: string
	about?:         string

	modes:   [...("dark" | "light")]
	legacy?: bool
}
```

[^template]: [[Obsidian theme]]
