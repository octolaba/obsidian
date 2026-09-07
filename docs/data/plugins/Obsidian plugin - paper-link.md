---
uid: 859e6868-7b95-5c88-9bc3-d6a1e9cfc968
xid:
  - paper-link
aliases:
  - paper-link
  - Paper Link
  - jiangnan0522/paper-link
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/paper-link
alt:
  - https://github.com/jiangnan0522/paper-link
downloads: 34
updated at: "2026-07-22T14:56:13Z"
related to:
  - "[[GitHub - 1301004110]]"
remind me:
---

# Paper Link

Replaces pasted academic paper URLs with titled Markdown links built from metadata for arXiv, ACL Anthology, OpenReview and pages exposed through Google Scholar. The paste itself stays instant and the titled link is swapped in once metadata arrives; URLs that are not papers are left untouched, and a command converts bare paper URLs already present in the note.

```cue
plugin: {
    id:     "paper-link"
    name:   "Paper Link"
    author: "Jiangnan Ye"
    repo:   "jiangnan0522/paper-link"

    html_url:    "https://community.obsidian.md/plugins/paper-link"
    github_url:  "https://github.com/jiangnan0522/paper-link"
    description: "Replace pasted paper URLs (arXiv, OpenReview, ACL Anthology, …) with [Title (Venue Year)](url) links. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Replace pasted academic paper URLs with readable titled Markdown links using metadata from arXiv, ACL Anthology, OpenReview, and Google Scholar–exposed pages. Keep the paste instant and swap in the titled link as metadata arrives; leave non-paper URLs untouched and run a command to convert bare paper URLs in the current note."

    stats: {
        downloads:  34
        updated_at: 1784732173000
    }
}
```

[^template]: [[Obsidian plugin]]
