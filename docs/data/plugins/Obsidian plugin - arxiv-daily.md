---
uid: 0cb57769-8b43-5edd-b5cc-6b8a91bc0696
xid:
  - arxiv-daily
aliases:
  - arxiv-daily
  - arXiv Daily
  - tdccccc/arxiv-daily
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/arxiv-daily
alt:
  - https://github.com/tdccccc/arxiv-daily
downloads: 302
updated at: "2026-08-01T10:08:22Z"
related to:
  - "[[GitHub - 1175841281]]"
remind me:
---

# arXiv Daily

Collects new arXiv papers each day and uses an LLM to filter and classify them against the reader's own research topics, writing a Chinese-language daily report into the vault. Related papers are grouped by topic with the core entries marked, and each core paper also receives its own in-depth reading note. The report supports sync marking, back-filling of past days, a dashboard view and endpoints from several LLM vendors.

```cue
plugin: {
    id:     "arxiv-daily"
    name:   "arXiv Daily"
    author: "Da-Chuan Tian"
    repo:   "tdccccc/arxiv-daily"

    html_url:    "https://community.obsidian.md/plugins/arxiv-daily"
    github_url:  "https://github.com/tdccccc/arxiv-daily"
    description: "Daily arXiv tracker that filters and summarizes papers via LLM into your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "抓取每天 arXiv 新论文并用 LLM 按你的研究主题智能筛选与分类，在 Vault 中生成中文日报，按主题汇总相关论文并标注核心条目。为核心论文生成独立深度解读笔记，支持在日报中标记同步管理、历史补跑、Dashboard 浏览与多厂商 LLM 端点。"

    stats: {
        downloads:  302
        updated_at: 1785578902000
    }
}
```

[^template]: [[Obsidian plugin]]
