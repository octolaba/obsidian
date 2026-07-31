---
uid: 8a2f6838-8521-58e2-b770-a92b13723cb7
xid:
  - step-viewer
aliases:
  - step-viewer
  - STEP Viewer
  - ondreu/STEP-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/step-viewer
alt:
  - https://github.com/ondreu/STEP-viewer
downloads: 140
updated at: "2026-07-05T10:27:39Z"
related to:
  - "[[GitHub - 1286361260]]"
remind me:
---

# STEP Viewer

CAD models open in an interactive three.js viewer with orbit, pan and zoom, model colours, edges, measurement, annotations and a navigation cube, either by clicking a supported file in the explorer or by embedding the model inline in a note. STEP files are read as full B-rep geometry with assembly hierarchy and per-face colours, FreeCAD documents render their visible objects with placements and colours, and OBJ and STL are read as plain triangle meshes. Geometry parsing uses occt-import-js, OpenCASCADE compiled to WebAssembly, and the recorded inputs state that mobile is supported.

```cue
plugin: {
    id:     "step-viewer"
    name:   "STEP Viewer"
    author: "ondreu"
    repo:   "ondreu/STEP-viewer"

    html_url:    "https://community.obsidian.md/plugins/step-viewer"
    github_url:  "https://github.com/ondreu/STEP-viewer"
    description: "Open and view STEP (.step/.stp) and STL, OBJ, CAD, FCStd models in an interactive 3D viewer. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "View CAD models directly inside Obsidian in an interactive 3D viewer. Click a supported file in the file explorer and it opens in a three.js-powered viewer with orbit / pan / zoom, model colours, edges, measurement, annotations and a navigation cube — or embed a model inline in any note. Supported formats: STEP (.step / .stp) — full B-rep parsing with assembly hierarchy and per-face colours. FreeCAD (.FCStd) — native FreeCAD documents; the visible objects are rendered with their placements and colours. OBJ / STL — plain triangle meshes. Geometry parsing is done with occt-import-js (OpenCASCADE compiled to WASM), which reads both STEP and the BREP shapes stored inside FreeCAD documents. With mobile support."

    stats: {
        downloads:  140
        updated_at: 1783247259000
    }
}
```

[^template]: [[Obsidian plugin]]
