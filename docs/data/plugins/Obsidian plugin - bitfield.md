---
uid: d05606ad-8224-5280-8798-07a713346714
xid:
  - bitfield
aliases:
  - bitfield
  - Bitfield
  - aipyer/bitfield
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/bitfield
alt:
  - https://github.com/aipyer/bitfield
downloads: 116
updated at: "2026-08-07T06:04:45Z"
related to:
  - "[[GitHub - 1257816172]]"
remind me:
---

# Bitfield

Bitfield renders hardware bit-field definitions written in a code block as interactive SVG diagrams and tables. A definition lists names, widths and descriptions with indented subfields, and the plugin computes bit ranges, adds reserved padding, detects overflow and assigns colors; one code block can hold several bitfields, and @references compose modular components into larger definitions with click-to-jump and hover preview. Each bitfield switches between a diagram, laid out horizontally or vertically according to width, and a table of field names, bit ranges and descriptions with nested indentation.

```cue
plugin: {
    id:     "bitfield"
    name:   "Bitfield"
    author: "aipyer"
    repo:   "aipyer/bitfield"

    html_url:    "https://community.obsidian.md/plugins/bitfield"
    github_url:  "https://github.com/aipyer/bitfield"
    description: "将位域定义渲染为交互式 SVG 图表和表格。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bitfield 插件将硬件位域定义渲染为交互式 SVG 图表和表格。您只需在代码块中编写名称、宽度和描述，并缩进子字段，插件即可处理其余部分——位范围计算、保留填充、溢出检测和颜色分配。 该插件适用于寄存器映射、接口协议、数据包头以及任何固定宽度的位布局。一个代码块可以定义多个位域。使用 @references 可以将模块化组件组合成复杂的定义，避免重复。点击引用即可跳转到其定义，悬停即可预览。 每个位域都可以在图表和表格之间切换。图表会根据宽度自动选择水平或垂直布局。表格会显示字段名称、位范围和描述，并带有嵌套缩进。 您的位域规范会保存在您的笔记中，实时渲染，始终与您的设计保持同步。"

    stats: {
        downloads:  116
        updated_at: 1786082685000
    }
}
```

[^template]: [[Obsidian plugin]]
