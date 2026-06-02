# Editor extensions

Three different surfaces change how a note looks or behaves, and picking the wrong one is the most
expensive mistake in this area: the `Editor` content API, CodeMirror 6 extensions, and Markdown
post-processors. This reference opens with the gate that separates them.

## Contents

- [Decision gate: which surface](#decision-gate-which-surface)
- [Evidence boundary and availability](#evidence-boundary-and-availability)
- [The Editor abstraction](#the-editor-abstraction)
- [Registering a CodeMirror 6 extension](#registering-a-codemirror-6-extension)
- [Reconfiguring a registered extension](#reconfiguring-a-registered-extension)
- [View plugin or state field](#view-plugin-or-state-field)
- [Decorations](#decorations)
- [Detecting Live Preview from inside an extension](#detecting-live-preview-from-inside-an-extension)
- [Reaching the editor from plugin code](#reaching-the-editor-from-plugin-code)
- [Markdown post-processors](#markdown-post-processors)
- [Code-block processors](#code-block-processors)
- [CodeMirror versions, externals, and identity](#codemirror-versions-externals-and-identity)
- [Deprecated editor APIs](#deprecated-editor-apis)
- [Known gaps](#known-gaps)

## Decision gate: which surface

| What you want to change | Build | Where it takes effect |
|---|---|---|
| The rendered HTML of a finished note | Markdown post-processor | Reading view |
| How the document *looks and feels while editing* | CodeMirror 6 editor extension | Live Preview |
| The *text* of the active note — insert, replace, move the cursor | `Editor` API | Wherever an editor is active |

The first two rows are the documented boundary, stated as a two-way choice: "If you want to change
how to convert Markdown to HTML in the Reading view, consider building a Markdown post processor"
**Contract** (docs: en/Plugins/Editor/Editor extensions.md:15) and "If you want to change how the
document looks and feels in Live Preview, you need to build an editor extension" **Contract**
(docs: en/Plugins/Editor/Editor extensions.md:16). The typings restate the post-processor half —
registration exists "to change how the document looks in reading mode" **Contract**
(api: obsidian.d.ts:4987).

Three consequences fall straight out of that table.

1. **Covering both views means writing both mechanisms.** The two paths are described as disjoint
   and no shared code path is documented anywhere in the pinned tree — **Inference** from the
   boundary statement itself (docs: en/Plugins/Editor/Editor extensions.md:15-16).
2. **The `Editor` API is not a rendering surface.** It "exposes operations for reading and
   manipulating an active Markdown document in edit mode" **Contract**
   (docs: en/Plugins/Editor/Editor.md:1) — content, not appearance.
3. **Prefer not to build a CM6 extension.** "Building editor extensions can be challenging, so
   before you start building one, consider whether you really need it" **Contract**
   (docs: en/Plugins/Editor/Editor extensions.md:13). An Obsidian editor extension "is the same thing
   as a CodeMirror 6 extension" **Contract** (docs: en/Plugins/Editor/Editor extensions.md:7), so you
   are adopting CM6's architecture, not an Obsidian wrapper around it.

**Source mode.** The pinned developer docs never state which mechanism applies in Source mode: the
two lines above are the only mode-boundary statements in the whole plugin documentation, and the
phrase "source mode" appears only in two CSS-variable table rows
(docs: en/Reference/CSS variables/Editor/List.md:12; docs: en/Reference/CSS variables/Components/Indentation guides.md:16). Because a CM6 extension is
registered against the editor rather than against a mode, a Live-Preview extension is expected to
load in Source mode as well, and a post-processor is expected not to run there at all — both
statements are **Inference**, not contract. Say so whenever Source mode comes up, and never present
Source-mode coverage as documented.

## Evidence boundary and availability

Narrative editor documentation is nine pages that deliberately defer to upstream CodeMirror: five of
them carry the same note saying the page "aims to distill the official CodeMirror 6 documentation"
(docs: en/Plugins/Editor/View plugins.md:3-4; docs: en/Plugins/Editor/Viewport.md:11-12; docs: en/Plugins/Editor/Decorations.md:8-9), and the entry page points at
`codemirror.net/docs` for anything deeper **Observed**
(docs: en/Plugins/Editor/Editor extensions.md:9). Anything a question needs beyond those pages is
CM6 knowledge from an unpinned upstream source — label it as such rather than presenting it as an
Obsidian contract.

Availability at this pin — stable app is 1.12.7, so everything below is usable by any plugin:

| API | `@since` | Tier at pin |
|---|---|---|
| `Editor` | 0.11.11 (api: obsidian.d.ts:2401) | stable |
| `Editor.posToOffset` / `Editor.offsetToPos` | 0.11.11 (api: obsidian.d.ts:2564; api: obsidian.d.ts:2569) | stable |
| `Editor.transaction` | 0.13.0 (api: obsidian.d.ts:2554) | stable |
| `Plugin.registerEditorExtension` | 0.12.8 (api: obsidian.d.ts:5017) | stable |
| `Workspace.updateOptions` | 0.13.21 (api: obsidian.d.ts:8057) | stable |
| `Plugin.registerMarkdownPostProcessor` | 0.9.7 (api: obsidian.d.ts:4990) | stable |
| `Plugin.registerMarkdownCodeBlockProcessor` | 0.9.7 (api: obsidian.d.ts:4999) | stable |
| `MarkdownPostProcessor` | 0.10.12 (api: obsidian.d.ts:3978) | stable |
| `MarkdownPreviewRenderer.createCodeBlockPostProcessor` | 0.12.11 (api: obsidian.d.ts:4051) | stable |
| `editorLivePreviewField`, `editorInfoField`, `editorEditorField`, `livePreviewState`, `MarkdownRenderer.render`, `Workspace.activeEditor` | untagged (api: obsidian.d.ts:2605-2609; api: obsidian.d.ts:2599-2603; api: obsidian.d.ts:2593-2597; api: obsidian.d.ts:3831-3834; api: obsidian.d.ts:4138-4147; api: obsidian.d.ts:7825-7830) | availability unknown; presence in the 1.13.2 typings does not establish a 1.12.7 floor |

## The Editor abstraction

`Editor` is "a common interface that bridges the gap between CodeMirror 5 and CodeMirror 6"
**Contract** (api: obsidian.d.ts:2399). That is the whole reason to prefer it: "By using `Editor`
instead of directly accessing the CodeMirror instance, you ensure that your plugin works on both
platforms" — CM5 is the legacy desktop-only editor **Contract**
(docs: en/Plugins/Editor/Editor.md:19).

Entry points, in order of preference:

- In a command, use `editorCallback` **Contract** (docs: en/Plugins/Editor/Editor.md:3). Its second
  argument is typed `MarkdownView | MarkdownFileInfo` **Contract** (api: obsidian.d.ts:1794) even
  though the JSDoc example types it `MarkdownView` **Contract** (api: obsidian.d.ts:1784). Follow the
  signature and narrow with `instanceof`; the widening was deliberate, "to work within a Canvas"
  **Contract** (api: CHANGELOG.md:239).
- Elsewhere, `app.workspace.getActiveViewOfType(MarkdownView)` and a null check — "Make sure the user
  is editing a Markdown file" **Contract** (docs: en/Plugins/Editor/Editor.md:8-11).
- `Workspace.activeEditor` is the Canvas-safe alternative and "can be null if the active view has no
  editor" **Contract** (api: obsidian.d.ts:7825-7830). Its type is `MarkdownFileInfo`, whose `file`
  may be null and whose `editor` is **optional** **Contract** (api: obsidian.d.ts:3954-3967) —
  unlike `MarkdownView`, which declares a non-optional `editor` **Contract**
  (api: obsidian.d.ts:4188-4191). **Conflict:** the narrative page teaches only the
  `getActiveViewOfType` path and never mentions `activeEditor`
  (docs: en/Plugins/Editor/Editor.md:5-16).

Two model facts that catch people out: a single-position `replaceRange` **inserts** rather than
replaces **Contract** (docs: en/Plugins/Editor/Editor.md:23), and the `Editor` position model is
`{line, ch}` while CM6 works in flat offsets — `posToOffset` and `offsetToPos` are the bridge
**Contract** (api: obsidian.d.ts:2566; api: obsidian.d.ts:2571).

**Group related edits.** Use `Editor.transaction` **Contract** (api: obsidian.d.ts:2556) or a single
CM6 dispatch. The documented rationale is undo granularity: two ungrouped inserts mean the user
undoes twice **Contract** (docs: en/Plugins/Editor/State management.md:38-45).

`exec()` accepts a closed set of 17 command names **Contract** (api: obsidian.d.ts:2591) — reach for
it before reimplementing fold, indent, or line-swap behaviour.

Editor-adjacent workspace events all carry `MarkdownView | MarkdownFileInfo`: `editor-menu`
(api: obsidian.d.ts:8144), `editor-change`, which fires for programmatic *and* user changes
(api: obsidian.d.ts:8146-8150), `editor-paste` (api: obsidian.d.ts:8159), and `editor-drop`
(api: obsidian.d.ts:8167) **Contract**. For paste and drop you must "check for
`evt.defaultPrevented` before attempting to handle this event, and return if it has been already
handled", then call `evt.preventDefault()` when you do handle it **Contract**
(api: obsidian.d.ts:8154-8155; api: obsidian.d.ts:8162-8163). Registration and teardown of these
listeners belong to the lifecycle and registration reference.

## Registering a CodeMirror 6 extension

`registerEditorExtension(extension: Extension)` is called from `onload` **Contract**
(api: obsidian.d.ts:5019; docs: en/Plugins/Editor/Editor extensions.md:22). The documented shape
passes an array of extensions **Observed**
(docs: en/Plugins/Editor/Editor extensions.md:26). The two most common extension kinds are view
plugins and state fields **Contract** (docs: en/Plugins/Editor/Editor extensions.md:30).

There is **no documented way to unregister a single editor extension**; nothing in the pinned tree
describes teardown short of plugin unload (**Gap**).

## Reconfiguring a registered extension

The contract is unusual and easy to break: "To reconfigure cm6 extensions for a plugin on the fly,
an array should be passed in, and modified dynamically. Once this array is modified, calling
`Workspace.updateOptions` will apply the changes" **Contract** (api: obsidian.d.ts:5013-5014). The
guidelines ship a worked example whose comments spell out the trap — "Empty the array while keeping
the same reference (Don't create a new array here)" **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:294-295), then push the new extension and call
`this.app.workspace.updateOptions()` **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:296-304).

So the procedure is fixed:

1. Hold one `Extension[]` field for the lifetime of the plugin.
2. Register that same array once in `onload`.
3. To reconfigure: set `.length = 0`, push replacements, call `updateOptions()`.

Reassigning the field instead of mutating it silently detaches your extension from the editor —
Obsidian still holds the original array. **Inference** from the registration contract and the
guidelines comment (api: obsidian.d.ts:5013-5014; docs: en/Plugins/Releasing/Plugin guidelines.md:294-295).

**Cost.** `updateOptions()` "will update/reconfigure the options of all Markdown views. It is fairly
expensive, so it should not be called frequently" **Contract** (api: obsidian.d.ts:8053-8055).
Never call it per keystroke or per slider tick; call it once when a settings dialog closes or a
setting is committed **Recommendation**. Measurement guidance lives in the performance reference.

CM6's own `Compartment` mechanism appears nowhere in the pinned typings or docs — the array-mutation
recipe is the only sanctioned pattern here (**Gap**).

## View plugin or state field

**View plugins** run "after the viewport has been recomputed", which is exactly why "a view plugin
can't make any changes that would impact the viewport. For example, by inserting blocks or line
breaks into the document" **Contract** (docs: en/Plugins/Editor/View plugins.md:12). For anything
that changes vertical layout you "need to use a state field" **Contract**
(docs: en/Plugins/Editor/View plugins.md:14-15).

A view plugin is a class implementing `PluginValue`, passed to `ViewPlugin.fromClass()` **Contract**
(docs: en/Plugins/Editor/View plugins.md:17), with three lifecycle methods: `constructor()`
initialises, `update()` "updates your plugin when something has changed", `destroy()` cleans up
**Contract** (docs: en/Plugins/Editor/View plugins.md:44-48).

**State fields** manage state rather than store it: "state fields don't actually *store* state. They
*manage* it. State fields take the current state, applies any state effects, and returns the new
state" **Contract** (docs: en/Plugins/Editor/State fields.md:30). Shape is
`StateField.define<T>({ create, update })` **Contract**
(docs: en/Plugins/Editor/State fields.md:35-54). Two rules the example encodes:

- A single transaction may carry **several** effects, so `update()` iterates `transaction.effects`
  and applies them in order **Contract** (docs: en/Plugins/Editor/State fields.md:32; docs: en/Plugins/Editor/State fields.md:42-50).
- Discriminate with `effect.is(...)` before reading `effect.value` **Contract**
  (docs: en/Plugins/Editor/State fields.md:59).

Effects are declared with `StateEffect.define<Payload>()` — the type parameter is optional
**Contract** (docs: en/Plugins/Editor/State fields.md:21-26) — and reach a field only through a
dispatched transaction, `view.dispatch({ effects: [...] })` **Contract**
(docs: en/Plugins/Editor/State fields.md:63-69). Wrapping those dispatches in exported helper
functions taking `(view: EditorView, ...)` is the documented ergonomic **Observed**
(docs: en/Plugins/Editor/State fields.md:71-91).

The viewport itself is the reason the editor scales: it "only renders what's visible (and a little
bit more)" **Contract** (docs: en/Plugins/Editor/Viewport.md:1), and it is invalidated by scrolling
*and* by document changes **Contract** (docs: en/Plugins/Editor/Viewport.md:7).

## Decorations

Decorations are the sanctioned way to change appearance: "If you intend to change the look and feel
by adding, replacing, or styling elements in the editor, you most likely need to use decorations"
**Contract** (docs: en/Plugins/Editor/Decorations.md:1). Four kinds — mark styles existing elements,
widget inserts elements, replace hides or substitutes content, line styles whole lines **Contract**
(docs: en/Plugins/Editor/Decorations.md:22-25).

**Provider choice**, three rules and a tie-break **Contract**
(docs: en/Plugins/Editor/Decorations.md:33-35; docs: en/Plugins/Editor/Decorations.md:37):

| Situation | Provider |
|---|---|
| The decoration is determined by what is in the viewport | View plugin |
| Decorations must be managed outside the viewport | State field |
| The change could alter the viewport's content, e.g. adding line breaks | State field |
| Either would work | View plugin — "generally results in better performance" |

The worked scale argument: a whole-document spell check needs a state field, while a viewport-scoped
one "would be able to spell check documents with millions of lines of text" **Contract**
(docs: en/Plugins/Editor/Decorations.md:39-41).

Wiring differs by provider. A state field is defined as `StateField.define<DecorationSet>` with
`create` returning `Decoration.none` and a `provide` returning `EditorView.decorations.from(field)`
**Contract** (docs: en/Plugins/Editor/Decorations.md:86-92; docs: en/Plugins/Editor/Decorations.md:111-114; docs: en/Plugins/Editor/Decorations.md:137-139). A view plugin keeps a `DecorationSet` member, builds
it in the constructor, rebuilds it in `update()`, and exposes it through `PluginSpec.decorations`
**Contract** (docs: en/Plugins/Editor/Decorations.md:145-150; docs: en/Plugins/Editor/Decorations.md:212-214; docs: en/Plugins/Editor/Decorations.md:224). Sets are assembled with `new RangeSetBuilder<Decoration>()`,
`builder.add(...)` and `builder.finish()` **Contract** (docs: en/Plugins/Editor/Decorations.md:116; docs: en/Plugins/Editor/Decorations.md:124-131; docs: en/Plugins/Editor/Decorations.md:135). Widgets
subclass `WidgetType` and implement `toDOM(view)` **Contract**
(docs: en/Plugins/Editor/Decorations.md:63-71).

Two rules carry most of the runtime cost:

- **Gate the rebuild.** "Not all updates are reasons to rebuild your decorations" **Contract**
  (docs: en/Plugins/Editor/Decorations.md:152); the sanctioned guard is
  `if (update.docChanged || update.viewportChanged)` **Contract**
  (docs: en/Plugins/Editor/Decorations.md:176-180). Rebuilding on every `ViewUpdate` runs your work
  on cursor moves and focus changes too.
- **Bound the traversal.** "Since the view plugin knows what's visible to the user, you can use
  `view.visibleRanges` to limit what parts of the syntax tree to visit" **Contract**
  (docs: en/Plugins/Editor/Decorations.md:226), which the example does by iterating
  `view.visibleRanges` and passing `{from, to}` into the syntax-tree walk **Observed**
  (docs: en/Plugins/Editor/Decorations.md:187-190).

The state-field example ignores `oldState` and rebuilds the whole set on every transaction
**Observed** (docs: en/Plugins/Editor/Decorations.md:115-135). Incremental mapping of an existing
set is not demonstrated or discussed anywhere in the pinned tree (**Gap**) — so a state-field
provider's cost is proportional to the document, every transaction, unless you write mapping the
docs do not cover.

`livePreviewState` exposes `{ mousedown: boolean }`, "true if the left mouse is currently held down
in the editor (for example, when drag-to-select text)" **Contract** (api: obsidian.d.ts:3834; api: obsidian.d.ts:3840-3846) — the one pinned hook for suppressing decoration churn during a drag
selection.

## Detecting Live Preview from inside an extension

`MarkdownView.getMode()` returns `MarkdownViewModeType` **Contract**
(api: obsidian.d.ts:4214), which is `'source' | 'preview'` **Contract**
(api: obsidian.d.ts:4240). There is no third value, so **`getMode()` cannot tell Live Preview from
Source mode** — both are reported as `'source'` (**Inference**; the docs never state this, and the
pinned tree contains no page explaining the return value).

The only discriminator in the pinned surface is `editorLivePreviewField`: "Use this StateField to
check whether Live Preview is active" **Contract** (api: obsidian.d.ts:2605-2609). Read it as
`state.field(editorLivePreviewField)` inside CM6 code. None of these fields is mentioned in any of
the nine narrative editor pages (**Gap**) — they exist only as declarations.

## Reaching the editor from plugin code

Two directions, and the docs teach only one of them.

**Outside in.** The documented route is an untyped cast: "since the Obsidian API doesn't actually
expose the editor, you need to tell TypeScript to trust that it's there, using `@ts-expect-error`"
**Contract** (docs: en/Plugins/Editor/Communicating with editor extensions.md:3), written as
`// @ts-expect-error, not typed` above `const editorView = view.editor.cm as EditorView;`
**Contract** (docs: en/Plugins/Editor/Communicating with editor extensions.md:8-9). The cast is
genuinely unavoidable: `Editor` declares no `cm` member anywhere in the typings **Observed**
(api: obsidian.d.ts:2403). Treat it as sanctioned-but-unstable — it is documented, and it is not a
declared contract.

From there, a view-plugin instance comes from `editorView.plugin(examplePlugin)` and **must** be
null-checked before use **Contract**
(docs: en/Plugins/Editor/Communicating with editor extensions.md:14; docs: en/Plugins/Editor/Communicating with editor extensions.md:24-28), and a state field is reached
by dispatching to it directly **Contract**
(docs: en/Plugins/Editor/Communicating with editor extensions.md:35; docs: en/Plugins/Editor/Communicating with editor extensions.md:45-49).

**Inside out.** From CM6 code the typed route exists and needs no cast: `editorEditorField` yields
the `EditorView` **Contract** (api: obsidian.d.ts:2593-2597) and `editorInfoField` yields
"information about this Markdown editor, such as the associated file, or the Editor" **Contract**
(api: obsidian.d.ts:2599-2603). **Conflict:** the documentation page teaches the `@ts-expect-error`
cast and never mentions either field. **Recommendation:** inside an extension use the fields;
reserve the cast for plugin code that has only a view.

Both documented examples fetch the `EditorView` freshly inside each `editorCallback` rather than
caching it **Observed** (docs: en/Plugins/Editor/Communicating with editor extensions.md:20-24; docs: en/Plugins/Editor/Communicating with editor extensions.md:41-45). Nothing in the pinned tree
states what happens to a stored `EditorView` across leaf reuse, mode switches, deferred views, or
pop-out windows (**Gap**) — so do not cache one. Widget and post-processor DOM construction in a
pop-out window has its own document and window rules, owned by the workspace, views, and state
reference.

## Markdown post-processors

`registerMarkdownPostProcessor(postProcessor, sortOrder?)` returns the processor **Contract**
(api: obsidian.d.ts:4992); the processor itself is
`(el, ctx) => Promise<any> | void`, so async is allowed **Contract** (api: obsidian.d.ts:3985).

Contracts worth knowing before you write one:

- **You get a section, not the document.** "A post processor receives an element which is a section
  of the preview" **Contract** (api: obsidian.d.ts:3971). Never assume whole-note context.
- **DOM mutation is expected here** — unlike in the editor, where decorations are the sanctioned
  path: post-processors "can mutate the DOM to render various things, such as mermaid graphs, latex
  equations, or custom controls" **Contract** (api: obsidian.d.ts:3973).
- **`sortOrder` defaults to 0 and lower runs first** **Contract** (api: obsidian.d.ts:3987). It is a
  parameter of both register methods (api: obsidian.d.ts:4992; api: obsidian.d.ts:5001) and is never
  mentioned on the narrative page (**Gap**).
- **Lifecycle needs `ctx.addChild`.** "If your post processor requires lifecycle management, for
  example, to clear an interval, kill a subprocess, etc when this element is removed from the app,
  look into `MarkdownPostProcessorContext.addChild`" **Contract** (api: obsidian.d.ts:3975-3976).
  `addChild` "adds a child component that will have its lifecycle managed by the renderer … if the
  containerEl of the child is ever removed, the component's unload will be called" **Contract**
  (api: obsidian.d.ts:4009-4016). The child is a `MarkdownRenderChild`, constructed with the element
  used "to test whether this component is still alive" — when the user edits the source and the
  element is replaced, the component unloads **Contract** (api: obsidian.d.ts:4104-4114). Anything
  with a timer, listener, or subprocess needs this; the plugin's own `register*` helpers do not fire
  when a *section* is re-rendered.
- **`getSectionInfo` is lazy and nullable.** "Only call this function right before you need this
  information to get the most up-to-date version. This function may also return null in many
  circumstances; if you use it, you must be prepared to deal with nulls" **Contract**
  (api: obsidian.d.ts:4017-4023). It returns `{text, lineStart, lineEnd}` **Contract**
  (api: obsidian.d.ts:4151-4158). Never cache the result.
- Context also carries `docId` (api: obsidian.d.ts:4000), `sourcePath` — "any links are assumed to be
  relative to the `sourcePath`" (api: obsidian.d.ts:4002) — and `frontmatter`, typed
  `any | null | undefined` (api: obsidian.d.ts:4007) **Contract**.
- **Rendering nested Markdown** goes through
  `MarkdownRenderer.render(app, markdown, el, sourcePath, component)`, whose `component` is "a parent
  component to manage the lifecycle of the rendered child components" **Contract**
  (api: obsidian.d.ts:4138-4147). Pass the `MarkdownRenderChild` you registered with `addChild`, not
  the plugin, when the output belongs to one section **Recommendation**.

The documented examples build DOM with Obsidian's element helpers — `findAll`, `createSpan`,
`createEl` **Observed** (docs: en/Plugins/Editor/Markdown post processing.md:16-28; docs: en/Plugins/Editor/Markdown post processing.md:58-73). The rules governing HTML construction and
sanitisation live in the security and policies reference.

**Anti-pattern.** `MarkdownPreviewRenderer.registerPostProcessor` and `unregisterPostProcessor`
exist as statics **Observed** (api: obsidian.d.ts:4042; api: obsidian.d.ts:4047) but bypass the
plugin's own teardown; the `Plugin` wrapper (api: obsidian.d.ts:4992) is what ties a processor to
plugin unload (**Inference** — no pinned page states this).

## Code-block processors

`registerMarkdownCodeBlockProcessor(language, handler, sortOrder?)` "takes care of removing the
`<pre><code>` and create a `<div>` that will be passed to the handler, and is expected to be filled
with custom elements" **Contract** (api: obsidian.d.ts:4993-5001). Use it whenever you own a fence
language; the worked example renders CSV into a table **Observed**
(docs: en/Plugins/Editor/Markdown post processing.md:51-73).

**It is a post-processor underneath.** The static factory
`MarkdownPreviewRenderer.createCodeBlockPostProcessor(language, handler)` returns a plain post
processor **Observed** (api: obsidian.d.ts:4053), and both register methods return a
`MarkdownPostProcessor` (api: obsidian.d.ts:4992; api: obsidian.d.ts:5001). So a code-block processor
**inherits every post-processor constraint, including Reading-view-only scope** (**Inference**).
A fenced block that must render identically in Live Preview needs a CM6 extension as well — this is
the single most common reason a code-block feature "works in Reading view but not while editing".

## CodeMirror versions, externals, and identity

The typings import from exactly two CM6 packages — `@codemirror/state` and `@codemirror/view`
**Contract** (api: obsidian.d.ts:6; api: obsidian.d.ts:7) — and pin them as exact peer dependencies,
`@codemirror/state` 6.7.0 and `@codemirror/view` 6.43.5 **Contract** (api: package.json:20-23).
Match those versions.

The official template marks all of them, plus nine more CM6 and Lezer packages, as build externals
**Observed** (sample: esbuild.config.mjs:19-34). Keeping them external is not a size optimisation:
CodeMirror identifies facets and state fields by object identity, so a second copy of
`@codemirror/state` inside your bundle produces facets that are different objects from the editor's.
The extension then registers successfully and does nothing — **no error, no warning, no console
output**. **Inference** from the exact peer pins plus the externals list
(api: package.json:20-23; sample: esbuild.config.mjs:22-32).

The diagnostic follows from the failure mode: if a CM6 extension has no visible effect and no error,
check the bundle for `@codemirror/*` code before debugging the extension itself. Build-configuration
mechanics are owned by the project setup reference.

The complete set of `@codemirror/*` packages Obsidian ships at runtime is not enumerated anywhere in
the pinned tree; the template's eleven-entry externals list is the closest available proxy (**Gap**).

## Deprecated editor APIs

| Deprecated | Replacement | Evidence |
|---|---|---|
| `editorViewField` | `editorInfoField` | (api: obsidian.d.ts:2786) |
| `MarkdownRenderer.renderMarkdown` | `MarkdownRenderer.render` | (api: obsidian.d.ts:4134) |

`editorViewField` also carries a typing warning worth repeating: it "is now mapped directly to
`editorInfoField`, which return a MarkdownFileInfo, which may be a MarkdownView but not necessarily"
**Contract** (api: obsidian.d.ts:2783-2788). Code that assumed a `MarkdownView` from it is wrong
today even where it still compiles.

## Known gaps

Everything below is absent from the pinned typings and docs. Answer these from upstream CodeMirror
documentation if you must, and label the answer as unpinned rather than as an Obsidian contract.

- **Source-mode coverage rules** — see the decision gate.
- **What is forbidden inside `ViewPlugin.update()`** beyond "can't impact the viewport"
  (docs: en/Plugins/Editor/View plugins.md:12). Dispatching from `update()`, reading layout, and
  touching other extensions' state are all undiscussed.
- **Annotations versus effects.** `Transaction.annotation`, `Annotation.define`, and `userEvent`
  appear in none of the nine editor pages; only effects are covered
  (docs: en/Plugins/Editor/State fields.md:14-26).
- **Incremental decoration mapping**, `atomicRanges`, widget `eq()`/`ignoreEvent()`/
  `estimatedHeight`, and any decoration budget or debounce guidance.
- **Pixel-coordinate APIs** — `coordsAtPos`, `posAtCoords`, `lineBlockAt` — and the distinction
  between `EditorView.viewport` and `visibleRanges`.
- **`origin` on `replaceRange`/`replaceSelection`/`transaction`** (api: obsidian.d.ts:2556): the
  parameter exists, its accepted values and effect on undo grouping are undocumented.
- **Caching rules for `EditorView`, view-plugin instances, or state fields** across leaf reuse, mode
  switches, and pop-out windows.
- **`EditorSuggest`** has no narrative page; its contracts are owned by the UI surfaces reference.
- No live Obsidian run was performed for this reference. Every behavioural claim is read from the
  pinned sources, and nothing here has been observed executing in the app.
