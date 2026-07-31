---
uid: 69d1e986-ae69-5255-bc92-2d307a80083a
xid:
  - 3d-semantic-graph
aliases:
  - 3d-semantic-graph
  - 3D Semantic Graph
  - khr0907/obsidian-3d-semantic-graph
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/3d-semantic-graph
alt:
  - https://github.com/khr0907/obsidian-3d-semantic-graph
downloads: 409
updated at: "2026-07-08T06:59:05Z"
related to:
  - "[[GitHub - 1171423376]]"
remind me:
---

# 3D Semantic Graph

3D Semantic Graph places notes in a 3D semantic space, projecting OpenAI embeddings to three dimensions with UMAP or PCA so semantically related notes cluster together. Without an API key it falls back to a folder-based clustered sphere layout with translucent ConvexHull cluster regions. Real note links are drawn, nodes are colored by folder or first tag, and vectors can be imported or exported as JSON.

```cue
plugin: {
    id:     "3d-semantic-graph"
    name:   "3D Semantic Graph"
    author: "khr0907"
    repo:   "khr0907/obsidian-3d-semantic-graph"

    html_url:    "https://community.obsidian.md/plugins/3d-semantic-graph"
    github_url:  "https://github.com/khr0907/obsidian-3d-semantic-graph"
    description: "Visualize your notes in a 3D semantic space using embedding-based layouts or uploaded vectors. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Visualize notes in an interactive 3D space using OpenAI embeddings projected to 3D via UMAP or PCA so semantically related notes cluster together. Fall back to a folder-based clustered sphere layout with translucent ConvexHull cluster regions when no API key is available, show real Obsidian note links, color nodes by folder or first tag, and import/export vector JSON."

    stats: {
        downloads:  409
        updated_at: 1783493945000
    }
}
```

[^template]: [[Obsidian plugin]]
