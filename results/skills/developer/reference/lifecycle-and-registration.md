# Lifecycle and registration

What a plugin *is* at runtime: the object graph it is handed, the two hooks it owns, the component
that cleans up after it, and the exact contract of every registration method — including the one
resource Obsidian will not clean up for you.

## Contents

- [Evidence boundary and availability discipline](#evidence-boundary-and-availability-discipline)
- [The App object graph](#the-app-object-graph)
- [Plugin lifecycle](#plugin-lifecycle)
- [Component, the teardown machine](#component-the-teardown-machine)
- [The registration table](#the-registration-table)
- [The one hole: leaves](#the-one-hole-leaves)
- [Commands](#commands)
- [Protocol handlers](#protocol-handlers)
- [File extensions](#file-extensions)
- [CLI handlers](#cli-handlers)
- [The events model](#the-events-model)
- [Plugin interop: the negative contract](#plugin-interop-the-negative-contract)
- [Known gaps](#known-gaps)

## Evidence boundary and availability discipline

The typings are the authority here: almost every member carries an `@since` tag, and that tag — not
the changelog — is the feature-to-`minAppVersion` map. Narrative documentation is used where it adds
rationale the typings omit; the two sample templates are **Observed**, never rules.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Where a table lists an `@since`, the citation points at the declaration and the tag sits in
the JSDoc block directly above it.

Two version tools ship in the API:

- `apiVersion` is "the API version of the app, which follows the release cycle of the desktop app"
  **Contract** (api: obsidian.d.ts:396-400) — carries no `@since` tag; availability unknown.
- `requireApiVersion(version)` "Returns true if the API version is equal or higher than the requested
  version. Use this to limit functionality that require specific API versions to avoid crashing on
  older Obsidian builds" **Contract** (api: obsidian.d.ts:5489-5494); availability unknown.

**Recommendation.** When `requireApiVersion` is independently known to exist at your target floor,
use it to guard an optional API whose `@since` is newer; otherwise raise `minAppVersion` or choose a
dated fallback. State both numbers when you recommend an API. Every table below carries
`@since` plus its tier at this pin — *stable* at or below 1.12.7, *insider-only* above it. A few
members carry no version tag at all; those are written **untagged, availability unknown**. Their
declaration proves presence in the 1.13.2 typings, not compatibility with 1.12.7. Establish a lower
floor from another pinned official source or runtime verification before recommending one there;
this applies to `requireApiVersion` itself as well as to the API it guards. The deferred-view guide
establishes its intended `1.7.2` guard scenario, but not an arbitrary earlier floor
(docs: en/Plugins/Guides/Defer views.md:77-78).

## The App object graph

`App` is the root object; a plugin reaches it as `this.app` **Contract**
(api: obsidian.d.ts:406; api: obsidian.d.ts:4907), and every view, modal, suggest popover, and
settings tab carries its own reference to the same object.

| Property | Type | `@since` | Tier | Owned by |
|---|---|---|---|---|
| `keymap` (api: obsidian.d.ts:412) | `Keymap` | 0.9.7 | stable | this file |
| `scope` (api: obsidian.d.ts:417) | `Scope` | 0.9.7 | stable | workspace, views, and state |
| `workspace` (api: obsidian.d.ts:423) | `Workspace` | 0.9.7 | stable | workspace, views, and state |
| `vault` (api: obsidian.d.ts:429) | `Vault` | 0.9.7 | stable | vault and metadata |
| `metadataCache` (api: obsidian.d.ts:434) | `MetadataCache` | 0.9.7 | stable | vault and metadata |
| `fileManager` (api: obsidian.d.ts:440) | `FileManager` | 0.11.0 | stable | vault and metadata |
| `lastEvent` (api: obsidian.d.ts:447) | `UserEvent \| null` | 0.12.17 | stable | this file |
| `renderContext` (api: obsidian.d.ts:453) | `RenderContext` | 1.10.0 | stable | UI surfaces |
| `secretStorage` (api: obsidian.d.ts:458) | `SecretStorage` | 1.11.4 | stable | vault and metadata |

Two App-level methods matter outside their own topic: `isDarkMode()` @1.10.0, stable
(api: obsidian.d.ts:464), and the vault-scoped `loadLocalStorage`/`saveLocalStorage` pair @1.8.7,
stable (api: obsidian.d.ts:472; api: obsidian.d.ts:480), whose semantics belong to the vault and
metadata reference.

`lastEvent` is "The last known user interaction event, to help commands find out what modifier keys
are pressed" **Contract** (api: obsidian.d.ts:443-447). That is the sanctioned way for a plain
`callback` command — which receives no event argument — to learn about modifier keys.

## Plugin lifecycle

`Plugin` extends `Component` **Contract** (api: obsidian.d.ts:4901), and "defines the lifecycle of a
plugin" **Contract** (docs: en/Plugins/Getting started/Anatomy of a plugin.md:1). Four hooks exist.

| Hook | Signature | When | `@since` | Tier |
|---|---|---|---|---|
| `onload` (api: obsidian.d.ts:4929) | `Promise<void> \| void` | plugin starts being used (docs: en/Plugins/Getting started/Anatomy of a plugin.md:18) | 0.9.7 | stable |
| `onunload` (api: obsidian.d.ts:1862) | `void` — inherited, **not** redeclared on `Plugin` | plugin is disabled (docs: en/Plugins/Getting started/Anatomy of a plugin.md:20) | 0.9.7 | stable |
| `onUserEnable` (api: obsidian.d.ts:5073) | `void` | user explicitly enabled the plugin | 1.7.2 | stable |
| `onExternalSettingsChange` (api: obsidian.d.ts:5085) | optional, `any` | `data.json` changed on disk from outside | 1.5.7 | stable |

**The synchronous-unload trap.** `onunload` is declared once in the whole typings file, on
`Component`, returning `void` (api: obsidian.d.ts:1856-1862). `Plugin` widens `onload` to
`Promise<void> | void` but leaves `onunload` alone (api: obsidian.d.ts:4929). Meanwhile the
documentation's canonical shape writes `async onunload()`
(docs: en/Plugins/Getting started/Anatomy of a plugin.md:10) — and the official template writes the
synchronous form, `onunload() {}` **Observed** (sample: src/main.ts:89). **Inference:** `async
onunload` type-checks because a `Promise` is assignable to `void`, but nothing awaits it, so any
cleanup after the first `await` may never run before the plugin is torn down. **Recommendation:**
keep `onunload` synchronous; if you must do async work, start it and do not rely on its completion.

**What belongs in `onload`.** Registrations only. "The `onload` function should only include code
necessary for the plugin to initialize. This includes app registrations, like registering commands,
view types, and Markdown post-processors. It should not include anything computationally expensive or
data fetching" **Contract** (docs: en/Plugins/Guides/Optimize plugin load time.md:20), because
"Obsidian loads all plugins before the user can interact with the app" **Contract**
(docs: en/Plugins/Guides/Optimize plugin load time.md:6). Startup work goes inside
`Workspace.onLayoutReady`, which "Runs the callback function right away if layout is already ready,
or push it to a queue to be called later" @0.11.0, stable **Contract**
(api: obsidian.d.ts:7833-7838; docs: en/Plugins/Guides/Optimize plugin load time.md:26). The cost
model and the measurement loop belong to the performance reference.

**`onUserEnable` versus `onload`.** "Perform any initial setup code. The user has explicitly
interacted with the plugin so its safe to engage with the user. If your plugin registers a custom
view, you can open it here" **Contract** (api: obsidian.d.ts:5066-5073). **Recommendation:** anything
that opens UI unprompted belongs here, not in `onload`, which also runs on every subsequent app
start.

**`Plugin.settings`.** A `settings?: unknown` field exists — "Assign loaded data here in `onload`.
Declare a concrete type on your subclass to type it" **Contract** (api: obsidian.d.ts:4913-4919) —
@1.13.0, **insider-only at pin**. Persistence and settings tabs belong to the settings reference;
`loadData`/`saveData` themselves are @0.9.7, stable (api: obsidian.d.ts:5056; api: obsidian.d.ts:5064).

## Component, the teardown machine

Every automatic cleanup in a plugin comes from `Component` @0.9.7, stable
(api: obsidian.d.ts:1835). The rule it encodes: "Any resources created by the plugin, such as event
listeners, must be destroyed or released when the plugin unloads. When possible, use methods like
`registerEvent()` or `addCommand()` to automatically clean up resources" **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:100; docs: en/Plugins/Releasing/Plugin guidelines.md:102).

| Method | Contract | `@since` | Tier |
|---|---|---|---|
| `register(cb)` (api: obsidian.d.ts:1880) | "Registers a callback to be called when unloading" (api: obsidian.d.ts:1876) | 0.9.7 | stable |
| `registerEvent(ref)` (api: obsidian.d.ts:1886) | "Registers an event to be detached when unloading" (api: obsidian.d.ts:1882) | 0.9.7 | stable |
| `registerDomEvent(el, type, cb)` (api: obsidian.d.ts:1892; api: obsidian.d.ts:1898; api: obsidian.d.ts:1904) | three overloads — `Window`, `Document`, `HTMLElement` | 0.14.8 | stable |
| `registerInterval(id)` (api: obsidian.d.ts:1912) | "Registers an interval (from setInterval) to be cancelled when unloading" (api: obsidian.d.ts:1907) | 0.13.8 | stable |
| `addChild(c)` / `removeChild(c)` (api: obsidian.d.ts:1868; api: obsidian.d.ts:1874) | child is loaded/unloaded with the parent | 0.12.0 | stable |

`addChild` is the escape hatch for anything with its own lifetime: attach a `Component` subclass and
its `onload`/`onunload` run with yours (api: obsidian.d.ts:1864-1874).

Three details that cause real bugs:

- **Use `window.setInterval`, not the bare global.** The typings say so explicitly: "Use
  `window.setInterval` instead of `setInterval` to avoid TypeScript confusing between NodeJS vs
  Browser API" **Contract** (api: obsidian.d.ts:1908), and the narrative documentation and template
  both use the `window` form (docs: en/Plugins/Events.md:19; sample: src/main.ts:84-86).
  **Conflict:** the API README's own example passes a bare `setInterval`
  (api: README.md:66-68). **Recommendation:** follow the typings.
- **Not everything needs registering.** "You don't need to clean up resources that are guaranteed to
  be removed when your plugin unloads. For example, if you register a `mouseenter` listener on a DOM
  element, the event listener will be garbage-collected when the element goes out of scope"
  **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:117). `registerDomEvent` is for
  listeners on elements you do **not** own — "If you register DOM events for elements that persist on
  the page after your plugin unloads, such as `window` or `document` events" **Contract**
  (api: README.md:61). The template registers on `activeDocument` rather than `document`
  **Observed** (sample: src/main.ts:79).
- **There is no way to ask whether a component is loaded.** `Component` exposes `load`, `unload`,
  `onload`, `onunload`, the register family, and the child pair — and nothing else
  (api: obsidian.d.ts:1835; api: obsidian.d.ts:1913). **Inference:** track your own state if you
  need it.

## The registration table

Everything a `Plugin` can register, with the teardown story and the reference that owns the surface's
own semantics. All are declared on `Plugin` (api: obsidian.d.ts:4901; api: obsidian.d.ts:5086).

| Method | `@since` | Tier | Cleaned up automatically | Surface owned by |
|---|---|---|---|---|
| `addRibbonIcon` (api: obsidian.d.ts:4938) | 0.9.7 | stable | yes | UI surfaces |
| `addStatusBarItem` (api: obsidian.d.ts:4947) | 0.9.7 | stable | yes | UI surfaces |
| `addCommand` (api: obsidian.d.ts:4955) | 0.9.7 | stable | yes | this file |
| `removeCommand` (api: obsidian.d.ts:4962) | 1.7.2 | stable | n/a — "should not be needed unless your plugin registers commands dynamically" (api: obsidian.d.ts:4957-4958) | this file |
| `addSettingTab` (api: obsidian.d.ts:4969) | 0.9.7 | stable | yes | settings |
| `registerView` (api: obsidian.d.ts:4974) | 0.9.7 | stable | the *type* is unregistered; **open leaves are not** | workspace, views, and state |
| `registerHoverLinkSource` (api: obsidian.d.ts:4980) | 1.1.0 | stable | yes | UI surfaces |
| `registerExtensions` (api: obsidian.d.ts:4985) | 0.9.7 | stable | yes | this file |
| `registerMarkdownPostProcessor` (api: obsidian.d.ts:4992) | 0.9.7 | stable | yes | editor extensions |
| `registerMarkdownCodeBlockProcessor` (api: obsidian.d.ts:5001) | 0.9.7 | stable | yes | editor extensions |
| `registerBasesView` (api: obsidian.d.ts:5009) | 1.10.0 | stable | yes | UI surfaces |
| `registerEditorExtension` (api: obsidian.d.ts:5019) | 0.12.8 | stable | yes | editor extensions |
| `registerObsidianProtocolHandler` (api: obsidian.d.ts:5028) | 0.11.0 | stable | yes | this file |
| `registerEditorSuggest` (api: obsidian.d.ts:5034) | 0.12.7 | stable | yes | editor extensions |
| `registerCliHandler` (api: obsidian.d.ts:5048) | 1.12.2 | stable | yes | this file |

"Cleaned up automatically" is **Inference** from the documented rule that registration methods are
the way to get automatic cleanup (docs: en/Plugins/Releasing/Plugin guidelines.md:102) plus the
absence of any `unregister*` counterpart other than `removeCommand`; the typings state no teardown
contract per method. The one case where the inference is documented to fail is leaves, below.

Two registration contracts are easy to get wrong:

- `registerBasesView` is the only registration method that can fail by design — it returns `false`
  when Bases is disabled in the vault, so branch on the return value **Contract**
  (api: obsidian.d.ts:5005). The Bases surface itself is owned by the UI surfaces reference.
- `registerHoverLinkSource` "Registers a view with the 'Page preview' core plugin as an emitter of
  the 'hover-link' event" **Contract** (api: obsidian.d.ts:4976); its `HoverLinkSource.display`
  "should match the plugin's display name" **Contract** (api: obsidian.d.ts:3447-3452).

## The one hole: leaves

Registration cleans up almost everything. Leaves are the documented exception: "Unless explicitly
removed, any leaves a plugin adds to the workspace remain even after the plugin is disabled. Plugins
are responsible for removing any leaves they add to the workspace" **Contract**
(docs: en/Plugins/User interface/Workspace.md:124), with `detach()` and `detachLeavesOfType()` named
as the removal calls (docs: en/Plugins/User interface/Workspace.md:126).

The submission guidelines say the opposite about *where*: "Don't detach leaves in `onunload` — When
the user updates your plugin, any open leaves will be reinitialized at their original position,
regardless of where the user had moved them" **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:119; docs: en/Plugins/Releasing/Plugin guidelines.md:121).
The typings take no side: the JSDoc on `detachLeavesOfType` is one line, "Remove all leaves of the
given type" (api: obsidian.d.ts:8033-8037).

**Recommendation** (this skill's synthesis, not upstream text): do not detach in `onunload`; detach
only from a user-invoked action such as a command. The guidelines outrank the narrative page in the
authority order, and the cost of the alternative — silently relocating the user's panes on every
update — is worse than a leftover leaf. This rule is documentation-sourced; the typings carry no
warning either way.

## Commands

`addCommand` takes a `Command` object (api: obsidian.d.ts:1700; api: obsidian.d.ts:4955) and is
called from `onload` **Contract** (docs: en/Plugins/User interface/Commands.md:5).

**The prefixing contract.** "The command id and name will be automatically prefixed with this
plugin's id and name" **Contract** (api: obsidian.d.ts:4951); the submission requirements repeat it
for the id: "Obsidian automatically prefixes command IDs with your plugin ID. You don't need to
include the plugin ID yourself" **Contract**
(docs: en/Plugins/Releasing/Submission requirements for plugins.md:48-49). Note that the typings
extend this to the **name** as well, which the requirements page does not mention. `Command.id` is
still described as "Globally unique ID to identify this command" (api: obsidian.d.ts:1702-1705) —
that uniqueness holds after prefixing.

**Callback precedence**, stated in the JSDoc of each field:

| Field | Precedence note | `@since` | Tier |
|---|---|---|---|
| `editorCheckCallback` (api: obsidian.d.ts:1821) | "Overrides `editorCallback`, `callback` and `checkCallback`" (api: obsidian.d.ts:1797) | 0.12.2 | stable |
| `editorCallback` (api: obsidian.d.ts:1794) | "Overrides `callback` and `checkCallback`" (api: obsidian.d.ts:1778) | 0.12.2 | stable |
| `checkCallback` (api: obsidian.d.ts:1774) | "Complex callback, overrides the simple callback" (api: obsidian.d.ts:1741) | untagged | unknown |
| `callback` (api: obsidian.d.ts:1739) | "Simple callback, triggered globally" (api: obsidian.d.ts:1726) | untagged | unknown |

Choose by condition, not by habit: "Use `callback` if the command runs unconditionally. Use
`checkCallback` if the command only runs under certain conditions. If the command requires an open and
active Markdown editor, use `editorCallback`, or the corresponding `editorCheckCallback`"
**Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:135-136; docs: en/Plugins/Releasing/Plugin guidelines.md:138).

A check callback runs **twice**: "If checking is true, then this function should not perform any
action. If checking is false, then this function should perform the action" **Contract**
(api: obsidian.d.ts:1748-1749), and "Returning false or undefined causes the command to be hidden
from the command palette" **Contract** (api: obsidian.d.ts:1744-1745). Because "time may pass between
the two runs, you need to perform the check during both calls" **Contract**
(docs: en/Plugins/User interface/Commands.md:27; docs: en/Plugins/User interface/Commands.md:29).
Editor commands "only appear in the Command Palette when there's an active editor available"
**Contract**
(docs: en/Plugins/User interface/Commands.md:76).

**`editorCallback` second argument — conflict.** The signature types it
`MarkdownView | MarkdownFileInfo` (api: obsidian.d.ts:1794) while the JSDoc example, the narrative
page, and the docs' `editorCheckCallback` example all type it `MarkdownView`
(api: obsidian.d.ts:1784; docs: en/Plugins/User interface/Commands.md:67; docs: en/Plugins/User interface/Commands.md:84).
The official template follows the signature **Observed** (sample: src/main.ts:45-48). **Recommendation:** follow the signature and narrow with
`instanceof` before touching anything view-specific.

Other `Command` fields: `icon?: IconName` (api: obsidian.d.ts:1716), `mobileOnly?: boolean` with no
documentation beyond its name (api: obsidian.d.ts:1718), and `repeatable?: boolean` —
"Whether holding the hotkey should repeatedly trigger this command", default `false`
(api: obsidian.d.ts:1719-1724).

**Default hotkeys: don't.** "It is recommended for plugins to avoid setting default hotkeys if
possible, to avoid conflicting hotkeys with one that's set by the user, even though customized
hotkeys have higher priority" **Contract** (api: obsidian.d.ts:1823-1824), restated as a guideline —
"Setting a default hotkey may lead to conflicts between plugins and may override hotkeys that the
user has already configured. It's also difficult to choose a default hotkey that is available on all
operating systems" **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:127; docs: en/Plugins/Releasing/Plugin guidelines.md:129)
— and as a warning in the narrative page (docs: en/Plugins/User interface/Commands.md:105). For a
view-scoped hotkey that does not fight the global keymap, use `View.scope`; see the workspace,
views, and state reference.

## Protocol handlers

`registerObsidianProtocolHandler(action, handler)` @0.11.0, stable (api: obsidian.d.ts:5028) handles
`obsidian://` URLs: "'open' corresponds to `obsidian://open`", and
"`obsidian://open?key=value` would generate `{'action': 'open', 'key': 'value'}`" **Contract**
(api: obsidian.d.ts:5022-5024).

**The `'true'` trap.** `ObsidianProtocolData` is `{ action: string; [key: string]: string | 'true' }`
**Contract** (api: obsidian.d.ts:4741-4746). A query parameter written without a value therefore
arrives as the literal four-character string `'true'`, not a boolean and not `undefined`.
**Recommendation:** treat every parameter as an untrusted string, compare against `'true'`
explicitly, and validate before use — a URL is an external input surface reachable by any web page
the user clicks.

## File extensions

`registerExtensions(extensions: string[], viewType: string)` @0.9.7, stable
(api: obsidian.d.ts:4985) binds file extensions to a registered view type — the mechanism by which a
plugin becomes the opener for a new file kind. The typings carry no JSDoc body
(api: obsidian.d.ts:4981-4985) and no narrative page covers it. **Unverified:** what happens when two
plugins claim the same extension, and whether the binding is reverted on unload. Register the view
type first; the view side is owned by the workspace, views, and state reference.

## CLI handlers

`registerCliHandler(command, description, flags, handler)` @1.12.2, **stable at pin**
(api: obsidian.d.ts:5048). Two contracts sit in its JSDoc:

- "Command IDs must be globally unique. Attempting to register a command that is already registered
  will throw an Error" **Contract** (api: obsidian.d.ts:5037). Global means across all plugins, not
  within yours — this is the one registration call that can take down `onload` with an exception.
- "Use the format `<plugin-id>` for your default command, and `<plugin-id>:<action>` for sub-commands
  and actions" **Contract** (api: obsidian.d.ts:5039).

Shapes: `CliFlags` is `Record<string, CliFlag>` (api: obsidian.d.ts:1634); a `CliFlag` carries an
optional `value` — "Value placeholder (e.g., '<filename>', '<path>'). Omit for boolean flags" — a
required `description` "shown in help and autocomplete", and an optional `required` defaulting to
false **Contract** (api: obsidian.d.ts:1611-1627). The handler is
`(params: CliData) => string | Promise<string>` (api: obsidian.d.ts:1640) and `CliData` repeats the
protocol-handler shape, `string | 'true'` (api: obsidian.d.ts:1597-1602) — so the same valueless-flag
trap applies. The returned string is what the CLI prints (**Inference** from the return type; the
typings do not say).

The CLI is gated on the user's installer version and an opt-in setting, and it only works while the
app is running. Those gates, the command set, and the debugging loop belong to the debugging
reference. **Recommendation:** never make a CLI handler the only path to a feature — mirror it with a
command.

## The events model

`Events` @0.9.7, stable (api: obsidian.d.ts:2808) is the base class for `Vault`, `MetadataCache`,
`Workspace`, every workspace item, and `SecretStorage`. Its surface is `on`, `off`, `offref`,
`trigger`, and `tryTrigger` (api: obsidian.d.ts:2814-2834).

The contract to internalise: `on(...)` returns an `EventRef`, and that ref must be handed to
`registerEvent` — "For registering events from any event interfaces, such as `App` and `Workspace`,
please use `this.registerEvent`, which will automatically detach your event handler when your plugin
unloads" **Contract** (api: README.md:56), restated as "Any registered event handlers need to be
detached whenever the plugin unloads. The safest way to make sure this happens is to use the
`registerEvent()` method" **Contract** (docs: en/Plugins/Events.md:3). The manual path is
`offref(ref)` (api: obsidian.d.ts:2824).

`EventRef` is an **empty interface** (api: obsidian.d.ts:2800; api: obsidian.d.ts:2802) — an opaque
token. You cannot read the event name, the handler, or the emitter back off it.
**Recommendation:** if you need to detach one listener early, keep your own reference.

Typing caveat: `Events.on` at the base takes `(...data: unknown[])` (api: obsidian.d.ts:2814), and
only `Vault`, `MetadataCache`, `Workspace`, and `WorkspaceLeaf` add typed overloads. **Inference:** a
misspelled event name on any other emitter type-checks silently and never fires.

Two registration-time rules with real consequences:

- `vault.on('create')` "is also called when the vault is first loaded for each existing file. If you
  do not wish to receive create events on vault load, register your event handler inside
  `Workspace.onLayoutReady`" **Contract**
  (api: obsidian.d.ts:7567-7570; docs: en/Plugins/Guides/Optimize plugin load time.md:32). The
  alternative shape — early-return when `!app.workspace.layoutReady` — is shown in the same guide
  (docs: en/Plugins/Guides/Optimize plugin load time.md:44-47), and `layoutReady` is a declared
  field (api: obsidian.d.ts:7817).
- `workspace.on('quit')` is "Not guaranteed to actually run. Perform some best effort cleanup here"
  **Contract** (api: obsidian.d.ts:8169-8176). Its callback receives a `Tasks` object with `add`,
  `addPromise`, `isEmpty`, and `promise` (api: obsidian.d.ts:7013-7028) — the only declared way to
  hold up quit. **Recommendation:** never make durable state depend on `quit` firing.

The per-emitter event catalogues live with their owners: workspace events in the workspace, views,
and state reference; vault and metadata-cache events in the vault and metadata reference.

## Plugin interop: the negative contract

`App` declares nine properties and three methods (api: obsidian.d.ts:406; api: obsidian.d.ts:482).
There is **no** plugin registry, no `plugins`, no `internalPlugins`, no `commands`, and no `setting`
object. The API README's architecture section lists exactly the same modules — `App`, `Vault`,
`Workspace`, `MetadataCache` — and nothing about reaching another plugin **Contract**
(api: README.md:41-44).

**Consequence:** plugin-to-plugin interop has no supported contract at this pin. Code that reaches
another plugin's instance goes through undeclared properties, which the typings do not describe and
this skill cannot verify. **Recommendation:** if you need to interoperate, use a declared surface —
commands the other plugin registers, files in the vault, or a protocol handler — and treat anything
else as unsupported and version-fragile.

## Known gaps

- **No teardown contract per registration method.** The typings never state what is undone on unload
  for any `register*` call. The table above marks this as **Inference**; only the leaves case is
  documented, and it is documented as an exception.
- **`registerExtensions` collisions** — see above; **Unverified**.
- **`Component` load state** is not observable (api: obsidian.d.ts:1835; api: obsidian.d.ts:1913).
- **`tryTrigger` versus `trigger`** — no JSDoc distinguishes them
  (api: obsidian.d.ts:2829; api: obsidian.d.ts:2834). **Unverified.**
- **The `hover-link` event is not declared** as a `Workspace` event; it exists only in prose on
  `registerHoverLinkSource` and `HoverLinkSource` (api: obsidian.d.ts:4976; api: obsidian.d.ts:3454).
  Emitting or handling it is untyped.
- **`Command.mobileOnly`** has no documented semantics (api: obsidian.d.ts:1718). **Unverified.**
- **No agent-behaviour evaluation.** Nothing here has been measured for how it triggers or routes in
  a clean context.
