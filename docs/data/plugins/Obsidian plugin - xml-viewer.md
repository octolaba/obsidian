---
uid: c4b92a19-3815-5d07-86cc-700adf9d97b5
xid:
  - xml-viewer
aliases:
  - xml-viewer
  - XML Viewer
  - viggomeesters/obsidian-xml-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/xml-viewer
alt:
  - https://github.com/viggomeesters/obsidian-xml-viewer
downloads: 267
updated at: "2026-06-07T18:59:50Z"
related to:
  - "[[GitHub - 1262249094]]"
remind me:
---

# XML Viewer

Opens .xml files read-only as a structured tree or as syntax-highlighted source with line numbers. Nodes are filtered by element or attribute name and value, by text, comments and CDATA, and the view exposes attributes, namespace prefixes, child counts, text previews and node paths. Malformed XML is reported as a parse warning, rendering is capped at 10,000 nodes, and files are parsed locally with no network or clipboard use.

```cue
plugin: {
    id:     "xml-viewer"
    name:   "XML Viewer"
    author: "Viggo Meesters"
    repo:   "viggomeesters/obsidian-xml-viewer"

    html_url:    "https://community.obsidian.md/plugins/xml-viewer"
    github_url:  "https://github.com/viggomeesters/obsidian-xml-viewer"
    description: "Open .xml files as a read-only tree with search, source view, and parse warnings. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Browse .xml files in a read-only view as a structured tree or syntax-highlighted source with line numbers. Filter nodes by element or attribute names/values, text, comments and CDATA; view attributes, namespace prefixes, child counts, text previews and node paths. Report malformed XML, cap rendering at 10,000 nodes for performance, and parse files locally with no network or clipboard use."

    stats: {
        downloads:  267
        updated_at: 1780858790000
    }
}
```

[^template]: [[Obsidian plugin]]
