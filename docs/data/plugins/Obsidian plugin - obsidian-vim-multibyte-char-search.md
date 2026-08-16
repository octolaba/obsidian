---
uid: efdbeffd-d05e-58b9-8ee3-a5ec6f877ebf
xid:
  - obsidian-vim-multibyte-char-search
aliases:
  - obsidian-vim-multibyte-char-search
  - Vim Multibyte Char Search
  - anselmwang/obsidian-vim-multibyte-char-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-vim-multibyte-char-search
alt:
  - https://github.com/anselmwang/obsidian-vim-multibyte-char-search
downloads: 4264
updated at: "2022-04-21T21:45:56Z"
related to:
  - "[[GitHub - 467370498]]"
remind me:
---

# Vim Multibyte Char Search

In Vim mode, multibyte characters are searched by typing the initial letters of their input-method encoding, for example pinyin initials for Chinese, without switching input method. The Search Multibytes command converts those initials into a multibyte search pattern and steps through the matches.

```cue
plugin: {
    id:     "obsidian-vim-multibyte-char-search"
    name:   "Vim Multibyte Char Search"
    author: "anselmwang"
    repo:   "anselmwang/obsidian-vim-multibyte-char-search"

    html_url:    "https://community.obsidian.md/plugins/obsidian-vim-multibyte-char-search"
    github_url:  "https://github.com/anselmwang/obsidian-vim-multibyte-char-search"
    description: "Search multibyte characters by the first character of corresponding ASCII encoding of input method. For example, for Chinese, search by the first character of Pinyin."
    about:       "Search multibyte characters in Vim mode without switching input methods by typing the initial letters of their input-method encoding (e.g., pinyin \"yl\" for \"用来\"). Run the Search Multibytes command to convert initials into multibyte search patterns and jump through matches."

    stats: {
        downloads:  4264
        updated_at: 1650577556000
    }
}
```

[^template]: [[Obsidian plugin]]
