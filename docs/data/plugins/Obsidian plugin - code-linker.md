---
uid: acaf711a-3b6a-500b-8a39-59102314e594
xid:
  - code-linker
aliases:
  - code-linker
  - Code Linker
  - max-fluff/obsidian-code-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/code-linker
alt:
  - https://github.com/max-fluff/obsidian-code-linker
downloads: 552
updated at: "2026-08-02T13:11:43Z"
related to:
  - "[[GitHub - 1284225360]]"
remind me:
---

# Code Linker

Inserts deep links from notes into source code: a trigger starts an autocomplete over files, classes and functions, and the resulting link opens the file at the exact line in VS Code, a JetBrains IDE or any custom URL scheme, or becomes a shareable GitHub or GitLab permalink. Live code snippets can be embedded so the note shows current source with syntax highlighting rather than a pasted copy that goes stale. The project is indexed for fuzzy search, drifted links are flagged and fixed by one command, and hovering a link previews the code in place. C#, TypeScript, JavaScript, Python, Java, C and C++, PHP, Go and Rust work out of the box and other languages are added through a small JSON config; it is desktop only.

```cue
plugin: {
    id:     "code-linker"
    name:   "Code Linker"
    author: "max-fluff"
    repo:   "max-fluff/obsidian-code-linker"

    html_url:    "https://community.obsidian.md/plugins/code-linker"
    github_url:  "https://github.com/max-fluff/obsidian-code-linker"
    description: "Deep-link your notes to your source code. Autocomplete a symbol and jump to the exact line in your IDE (VS Code, JetBrains) or a GitHub/GitLab permalink. Embed live code snippets. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Link your notes and documentation to your source code. Type a trigger, autocomplete a file, class, or function name, and Code Linker inserts a deep link that opens the file at the exact line in your editor: VS Code, JetBrains (Rider, IntelliJ, PyCharm…), or any custom URL scheme. It can also build a shareable GitHub or GitLab permalink. You can also embed live code snippets directly in a note. Instead of pasting code blocks that go stale, an embed pulls straight from the source file and refreshes as the code changes, with syntax highlighting. Code Linker indexes your project with fuzzy search, so any file or type declaration is a few keystrokes away. When code moves and a link drifts, the plugin flags and fixes it in one command, and you can hover any link to preview the code in place. C#, TypeScript, JavaScript, Python, Java, C/C++, PHP, Go and Rust work out of the box, and you can add your own language in a small JSON config. Desktop only."

    stats: {
        downloads:  552
        updated_at: 1785676303000
    }
}
```

[^template]: [[Obsidian plugin]]
