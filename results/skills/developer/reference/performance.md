# Performance

Two budgets, measured differently. **Startup** is shared: every plugin's load time is app load time,
and the user pays for all of them at once. **Runtime** is yours alone, but the expensive calls are
concentrated in a handful of documented places. This file owns both, plus what upstream gives you to
measure them.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Startup: the shared budget](#startup-the-shared-budget)
- [Ship a production build](#ship-a-production-build)
- [What belongs in `onload`](#what-belongs-in-onload)
- [View constructors and deferred views](#view-constructors-and-deferred-views)
- [The `vault.on('create')` storm](#the-vaultoncreate-storm)
- [Runtime: the documented hot paths](#runtime-the-documented-hot-paths)
- [Reads: `read` versus `cachedRead`](#reads-read-versus-cachedread)
- [Debouncing](#debouncing)
- [Measurement](#measurement)
- [Known gaps](#known-gaps)

## Evidence boundary

Every rule here is a documented sentence or a declared JSDoc warning. **Nothing was benchmarked** —
no timing run, no profile, no comparison. Where upstream says "expensive" without a number, this file
says so too rather than inventing one. Optimisations not named upstream are marked **Inference**.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Every API named states its `@since` and its tier at this pin: **stable** at or below 1.12.7,
**insider-only** above it.

## Startup: the shared budget

The framing sentence: "Plugins play an important role in app load time. To ensure that Obsidian
behaves correctly, Obsidian loads **all plugins before the user can interact with the app**"
**Contract** (docs: en/Plugins/Guides/Optimize plugin load time.md:6).

That is the whole reason startup discipline is not optional. Your `onload` sits on the critical path
of somebody else's cold start, alongside twenty other plugins.

Upstream gives three levers, in this order **Contract**
(docs: en/Plugins/Guides/Optimize plugin load time.md:12-14):

1. Simplify `onload`.
2. Check the custom `View` constructor.
3. Avoid the documented pitfalls.

## Ship a production build

"Make sure that you are using a production build of your plugin … When you create a release, ensure
that the `main.js` file is a production build" **Contract**
(docs: en/Plugins/Guides/Optimize plugin load time.md:16), and "you should consider minifying your
plugin code. This will make the overall plugin file size smaller and therefore faster for plugin to
read from disk and load" **Contract** (docs: en/Plugins/Guides/Optimize plugin load time.md:18).

The official template already wires this to one flag: `minify: prod` and
`sourcemap: prod ? false : 'inline'` **Observed** (sample: esbuild.config.mjs:38;
sample: esbuild.config.mjs:41), selected by `process.argv[2] === 'production'`. Build-config detail
belongs to the project-setup reference; the performance rule is simply *release the production
artifact, not the watch artifact*.

An inline source map in a shipped `main.js` is dead weight on every cold start — it is read from disk
with the code (**Inference** from the disk-read rationale above).

## What belongs in `onload`

The contract is a whitelist, not a guideline: `onload` "should only include code necessary for the
plugin to initialize. This includes app registrations, like registering commands, view types, and
Markdown post-processors. **It should not include anything computationally expensive or data
fetching**" **Contract** (docs: en/Plugins/Guides/Optimize plugin load time.md:20).

Startup work that is genuinely needed goes one layer later: "For most cases, you will want to wrap
your code inside a `onLayoutReady` callback. These callbacks are deferred and are only called after
Obsidian finishes loading" **Contract** (docs: en/Plugins/Guides/Optimize plugin load time.md:26).
`Workspace.onLayoutReady` is `@since 0.11.0`, **stable at pin** (api: obsidian.d.ts:7832-7838).

Practical split (**Recommendation**):

| Runs in `onload` | Runs in `onLayoutReady` | Runs on first use |
|---|---|---|
| `addCommand`, `registerView`, `registerMarkdownPostProcessor`, `addSettingTab`, `registerEditorExtension` | Index building, vault scans, workspace inspection, `vault.on('create')` registration | Network calls, large parses, opening your view |

Reading settings is the one unavoidable `await` in `onload`, because the settings tab needs them —
that ordering is owned by the settings reference.

## View constructors and deferred views

"If your plugin creates any custom views, be mindful of your custom view constructor. When Obsidian
opens, it will reopen all the views saved to the user's workspace. If your view is loaded (and **not
deferred**), this will directly impact the app load time" **Contract**
(docs: en/Plugins/Guides/Optimize plugin load time.md:22).

Since Obsidian 1.7.2, "when Obsidian loads, all views are created as instances of **DeferredView**"
and the real view is swapped in once its tab becomes visible **Contract**
(docs: en/Plugins/Guides/Defer views.md:6). `WorkspaceLeaf.isDeferred` and
`WorkspaceLeaf.loadIfDeferred()` are both `@since 1.7.2`, **stable at pin**
(api: obsidian.d.ts:8288-8301).

**The economics.** Deferral is the single largest startup win the platform hands you for free, and
`loadIfDeferred` spends it: "Manually calling `loadIfDeferred`, your plugin is removing this
performance optimization from the given views. **Use this *sparingly***" **Contract**
(docs: en/Plugins/Guides/Defer views.md:84-85). Every call converts a lazy view into an eager one for
that user's session.

**Recommendation**, cheapest first:

1. Do nothing — let the view stay deferred and act when it opens.
2. `await workspace.revealLeaf(leaf)` when the user asked for the view; it makes the view visible and
   loaded, `@since 1.7.2`, **stable at pin** (docs: en/Plugins/Guides/Defer views.md:59;
   api: obsidian.d.ts:8039-8045).
3. `await leaf.loadIfDeferred()`, guarded by `requireApiVersion('1.7.2')`, only when you must touch a
   view you are deliberately not revealing (docs: en/Plugins/Guides/Defer views.md:77-78).

Keeping the constructor cheap matters even with deferral, because a user whose saved workspace has
your view open at startup pays for it immediately — **Inference**, from the constructor warning
(docs: en/Plugins/Guides/Optimize plugin load time.md:22). Correctness rules for deferred views —
`instanceof` before use — belong to the workspace-views-and-state reference.

## The `vault.on('create')` storm

The named pitfall: "As a part of Obsidian's vault initialization process, it will call `create` **for
every file**" **Contract** (docs: en/Plugins/Guides/Optimize plugin load time.md:32). The typings say
the same at the declaration: "This is also called when the vault is first loaded for each existing
file. If you do not wish to receive create events on vault load, register your event handler inside
`Workspace.onLayoutReady`" **Contract** (api: obsidian.d.ts:7567-7574).

Two documented remedies **Contract** (docs: en/Plugins/Guides/Optimize plugin load time.md:34;
docs: en/Plugins/Guides/Optimize plugin load time.md:53):

- **Option A** — early-return in the handler while `!this.app.workspace.layoutReady`.
- **Option B** — register the handler inside `onLayoutReady`. Prefer this: it never runs the handler
  at all during initialisation (**Recommendation**).

Both code samples on that page are malformed TypeScript — they declare `onload(app: App)` and call
`super(app)`, neither of which is valid for a `Plugin` subclass **Observed**
(docs: en/Plugins/Guides/Optimize plugin load time.md:38;
docs: en/Plugins/Guides/Optimize plugin load time.md:57). Copy the *shape*, not the code.

## Runtime: the documented hot paths

| Surface | The warning | Evidence |
|---|---|---|
| `Workspace.updateOptions()` | "update/reconfigure the options of all Markdown views. It is fairly expensive, so it should not be called frequently"; `@since 0.13.21`, **stable at pin** | (api: obsidian.d.ts:8053-8059) |
| `EditorSuggest.onTrigger` | "Please be mindful of performance when implementing this function, as it will be triggered **very often (on each keypress)**. Keep it simple, and return null as early as possible"; `@since 1.1.13`, **stable at pin** | (api: obsidian.d.ts:2714-2724) |
| `EditorSuggest.getSuggestions` | "Can be async, but **preferably sync**"; `@since 0.12.17`, **stable at pin** | (api: obsidian.d.ts:2725-2731) |
| Bases views | "An unfiltered Base will provide an entry for **every file in the vault**, so your view should be able to handle thousands of entries, **reuse DOM elements**, and avoid rendering off screen where appropriate" | (docs: en/Plugins/Guides/Build a Bases view.md:123) |
| `BasesView.data` | "This object will be replaced with a new result set when changes to the vault or Bases config occur, so views should **not keep a reference to it**"; `@since 1.10.0`, **stable at pin** | (api: obsidian.d.ts:1130-1137) |
| `prepareFuzzySearch` | "Performance may be an issue if you are running the search for more than a few thousand times. If performance is a problem, consider using `prepareSimpleSearch` instead" | (api: obsidian.d.ts:5244-5252) |

**`updateOptions` is the one people call in a loop.** It is the documented way to apply a change to a
mutated CodeMirror extension array; that reconfiguration contract, and the array-identity trap that
comes with it, are owned by the editor-extensions reference. The cost rule is the part that lives
here: batch your mutations and call it **once** — never per setting change, per keystroke, or per
file (**Recommendation** from the "not frequently" clause above).

**Decoration gates** are the editor-side equivalent: recompute only when the document or the viewport
actually changed, and only over visible ranges. The mechanism, the `docChanged || viewportChanged`
gate, and `visibleRanges` are owned by the editor-extensions reference; the performance rule is that
an ungated decoration rebuild runs on every editor update.

**Bases views** are the only surface where upstream states an explicit scale target — thousands of
entries — and the guide's own `containerEl.empty()`-and-rebuild sample is flagged as a simplification
**Observed** (docs: en/Plugins/Guides/Build a Bases view.md:139). Do not ship the sample's render
strategy.

## Reads: `read` versus `cachedRead`

Not a micro-optimisation — a documented pair with a correctness half:

- `Vault.read` — "directly from disk. Use this if you intend to modify the file content afterwards.
  Use `Vault.cachedRead` otherwise **for better performance**"; `@since 0.9.7`, **stable at pin**
  (api: obsidian.d.ts:7421-7428).
- `Vault.cachedRead` — "Use this if you only want to display the content to the user. If you want to
  modify the file content afterward use `Vault.read`"; `@since 0.9.7`, **stable at pin**
  (api: obsidian.d.ts:7429-7436).

Display paths, previews, and indexing should use `cachedRead`; anything that writes back must not.
The read-modify-write contract itself — and why `Vault.process` beats both — is owned by the
vault-and-metadata reference.

## Debouncing

`debounce(cb, timeout?, resetTimer?)` — "Use this to have a time-delayed function only be called once
in a given timeframe"; no `@since` tag in the typings, **availability unknown**
(api: obsidian.d.ts:2213-2232). The returned `Debouncer` adds `cancel()` (api: obsidian.d.ts:2238-2242)
and `run()` — "If there is any pending function call, clear the timer and call the function
immediately", `@since 1.4.4`, **stable at pin** (api: obsidian.d.ts:2243-2248).

Use it for anything driven by typing, resizing, or vault churn. Two documented consumers show the
intended shape: `Workspace.requestSaveLayout` is itself declared as a `Debouncer`, `@since 0.16.0`
(api: obsidian.d.ts:7818-7823), and `TextFileView.requestSave` is "Debounced save in 2 seconds from
now", `@since 0.10.12` (api: obsidian.d.ts:7070-7075) — the platform debounces its own writes.

**Recommendation:** call `cancel()` from your teardown path so a pending callback cannot fire after
unload; the typings do not do this for you.

## Measurement

Four instruments exist at this pin. None of them produces a threshold — they produce numbers you
compare against your own baseline.

1. **The startup stopwatch.** "You can test the startup time of Obsidian by going to
   **Settings → General → Advanced** and select the stopwatch icon to debug startup time. This view
   indicates how long it takes for the app to launch" **Contract**
   (docs: en/Plugins/Guides/Optimize plugin load time.md:8). This is the *only* named startup
   measurement instrument in the pinned material. Measure with your plugin enabled and disabled.
2. **DevTools.** "Toggle the Developer Tools by pressing Ctrl+Shift+I in Windows and Linux, or
   Cmd-Option-I on macOS" then the Console tab **Contract**
   (docs: en/Plugins/Getting started/Anatomy of a plugin.md:26-27). The Performance and Memory panels
   are standard Chromium tooling; nothing in the pinned sources documents their use for Obsidian
   specifically (**Gap**).
3. **CLI error and console buffers.** `dev:errors` "Show captured JavaScript errors" (with `clear`)
   **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1359-1365) and `dev:console` "Show
   captured console messages" with `limit=<n>` and `level=` filters **Contract**
   (help: en/Extending Obsidian/Obsidian CLI.md:1375-1384). These make a timing harness scriptable —
   log timestamps from your plugin, read them back without touching the GUI. The CLI's installer and
   registration gates are in the debugging reference.
4. **Your own timing.** Nothing prevents wrapping `onload` in `performance.now()` and logging the
   delta; that is **Inference**, not an upstream recommendation.

**No numeric threshold is documented anywhere in the pinned sources** — not for `onload` duration,
not for `main.js` size, not for entry counts in a Bases view beyond "thousands", not for decoration
rebuild cost. Any number you have seen quoted is not from this material. State that when asked, and
compare against a measured baseline instead. **Gap:** the stopwatch is the sole instrument named by
the load-time guide (docs: en/Plugins/Guides/Optimize plugin load time.md:8), and it reports app
launch time, not a per-plugin budget.

## Known gaps

- **No benchmarks.** Nothing in this file was timed. Every "expensive" is upstream's word, not a
  measurement.
- **No thresholds** — see above. This is the single most requested number and it does not exist in
  the pinned material.
- **Bundle size** has no documented budget; only the qualitative "smaller … loads faster"
  (docs: en/Plugins/Guides/Optimize plugin load time.md:18).
- **Memory** is never discussed in any pinned source — no leak guidance, no retention budget. The
  closest thing is the `Component` teardown contract, owned by the lifecycle-and-registration
  reference.
- **Profiling workflow.** No pinned source describes profiling an Obsidian plugin with DevTools; the
  console is the only inspection technique documented
  (docs: en/Plugins/Getting started/Anatomy of a plugin.md:22).
- **Framework overhead.** The React and Svelte guides never connect to the load-time guide, so the
  startup cost of a framework in a plugin is unquantified here.
