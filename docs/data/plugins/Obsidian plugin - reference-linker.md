---
uid: 4a048df3-eb27-5009-8ddc-744f625022d3
xid:
  - reference-linker
aliases:
  - reference-linker
  - Reference Linker
  - max-fluff/obsidian-reference-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/reference-linker
alt:
  - https://github.com/max-fluff/obsidian-reference-linker
downloads: 99
updated at: "2026-08-02T13:11:38Z"
related to:
  - "[[GitHub - 1303147151]]"
remind me:
---

# Reference Linker

Deep-links notes to documents that live outside the vault, such as PDFs, Office files, and images in project folders or a research library: a trigger character autocompletes a document name and inserts a link that opens it at the right page in the default viewer. For a PDF the outline is read, so every bookmarked section is indexed with its page and can be linked to directly instead of by page number. Hovering a link previews that page in place, and a page or image can be embedded inline without copying it into the vault; links stay portable because the note keeps a relative path plus a root token that each machine resolves to its own reference root, and a drifted link is flagged and repaired in one command. It is desktop only, since it reads documents from disk.

```cue
plugin: {
    id:     "reference-linker"
    name:   "Reference Linker"
    author: "max-fluff"
    repo:   "max-fluff/obsidian-reference-linker"

    html_url:    "https://community.obsidian.md/plugins/reference-linker"
    github_url:  "https://github.com/max-fluff/obsidian-reference-linker"
    description: "Deep-link your notes to PDFs, Office files, and images outside your vault. Autocomplete a document or a PDF section and jump to the exact page. Hover to preview the page, embed it inline. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Link your notes to the documents you actually work from: PDFs, Office files, and images that live outside your vault, in project folders, downloads, or a research library. Type a trigger, autocomplete a document name, and Reference Linker inserts a link that opens it at the right page in your default viewer. For a PDF it reads the outline, so every bookmarked section is indexed with its page: link straight to \"Methods\" instead of to page 12. Hover any link to preview that page rendered in place, and embed a page or an image inline, so the reference sits beside your writing without being copied into the vault. Links stay portable. The note keeps a relative path and a root token, and each machine fills in its own reference root, so a vault synced between computers keeps working. When a document is reissued and a section moves, the drifted link is flagged and repaired in one command. Desktop only: it reads documents from disk, outside the vault."

    stats: {
        downloads:  99
        updated_at: 1785676298000
    }
}
```

[^template]: [[Obsidian plugin]]
