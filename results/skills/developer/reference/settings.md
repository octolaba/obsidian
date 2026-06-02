# Settings

How a plugin exposes configuration, persists it, and keeps it correct across two independent version
axes: the Obsidian version the user runs, and the plugin version that wrote the data on disk.

## Contents

- [Evidence boundary and availability](#evidence-boundary-and-availability)
- [Choosing an API](#choosing-an-api)
- [The persistence model](#the-persistence-model)
- [The imperative tab](#the-imperative-tab)
- [The declarative tab](#the-declarative-tab)
- [The `display()` bypass rule](#the-display-bypass-rule)
- [The three-tier refresh contract](#the-three-tier-refresh-contract)
- [What saves and what does not](#what-saves-and-what-does-not)
- [Keep `getSettingDefinitions()` cheap](#keep-getsettingdefinitions-cheap)
- [Custom storage: overriding the value accessors](#custom-storage-overriding-the-value-accessors)
- [`validate` is a UI gate, not a data invariant](#validate-is-a-ui-gate-not-a-data-invariant)
- [Migrating an existing tab](#migrating-an-existing-tab)
- [Settings copy rules](#settings-copy-rules)
- [Settings data across plugin versions](#settings-data-across-plugin-versions)
- [Conflicts, gaps, and open questions](#conflicts-gaps-and-open-questions)

## Evidence boundary and availability

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Declarations and JSDoc are **Contract**; the sample tab is an **Observed** template.

**The single most important fact on this page.** The declarative settings API —
`getSettingDefinitions()` and everything built on it — is `@since` **1.13.0** **Contract**
(api: obsidian.d.ts:5157; api: obsidian.d.ts:5159), and 1.13.0 is above the stable app at this pin,
1.12.7 (rel: desktop-releases.json:3). The docs say so in the page's own admonition: the API
"requires Obsidian 1.13.0, which is currently in an insider build" **Contract**
(docs: en/Plugins/User interface/Settings.md:7-8; docs: en/Plugins/Guides/Migrate to declarative settings.md:10-11).

So every declarative feature below is **insider-only at pin (>1.12.7)**. The imperative `display()`
path is **stable at pin (≤1.12.7)** and remains the default recommendation unless the user has
decided to ship `minAppVersion: "1.13.0"` and accept the consequence.

## Choosing an API

| Situation | Path | Why |
|---|---|---|
| New plugin, users on the stable channel | Imperative `display()` | The only path that runs on 1.12.7 |
| Plugin already shipping, `minAppVersion` < 1.13.0 | Dual support (Path B) if you want the new API at all | Keeps existing users working |
| You are prepared to require 1.13.0 | Declarative only (Path A) | Simplest code, smallest surface |
| Nothing about the new API helps you | Change nothing | "The new API is opt-in" **Contract** (docs: en/Plugins/Guides/Migrate to declarative settings.md:100) |

The upstream decision table keys entirely off `minAppVersion` **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:96-100) and prefers Path A "whenever you
can", with Path B reserved for "an existing user base on Obsidian < 1.13.0 that you can't drop"
**Contract** (docs: en/Plugins/Guides/Migrate to declarative settings.md:102).

**Recommendation:** at this pin, read that preference through the availability tier. Path A means
bumping `minAppVersion` to `"1.13.0"` **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:110), which shuts out every user on the
stable release — `minAppVersion` is a hard install gate, a fact owned by the
mobile-and-compatibility reference. Recommend imperative or Path B by default, and Path A only when
the user states that an insider-only audience is acceptable.

## The persistence model

This part is identical under both APIs and has been stable since 0.9.7.

- `loadData()` and `saveData(data)` are the primitives; "Data is stored in `data.json` in the plugin
  folder" **Contract** `@since 0.9.7`, stable at pin
  (api: obsidian.d.ts:5050-5056; api: obsidian.d.ts:5058-5064).
- The conventional shape is a `loadSettings()`/`saveSettings()` pair, with defaults merged
  underneath the stored object: `Object.assign({}, DEFAULT_SETTINGS, await this.loadData())`
  **Contract** (docs: en/Plugins/User interface/Settings.md:34). `DEFAULT_SETTINGS` is typed
  `Partial<T>` so only defaulted keys have to be listed **Contract**
  (docs: en/Plugins/User interface/Settings.md:20).
- `onload()` order is: `await this.loadSettings()` first, `this.addSettingTab(...)` second
  **Contract** (docs: en/Plugins/User interface/Settings.md:27-30). `addSettingTab` is
  `@since 0.9.7`, stable at pin (api: obsidian.d.ts:4969).
- The official template implements exactly this, with a widening cast on the loaded data
  **Observed** (sample: src/main.ts:91-97).
- `Plugin.settings` exists as a declared, untyped field — "Assign loaded data here in `onload`.
  Declare a concrete type on your subclass to type it" **Contract** `@since 1.13.0`, insider-only at
  pin (api: obsidian.d.ts:4914-4919). Assigning `this.settings` on your own subclass is what plugins
  have always done; the base-class declaration is what the 1.13 machinery reads.
- `onExternalSettingsChange()` fires when `data.json` "is modified on disk externally from
  Obsidian", typically by a Sync service **Contract** `@since 1.5.7`, stable at pin
  (api: obsidian.d.ts:5076-5085). Locally it only fires when the plugin `id` matches its folder name
  **Contract** (docs: en/Reference/Manifest.md:31).

## The imperative tab

Subclass `PluginSettingTab`, override `display()`, empty the container, build `Setting` rows
**Contract**
(docs: en/Plugins/User interface/Settings.md:853; docs: en/Plugins/User interface/Settings.md:867-870).
`containerEl.empty()` before rebuilding is part of the contract, not an optimisation — `display()`
runs again on every redraw.

The template's tab is the canonical minimal shape: constructor storing `plugin`, `display()` calling
`containerEl.empty()`, then one `new Setting(containerEl)` chain whose `onChange` mutates settings
and awaits `saveSettings()` **Observed** (sample: src/settings.ts:12-36).

This path is **not** deprecated at the plugin level. "The imperative API remains supported
indefinitely as a fallback on 1.13+, but the declarative API is preferred for new code" **Contract**
(docs: en/Plugins/User interface/Settings.md:851). Note the asymmetry with the typings, which mark
`SettingTab.display()` itself `@deprecated Since 1.13.0` (api: obsidian.d.ts:6654) — see
[Conflicts](#conflicts-gaps-and-open-questions).

Headings use `Setting.setHeading()`, `@since 0.9.16`, stable at pin (api: obsidian.d.ts:5780-5782),
never an HTML heading element — see [copy rules](#settings-copy-rules).

## The declarative tab

Override `getSettingDefinitions()` and return an array; "Obsidian handles rendering, search
indexing, persistence, and validation" **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:6). All of the following are
`@since 1.13.0`, **insider-only at pin**.

- A definition's `control.key` names a property on `this.plugin.settings`; Obsidian "reads the
  current value, writes changes back, and calls `saveData()` automatically. No `onChange` plumbing
  required" **Contract** (docs: en/Plugins/User interface/Settings.md:148). The typings say the same
  from the other side: `PluginSettingTab.getControlValue` "Reads from `this.plugin.settings`" and
  `setControlValue` "Mutates and persists `this.plugin.settings`" **Contract**
  (api: obsidian.d.ts:5161-5166; api: obsidian.d.ts:5168-5173).
- `control`, `render`, and `action` on one definition are mutually exclusive; TypeScript rejects
  more than one **Contract** (docs: en/Plugins/User interface/Settings.md:165). The typings enforce
  it structurally: the `SettingDefinition` union has four members and each excludes the others with
  `?: never` fields **Contract** (api: obsidian.d.ts:5933; api: obsidian.d.ts:5958-5963).
- The item union is `SettingDefinitionItem` — a plain definition, a group, a list, or a page
  **Contract** (api: obsidian.d.ts:6148).
- Every definition may carry `aliases` ("Additional search terms") and `searchable` **Contract**
  (api: obsidian.d.ts:6006-6010; api: obsidian.d.ts:6016). Rows hidden by `visible: false` are also
  "excluded from global settings search for that render" **Contract**
  (docs: en/Plugins/User interface/Settings.md:313).
- Validation failures render inline: `Setting.errorEl` and `Setting.setErrorMessage()` back that,
  adding `is-invalid` to the row **Contract**
  (api: obsidian.d.ts:5726-5731; api: obsidian.d.ts:5738-5744).

Secrets are not a settings-storage question; the storage chooser in the decision guides and the
vault-and-metadata reference own that decision.

## The `display()` bypass rule

**Contract, and the single behaviour that breaks migrations most often:** on 1.13.0+, `display()` is
"Not called when `getSettingDefinitions` returns a non-empty array" (api: obsidian.d.ts:6649-6657).
The docs restate it twice, including the corollary that calling `this.display()` yourself will not
refresh anything declarative
(docs: en/Plugins/User interface/Settings.md:743; docs: en/Plugins/Guides/Migrate to declarative settings.md:274).

Consequences to check in review:

1. A dual-support tab is **not** running both paths on 1.13.0+. Only `getSettingDefinitions()` runs
   (docs: en/Plugins/Guides/Migrate to declarative settings.md:178-179).
2. A `getSettingDefinitions()` that returns an **empty** array falls back to `display()`. That is
   the documented switch, so a conditional early `return []` is a working feature flag
   (**Inference** from the non-empty-array wording above).
3. Any imperative work that used to sit at the top of `display()` — event wiring, lazy loading —
   silently stops running. Move listener wiring into the tab constructor (see below).

## The three-tier refresh contract

Three different refresh calls, three different costs. Choosing wrongly is either a no-op or a full
rebuild.

| Call | Use when | Cost |
|---|---|---|
| `refreshDomState()` | predicate inputs changed; the **set** of rows did not | "Cheap: toggles CSS state in place, no re-render" **Contract** (api: obsidian.d.ts:6632-6644) |
| `update()` | rows were added or removed | Re-runs `getSettingDefinitions()` and re-indexes for search **Contract** (api: obsidian.d.ts:6601-6607) |
| `display()` | pre-1.13 fallback only | Bypassed entirely when definitions are non-empty — see above |

`visible` and `disabled` accept a boolean or `() => boolean`; the function form "is re-evaluated on
every DOM-state refresh", and `control` changes trigger that refresh automatically, so simple
one-setting-hides-another cases need no explicit call **Contract**
(docs: en/Plugins/User interface/Settings.md:313-316). After mutating dependent state from a
`render` callback or any other imperative path, call `refreshDomState()`; for structural changes
call `update()` **Contract**
(docs: en/Plugins/User interface/Settings.md:316; docs: en/Plugins/User interface/Settings.md:349).

**External state.** When the tab depends on something it does not own — vault contents, other
plugins, background computation — wire listeners in the **settings-tab constructor**, register them
through `plugin.registerEvent()`, and call a debounced `update()`; the documented shape is
`debounce(() => this.update(), 200, true)` **Contract**
(docs: en/Plugins/User interface/Settings.md:466-470; docs: en/Plugins/User interface/Settings.md:482).
`update()` "is safe to call when the settings modal is closed" **Contract**
(docs: en/Plugins/User interface/Settings.md:490). Do not reach for external events to hide a row
based on another setting — that is what `visible` is for.

## What saves and what does not

- **`control` bindings auto-save.** Obsidian calls `saveData()` for you
  (docs: en/Plugins/User interface/Settings.md:148).
- **`render` callbacks never auto-save.** "Obsidian only saves automatically for `control` bindings.
  Inside a `render` callback, always `await this.plugin.saveData(this.plugin.settings)` after
  mutating settings" **Contract** (docs: en/Plugins/User interface/Settings.md:740-741), repeated as
  a pitfall and again in the FAQ
  (docs: en/Plugins/Guides/Migrate to declarative settings.md:271; docs: en/Plugins/Guides/Migrate to declarative settings.md:294).
- **A `render` callback may return a cleanup function**, invoked before the row is torn down on
  re-render, page navigation, tab switch, or modal close **Contract**
  (docs: en/Plugins/User interface/Settings.md:747). Plain DOM listeners inside the row need no
  cleanup; they go with the DOM (docs: en/Plugins/User interface/Settings.md:763).
- **Cleanup is not guaranteed.** Neither the `render` cleanup function nor `SettingPage.hide()` runs
  if the host window is destroyed abnormally **Contract**
  (docs: en/Plugins/User interface/Settings.md:766; docs: en/Plugins/User interface/Settings.md:699).
  Anything that *must* be released belongs on the plugin.

## Keep `getSettingDefinitions()` cheap

**Contract, and a performance rule with a non-obvious second trigger:** the method "is called every
time the tab updates AND once when the tab is registered (to index settings for global search).
Don't perform file reads, network calls, or expensive computation here"
(docs: en/Plugins/User interface/Settings.md:167-168), restated as "Keep it cheap: no I/O, no
network calls" (docs: en/Plugins/Guides/Migrate to declarative settings.md:270). The typings agree:
it is "Called on every display() and once when the tab is added to the setting modal for search
indexing" (api: obsidian.d.ts:6593-6600).

The registration call is what surprises people: it happens at `addSettingTab()` time, inside
`onload`, on the app's startup critical path — whether or not the user ever opens your settings.
Heavy work there is a startup cost, not a settings cost. Move it into a `render` callback, "which
run only when the row is drawn" (docs: en/Plugins/User interface/Settings.md:168). Startup economics
are owned by the performance reference.

## Custom storage: overriding the value accessors

Override `getControlValue(key)` and `setControlValue(key, value)` when settings do not live on
`this.plugin.settings` — a Svelte store, a reactive proxy, an immutable update mechanism
**Contract** (docs: en/Plugins/User interface/Settings.md:358; api: obsidian.d.ts:5161-5173), all
`@since 1.13.0`, insider-only at pin.

**The trap:** "Overriding `setControlValue` replaces the default write path, including the automatic
`saveData()` call. Persist the value yourself, and return the promise (or make the method `async`)
so Obsidian can await the write before re-rendering" **Contract**
(docs: en/Plugins/User interface/Settings.md:377). A tab that overrides the setter and forgets to
persist looks correct until the next reload, when every change is gone.

Two further rules from the same section:

- Out of the box, `control` keys reach **top-level properties only**; flat JSON is the
  recommendation for new plugins **Contract** (docs: en/Plugins/User interface/Settings.md:384).
  Dot-notation keys are an opt-in recipe built from the same two overrides, and the path walker must
  create intermediate objects so a partial stored JSON does not crash **Contract**
  (docs: en/Plugins/User interface/Settings.md:386; docs: en/Plugins/User interface/Settings.md:462).
- `visible` and `disabled` predicates read the settings object **directly** and do not go through
  `getControlValue` **Contract** (docs: en/Plugins/User interface/Settings.md:462). With custom
  storage, the two can disagree — a real defect class to look for in review.

## `validate` is a UI gate, not a data invariant

`validate` returns a non-empty string to reject and surface an inline error; `void`, `undefined`, or
an empty string accepts and persists; async validators may return a promise **Contract**
(api: obsidian.d.ts:5899-5917; docs: en/Plugins/User interface/Settings.md:286).

But: "The stored value may already be invalid when the setting is rendered … The framework runs
`validate` once on mount and shows the message if the seeded value fails; it does not modify or
replace the stored value" **Contract** (api: obsidian.d.ts:5908-5917), with the same wording in
prose and an explicit instruction to "validate again when reading your settings"
(docs: en/Plugins/User interface/Settings.md:302-303; docs: en/Plugins/Guides/Migrate to declarative settings.md:276).

**Recommendation:** treat `validate` as presentation. Put the real invariant in `loadSettings()`,
where you can repair or discard a bad value before anything renders — the FAQ names exactly that
placement (docs: en/Plugins/Guides/Migrate to declarative settings.md:298).

## Migrating an existing tab

**Path A — 1.13-only.** Bump `minAppVersion` to `"1.13.0"`; add `getSettingDefinitions()`; write
`{ name, desc, control: { type, key } }` per one-key binding; move value-shape validation out of a
hand-rolled `onChange` into `validate`; delete `display()` and the now-unused `Setting` import
**Contract** (docs: en/Plugins/Guides/Migrate to declarative settings.md:110-114).

**Path B — dual support.** Keep `display()` and add `getSettingDefinitions()` beside it. On 1.13.0+
the declarative method runs and `display()` is skipped; below 1.13.0 `display()` runs unchanged
**Contract** (docs: en/Plugins/Guides/Migrate to declarative settings.md:178-179). The maintenance
cost is stated explicitly: "Every time you add or change a setting, update both … Drift between the
two means users on different Obsidian versions see different settings" **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:252-253). Delete `display()` and bump
`minAppVersion` once the old user base is small enough
(docs: en/Plugins/Guides/Migrate to declarative settings.md:250).

**Documented pitfalls worth re-reading before you review a migration** **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:269-276): mutual exclusion of
`control`/`render`/`action`; no I/O in `getSettingDefinitions()`; `desc` accepts a
`DocumentFragment` built with `createFragment(...)`; `render` does not auto-save; an `action`
callback must use the `index` argument it receives rather than one captured in the outer `map`,
because a captured position goes stale after a reorder or delete; `update()` not `display()`; page
names must be unique among siblings at one depth; `validate` does not replace stored values.

**Post-migration verification**, as documented **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:280-288): build; walk the tab top to
bottom and confirm every value persists across a reload; find every setting in global settings
search by name and `aliases`; enter invalid input for each `validate` and confirm the inline error
appears and nothing saves; exercise add, delete, and reorder on every `type: 'list'`; open and back
out of every sub-page; and for Path B, install on an Obsidian below 1.13.0 and confirm `display()`
still renders.

**Unverified:** none of that checklist was executed here — no live Obsidian run backs this page.

## Settings copy rules

These are review-grade rules with a normative home in the plugin guidelines, echoed by the settings
style guide and the October self-critique checklist. All apply to the imperative and declarative
paths alike.

| Rule | Evidence |
|---|---|
| Sentence case for every UI string — names, descriptions, headings, buttons, placeholders | **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:62-64; docs: en/Plugins/User interface/Settings.md:770-772; docs: en/Obsidian October plugin self-critique checklist.md:74) |
| No top-level "General", "Settings", or plugin-name heading — the sidebar tab already names the plugin | **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:47-49; docs: en/Plugins/User interface/Settings.md:779) |
| Headings only with two or more sections; leave the general section at the top unheaded | **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:51; docs: en/Plugins/User interface/Settings.md:796-798) |
| Never repeat "settings" in a heading — "Advanced", not "Advanced settings" | **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:55-57; docs: en/Plugins/User interface/Settings.md:812-814) |
| Use `setHeading()`, never `<h1>`/`<h2>` — HTML headings give inconsistent styling across plugins | **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:69-74; docs: en/Obsidian October plugin self-critique checklist.md:75) |
| Save on change, never on submit — "The user navigating away should never be a save action" | **Contract** (docs: en/Plugins/User interface/Settings.md:821) |
| Multi-field or cross-validated input belongs in a modal — "Settings tabs and sub-pages aren't designed to act as forms" | **Contract** (docs: en/Plugins/User interface/Settings.md:823) |
| One mutable control per row; several stack vertically on mobile and break readability | **Contract** (docs: en/Plugins/User interface/Settings.md:825-832) |
| Avoid `textarea` in the main tab; if unavoidable, push it to the bottom | **Contract** (docs: en/Plugins/User interface/Settings.md:834-836) |
| `desc` is one sentence — warnings go to a modal with a confirm step, background context to a link | **Contract** (docs: en/Plugins/User interface/Settings.md:838-842) |

The declarative API is for `PluginSettingTab` only. Setting rows **inside a modal** are built
imperatively against the modal's `contentEl` **Contract**
(docs: en/Plugins/User interface/Settings.md:846); the modal itself belongs to the UI-surfaces
reference.

## Settings data across plugin versions

Everything above concerns the *Obsidian* version axis. The *plugin* version axis is barely
documented, and the difference matters: a user can install your new build on top of a `data.json`
written by any earlier release of your plugin, or by a Sync client mid-session.

What is documented:

1. **Defaults merge underneath stored data.**
   `Object.assign({}, DEFAULT_SETTINGS, await this.loadData())` means a key added in a new plugin
   version appears with its default, and a key you removed silently survives in the file
   **Contract** (docs: en/Plugins/User interface/Settings.md:34). The merge is shallow — a nested
   object in stored data replaces the whole default subtree wholesale (**Inference** from
   `Object.assign` semantics; nothing in the pinned sources discusses nesting depth here).
2. **Re-validate on read.** The only officially sanctioned repair point for stale or invalid stored
   values is your own settings read **Contract**
   (docs: en/Plugins/Guides/Migrate to declarative settings.md:298).
3. **External rewrites happen.** `onExternalSettingsChange()` is the hook for `data.json` being
   rewritten under a running plugin **Contract** (api: obsidian.d.ts:5076-5085); it is optional, so
   nothing calls it unless you declare it, and locally it needs the `id`/folder-name match
   (docs: en/Reference/Manifest.md:31).

What is **not** documented anywhere in the pinned sources: a settings schema version, a migration
hook, an ordering guarantee between `onExternalSettingsChange` and an in-flight `saveData`, or any
guidance on removing obsolete keys. Searching the developer docs for settings-versioning or
data-migration guidance returns nothing — **Gap**.

**Recommendation (Inference, not upstream guidance).** Carry an explicit integer or string version
field in your own settings object and run ordered, idempotent migrations inside `loadSettings()`
before the tab can render. Concretely: read raw data; if the version is absent, treat it as your
first shipped shape; apply each migration step in order; merge defaults; re-validate; and write back
only if something changed, so a read-only launch does not rewrite `data.json`. Label this as your
own convention when you recommend it — upstream neither prescribes nor blesses it.

Two adjacent constraints that make the versioning problem sharper, both owned elsewhere: plugins
never auto-update for users, so old plugin versions persist indefinitely (distribution chooser,
decision guides); and `minAppVersion` gates installs outright (mobile-and-compatibility reference).

## Conflicts, gaps, and open questions

- **Declarative persistence: two readings, and the corrected one.** The base `SettingTab` JSDoc says
  the default `getControlValue`/`setControlValue` implementation reads and writes
  `this.app.vault.getConfig`/`setConfig` (api: obsidian.d.ts:6612; api: obsidian.d.ts:6625) — yet
  `Vault` declares neither method anywhere in its class body (api: obsidian.d.ts:7337-7594). The
  **Contract** for plugin authors is the `PluginSettingTab` override, which reads and mutates
  `this.plugin.settings` and persists it (api: obsidian.d.ts:5161-5173), matching the prose that
  Obsidian "calls `saveData()` automatically" (docs: en/Plugins/User interface/Settings.md:148).
  **Inference:** the untyped `getConfig`/`setConfig` path affects only code that subclasses
  `SettingTab` directly — that is, the app's own tabs — and never a plugin extending
  `PluginSettingTab`. Do not report this as a plugin-facing defect.
- **`display()` deprecated in typings, supported in prose.** The typings mark it
  `@deprecated Since 1.13.0` (api: obsidian.d.ts:6654), while the docs state the imperative API
  "remains supported indefinitely as a fallback" (docs: en/Plugins/User interface/Settings.md:851).
  **Recommendation:** treat the deprecation as directional, not as a removal notice; on a plugin
  whose `minAppVersion` is below 1.13.0, `display()` is the required path and flagging it as
  deprecated code is wrong.
- **`aliases` documented in the checklist before it is defined.** The migration guide's verification
  step tells you to search by `aliases`
  (docs: en/Plugins/Guides/Migrate to declarative settings.md:284) and the settings page never
  defines the field; only the typings do (api: obsidian.d.ts:6006-6010). Harmless, but it means the
  narrative alone is not a complete reference for the definition shape.
- **Settings-data versioning: no official guidance** — see the section above.
- **Nothing here was executed.** Persistence, search indexing, the refresh tiers, and the migration
  checklist are read from declarations and documentation at this pin, not observed in a running app
  — **Unverified** as behaviour.
