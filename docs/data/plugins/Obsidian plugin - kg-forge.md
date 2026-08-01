---
uid: f9b94ae0-df86-55e0-bab8-df517f9cd119
xid:
  - kg-forge
aliases:
  - kg-forge
  - Knowledge Forge
  - jimmycarroll2021/obsidian-kg-forge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/kg-forge
alt:
  - https://github.com/jimmycarroll2021/obsidian-kg-forge
downloads: 30
updated at: "2026-07-05T07:36:25Z"
related to:
  - "[[GitHub - 1289754962]]"
remind me:
---

# Knowledge Forge

Extracts typed subject-predicate-object triples from YAML frontmatter, Connections fields and wikilinks, attaching provenance such as source, confidence, timestamp and lineage to every fact. Graph tooling runs locally: GraphRAG prompts are generated from k-hop subgraphs, and vault schema and competency-question coverage are validated. Graphs can be exported as Neo4j Cypher or as Dataview templates.

```cue
plugin: {
    id:     "kg-forge"
    name:   "Knowledge Forge"
    author: "Jimmi (Jimmycarroll2021)"
    repo:   "jimmycarroll2021/obsidian-kg-forge"

    html_url:    "https://community.obsidian.md/plugins/kg-forge"
    github_url:  "https://github.com/jimmycarroll2021/obsidian-kg-forge"
    description: "Build a typed knowledge graph from your vault with triples, provenance, GraphRAG prompts, and competency questions. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Extract typed subject–predicate–object triples from YAML frontmatter, Connections fields, and wikilinks, and attach provenance (source, confidence, timestamp, lineage) to every fact. Build graph tools locally: generate GraphRAG prompts from k‑hop subgraphs, validate vault schema and competency‑question coverage, and export graphs as Neo4j Cypher or Dataview templates."

    stats: {
        downloads:  30
        updated_at: 1783236985000
    }
}
```

[^template]: [[Obsidian plugin]]
