---
uid: 661da4be-c073-5235-92b5-3b4f4a3ef086
xid:
  - ui-sketch
aliases:
  - ui-sketch
  - UI Sketch
  - jkraccoon/obsidian-ui-sketch
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ui-sketch
alt:
  - https://github.com/jkraccoon/obsidian-ui-sketch
downloads: 396
updated at: "2026-06-20T06:40:26Z"
related to:
  - "[[GitHub - 1219774058]]"
remind me:
---

# UI Sketch

Renders mid-fidelity web UI wireframes inside a note from short YAML written in a ui-sketch fenced block, with 44 components available. The preview updates in the pane, follows the current Obsidian theme and viewport, and reports YAML errors with line numbers and typo hints. The generated DOM is sanitized and stateless, and the format is presented as one an AI coding assistant can write as well.

```cue
plugin: {
    id:     "ui-sketch"
    name:   "UI Sketch"
    author: "jkraccoon"
    repo:   "jkraccoon/obsidian-ui-sketch"

    html_url:    "https://community.obsidian.md/plugins/ui-sketch"
    github_url:  "https://github.com/jkraccoon/obsidian-ui-sketch"
    description: "Render mid-fi web UI wireframes in notes from YAML (44 components, inline errors, typo hints) for ai co work(like claude code, codex ). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render mid-fidelity web UI wireframes inside notes by writing short, readable YAML in a ui-sketch fenced block. Preview wireframes live in the pane, adapt to your Obsidian theme and viewport, show friendly line-numbered YAML errors, and produce sanitized, stateless DOM output. 사람이 읽기 쉽고 AI가 다루기 좋은 YAML로 웹 UI 와이어프레임을 그려서 Obsidian 노트 안에 바로 렌더링합니다. 클로드나 코덱스로 서비스 기획을 하는데 화면 레이아웃이나 구성요소를 표현하는 방식이 맘에 안드신다면. 이걸 쓰면됩니다."

    stats: {
        downloads:  396
        updated_at: 1781937626000
    }
}
```

[^template]: [[Obsidian plugin]]
