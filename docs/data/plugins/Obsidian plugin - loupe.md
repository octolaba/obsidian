---
uid: d50687a5-2171-5e60-9c27-3e0dcb90f431
xid:
  - loupe
aliases:
  - loupe
  - Loupe
  - casperkwok/obsidian-loupe
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/loupe
alt:
  - https://github.com/casperkwok/obsidian-loupe
downloads: 363
updated at: "2026-07-21T11:38:54Z"
related to:
  - "[[GitHub - 1307462700]]"
remind me:
---

# Loupe

Shows and previews files that Obsidian normally hides in the file explorer: Office documents, HTML, CSV and TSV, JSON and more than fifty code and configuration formats. The recorded About text, written in Chinese, adds sandboxed iframes for web pages, multi-sheet views for xlsx, ods and csv, docx converted to HTML, formatted JSON and Prism syntax highlighting for code files. Handlers are registered per extension to avoid conflicts and skip an extension already taken, large files fall back to plain text, and formats such as PPT, epub and zip are opened in the default external program.

```cue
plugin: {
    id:     "loupe"
    name:   "Loupe"
    author: "Casper"
    repo:   "casperkwok/obsidian-loupe"

    html_url:    "https://community.obsidian.md/plugins/loupe"
    github_url:  "https://github.com/casperkwok/obsidian-loupe"
    description: "See and preview the files Obsidian normally hides — Office (Word/Excel/PowerPoint), HTML, CSV/TSV, JSON, and 50+ code & config formats — right in the file explorer. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "显示并预览文件浏览器中默认隐藏的非原生格式，支持网页(沙箱 iframe)、表格(xlsx/ods/csv)多 sheet 视图、docx 转 HTML、json 格式化与 Prism 语法高亮的代码文件。按扩展名隔离注册以避免冲突，遇到被占用自动跳过；对大文件降级为纯文本，并提供在默认程序中打开以处理 PPT/epub/zip 等外部格式。"

    stats: {
        downloads:  363
        updated_at: 1784633934000
    }
}
```

[^template]: [[Obsidian plugin]]
