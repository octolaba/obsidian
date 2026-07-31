---
uid: 1e1c6db5-e74e-50d4-b2c6-ddfc3b8b3e96
xid:
  - babashka
aliases:
  - babashka
  - Babashka
  - filipesilva/obsidian-babashka
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/babashka
alt:
  - https://github.com/filipesilva/obsidian-babashka
downloads: 3544
updated at: "2023-02-05T09:54:16Z"
related to:
  - "[[GitHub - 585615994]]"
remind me:
---

# Babashka

Babashka evaluates Clojure and ClojureScript code blocks in a note using Babashka and Node Babashka. Results are printed inline or outside the note, an nREPL can be started or connected to, vault-aware bindings are available, dependencies are included through bb.edn or nbb.edn, and a command kills all evaluation and nREPL processes.

```cue
plugin: {
    id:     "babashka"
    name:   "Babashka"
    author: "filipesilva"
    repo:   "filipesilva/obsidian-babashka"

    html_url:    "https://community.obsidian.md/plugins/babashka"
    github_url:  "https://github.com/filipesilva/obsidian-babashka"
    description: "Evaluate Clojure(Script) code blocks in Babashka."
    about:       "Run Clojure and ClojureScript code blocks using Babashka and Node Babashka directly inside your vault. Evaluate blocks inline or print results outside notes, start or connect to a Babashka nREPL, use vault-aware bindings, include deps via bb.edn/nbb.edn, and kill all eval/nREPL processes."

    stats: {
        downloads:  3544
        updated_at: 1675590856000
    }
}
```

[^template]: [[Obsidian plugin]]
