---
uid: 3580d03d-f751-5d11-844c-c1f4a47b9e98
xid:
  - kimidian
aliases:
  - kimidian
  - Kimi Assistant
  - liu-zhiyu-enicom/kimidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/kimidian
alt:
  - https://github.com/liu-zhiyu-enicom/kimidian
downloads: 263
updated at: "2026-07-26T06:58:15Z"
related to:
  - "[[GitHub - 1312483944]]"
remind me:
---

# Kimi Assistant

Embeds the Kimi Code CLI in the right sidebar and talks to it over ACP, so it can read, search and edit notes in the vault. The conversation renders as chat bubbles with streaming Markdown and collapsible blocks for reasoning and tool calls, each naming the tool, its status and the target file. File edits and command execution are approved inline, past sessions are restored, the current note path is attached automatically, and the at sign completes a note name to inject it as context. Generation can be interrupted, and the model and connection status are shown at the bottom.

```cue
plugin: {
    id:     "kimidian"
    name:   "Kimi Assistant"
    author: "Liu"
    repo:   "liu-zhiyu-enicom/kimidian"

    html_url:    "https://community.obsidian.md/plugins/kimidian"
    github_url:  "https://github.com/liu-zhiyu-enicom/kimidian"
    description: "Embed Kimi Code CLI as an AI collaborator in your vault sidebar. Chat with Kimi over ACP to read, search and edit your notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "嵌入 Kimi Code CLI 到右侧边栏，让 Kimi 成为你的笔记仓库 AI 协作者，提供用户/助手聊天气泡、Markdown 流式渲染、思考与工具调用折叠块（工具名、状态、目标文件）。 在聊天内行内审批文件修改与命令执行，支持历史会话恢复、自动附带当前笔记路径、@ 触发笔记补全并以 <file path=\"...\"> 注入选中笔记，支持中断生成与底部模型/连接状态显示。"

    stats: {
        downloads:  263
        updated_at: 1785049095000
    }
}
```

[^template]: [[Obsidian plugin]]
