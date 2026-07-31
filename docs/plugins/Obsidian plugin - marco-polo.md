---
uid: 70243a2b-c125-5231-a3e5-3f3603a11c46
xid:
  - marco-polo
aliases:
  - marco-polo
  - Marco Polo
  - crufi/obsidian-marco-polo
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/marco-polo
alt:
  - https://github.com/crufi/obsidian-marco-polo
downloads: 41
updated at: "2026-07-09T11:45:23Z"
related to:
  - "[[GitHub - 1282988259]]"
remind me:
---

# Marco Polo

Marco Polo turns a local path typed inside backticks into a clickable link, validating it and autocompleting as it is typed so a file can be opened or revealed in the file manager. Home-directory paths, trailing directory paths and, optionally, shell variable expansion are supported, valid paths take a configurable color while bad paths appear red, and an autocomplete dropdown sorts directories first. A command inserts a path through a drill-down picker, and appending #open or #reveal inside the backticks overrides the default action. The recorded description states that it needs file system access to validate paths and identify subfolders but never reads or writes file contents.

```cue
plugin: {
    id:     "marco-polo"
    name:   "Marco Polo"
    author: "Steve Crutchfield"
    repo:   "crufi/obsidian-marco-polo"

    html_url:    "https://community.obsidian.md/plugins/marco-polo"
    github_url:  "https://github.com/crufi/obsidian-marco-polo"
    description: "Type a local path inside backticks; Marco Polo validates, autocompletes, and produces a clickable link to open or reveal it in your file manager. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Easier to use than to describe. Just start typing: `/path/to/something` and you'll get a clickable link with autocomplete as you type. These also work: `~/something_in_your_home_dir` `$SOME_SHELL_VARIABLE/file.txt` (if optional shell variable expansion is on) `/path/to/some/directory/` Configurable color for valid paths; bad paths show up in red until corrected. Autocomplete dropdown: up/down to browse, Enter/Tab to accept, Esc to dismiss. Directories sort first. Command \"Marco Polo: Insert local path…\" opens a drill-down picker and inserts it as a backtick span. Per-link override: append #open or #reveal inside the backticks to override the default file action: `/click/to/open/this/file#open` `/click/to/show/containing/directory/of/file.txt#reveal` `/click/for/default/behavior/for/this/file` Needs file system access to validate paths and identify subfolders, but Marco Polo will never read your files or write anything."

    stats: {
        downloads:  41
        updated_at: 1783597523000
    }
}
```

[^template]: [[Obsidian plugin]]
