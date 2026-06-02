# Workspace, views, and state

How Obsidian arranges what the user sees, how a plugin acquires a place in that arrangement, and what
a custom view owes the app in return: lifecycle, persisted state, deferred loading, and pop-out
windows.

## Contents

- [Evidence boundary](#evidence-boundary)
- [The workspace tree](#the-workspace-tree)
- [Getting a leaf](#getting-a-leaf)
- [Finding what is active](#finding-what-is-active)
- [Custom view lifecycle](#custom-view-lifecycle)
- [The activate-view idiom](#the-activate-view-idiom)
- [View state](#view-state)
- [Layout persistence](#layout-persistence)
- [Deferred views](#deferred-views)
- [Removing leaves](#removing-leaves)
- [View-scoped hotkeys](#view-scoped-hotkeys)
- [Pop-out windows](#pop-out-windows)
- [Workspace events](#workspace-events)
- [Known gaps and conflicts](#known-gaps-and-conflicts)

## Evidence boundary

Structure and rationale come from the narrative documentation; exact signatures, `@since` tags, and
the normative "do not do this" JSDoc come from the typings. Where the two disagree the conflict is
shown, not resolved silently. Rendering behaviour was not executed — no live app run backs anything
here.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Every API named below states its `@since` and its tier at this pin: *stable* at or below
1.12.7, *insider-only* above it. Members the typings leave without a version tag are written
**untagged, availability unknown**: declaration at the 1.13.2 pin does not establish compatibility
with 1.12.7. A lower floor needs another pinned official source or runtime verification.

## The workspace tree

"The workspace is implemented as a tree data structure, where each node in the tree is referred to as
a workspace item. There are two types of workspace items: parents and leaves. The main difference is
that parent items can contain child items, including other parent items, whereas leaf items can't
contain any workspace items at all" **Contract**
(docs: en/Plugins/User interface/Workspace.md:3).

Two kinds of parent: "A split item lays out its child items one after another along a vertical or
horizontal direction. A tabs item only displays one child item at a time and hides the others"
**Contract** (docs: en/Plugins/User interface/Workspace.md:20-21). Under the workspace sit three
special splits — left, right, and root **Contract**
(docs: en/Plugins/User interface/Workspace.md:23), exposed as `leftSplit`, `rightSplit`, and
`rootSplit` @0.9.7, stable
(api: obsidian.d.ts:7768; api: obsidian.d.ts:7773; api: obsidian.d.ts:7788).

| Type | Role | `@since` | Tier |
|---|---|---|---|
| `WorkspaceItem` (api: obsidian.d.ts:8216) | abstract base; extends `Events` | 0.10.2 | stable |
| `WorkspaceParent` (api: obsidian.d.ts:8385) | anything that can hold children | 0.9.7 | stable |
| `WorkspaceSplit` (api: obsidian.d.ts:8442) | children along an axis | 0.9.7 | stable |
| `WorkspaceTabs` (api: obsidian.d.ts:8451) | one visible child | untagged | unknown |
| `WorkspaceContainer` (api: obsidian.d.ts:8184) | abstract; owns a `win` and a `doc` | 0.15.4 | stable |
| `WorkspaceRoot` (api: obsidian.d.ts:8400) | the main window's container | 0.15.2 | stable |
| `WorkspaceWindow` (api: obsidian.d.ts:8462) | a pop-out window's container | 0.15.4 | stable |
| `WorkspaceSidedock` (api: obsidian.d.ts:8412) | desktop sidebar; `collapsed`, `toggle`, `collapse`, `expand` (api: obsidian.d.ts:8418; api: obsidian.d.ts:8424-8434) | 0.15.4 | stable |
| `WorkspaceMobileDrawer` (api: obsidian.d.ts:8362) | mobile sidebar; the same `collapsed` flag and toggle trio (api: obsidian.d.ts:8368; api: obsidian.d.ts:8377) | 1.6.6 | stable |
| `WorkspaceLeaf` (api: obsidian.d.ts:8244) | holds exactly one view | untagged | unknown |

Structural rules worth knowing before you place anything: the root split defaults to vertical, so a
new leaf there creates a new column **Contract**
(docs: en/Plugins/User interface/Workspace.md:52); and the side docks are constrained — splitting a
leaf there "generates a new tabs item", they hold at most three levels, and "any direct children must
be tabs items" **Contract** (docs: en/Plugins/User interface/Workspace.md:69).

**The two sidebar types are not interchangeable.** `leftSplit`/`rightSplit` are typed
`WorkspaceSidedock | WorkspaceMobileDrawer` (api: obsidian.d.ts:7768), and a leaf's parent is
`WorkspaceTabs | WorkspaceMobileDrawer`: "On desktop, a leaf is always a child of a `WorkspaceTabs`
component. On mobile, a leaf might be a child of a `WorkspaceMobileDrawer`. Perform an `instanceof`
check before making an assumption about the `parent`" **Contract** (api: obsidian.d.ts:8246-8256).

Walking the tree: `getRoot()` and `getContainer()` — the latter "Get the root container parent item,
which can be one of `WorkspaceRoot`, `WorkspaceWindow`" @0.15.4, stable
(api: obsidian.d.ts:8229; api: obsidian.d.ts:8231-8237). Iterating leaves:
`iterateRootLeaves(cb)` covers "all leaves in the main area", `iterateAllLeaves(cb)` covers
"main area leaves, floating leaves, and sidebar leaves" @0.9.7, stable
(api: obsidian.d.ts:8015-8025).

## Getting a leaf

`getLeaf` @0.16.0, stable, has two overloads (api: obsidian.d.ts:7893; api: obsidian.d.ts:7908) with
the semantics spelled out in JSDoc (api: obsidian.d.ts:7895-7903):

| Argument | Result |
|---|---|
| `false` or omitted | "an existing leaf which can be navigated is returned, or a new leaf will be created if there was no leaf available" |
| `'tab'` or `true` | "a new leaf will be created in the preferred location within the root split" |
| `'split'` | "a new leaf will be created adjacent to the currently active leaf" |
| `'window'` | "a popout window will be created with a new leaf inside" |

With `'split'`, direction `'vertical'` puts the leaf to the right and `'horizontal'` puts it below
**Contract** (api: obsidian.d.ts:7886-7888); `PaneType` is `'tab' | 'split' | 'window'`
(api: obsidian.d.ts:4770) and `SplitDirection` is `'vertical' | 'horizontal'`
(api: obsidian.d.ts:6807).

**Recommendation:** derive the argument from the user's modifier keys rather than hard-coding it.
`Keymap.isModEvent(evt)` @0.16.0, stable, "Returns 'tab' if the modifier key Cmd/Ctrl is pressed OR
if this is a middle-click MouseEvent. Returns 'split' if Cmd/Ctrl+Alt is pressed. Returns 'window' if
Cmd/Ctrl+Alt+Shift is pressed" **Contract** (api: obsidian.d.ts:3654-3661), and its return type is
exactly what `getLeaf` accepts.

Sidebars and other acquisition paths:

| Call | Note | `@since` | Tier |
|---|---|---|---|
| `getLeftLeaf(split)` / `getRightLeaf(split)` (api: obsidian.d.ts:7976; api: obsidian.d.ts:7983) | returns `WorkspaceLeaf \| null` — **check it** | 0.9.7 | stable |
| `ensureSideLeaf(type, side, options?)` (api: obsidian.d.ts:7989) | "Get side leaf or create one if one does not exist" (api: obsidian.d.ts:7985); options `active`, `split`, `reveal`, `state` | 1.7.2 | stable |
| `createLeafInParent(parent, index)` (api: obsidian.d.ts:7855) | explicit placement | 0.9.11 | stable |
| `createLeafBySplit(leaf, direction?, before?)` (api: obsidian.d.ts:7861) | split a specific leaf | 0.9.7 | stable |
| `getLeafById(id)` (api: obsidian.d.ts:7954) | | 1.5.1 | stable |
| `getLeavesOfType(viewType)` (api: obsidian.d.ts:8031) | "Get all leaves of a given type" | 0.9.7 | stable |
| `getMostRecentLeaf(root?)` (api: obsidian.d.ts:7969) | "Useful for interacting with the leaf in the root split while a sidebar leaf might be active" (api: obsidian.d.ts:7964) | 0.15.4 | stable |
| `getGroupLeaves(group)` (api: obsidian.d.ts:7961) | linked views, paired with `leaf.setGroup` (api: obsidian.d.ts:8327) | 0.9.7 | stable |

`ensureSideLeaf` collapses the usual "look for an existing leaf, otherwise create one" dance into one
call. **Recommendation:** prefer it over hand-rolling that logic when your `minAppVersion` is 1.7.2 or
higher.

Four deprecated accessors remain declared; each names its replacement in JSDoc:
`splitActiveLeaf` → `getLeaf(true)` (api: obsidian.d.ts:7864), `getUnpinnedLeaf` → `getLeaf(false)`
(api: obsidian.d.ts:7882), the two-argument `duplicateLeaf` → its three-argument form
(api: obsidian.d.ts:7871; api: obsidian.d.ts:7879), and the three-argument `setActiveLeaf` → the
options form @0.16.3 (api: obsidian.d.ts:7938; api: obsidian.d.ts:7943).

## Finding what is active

| Need | Use | `@since` | Tier |
|---|---|---|---|
| The active view of a known class | `getActiveViewOfType(type)` (api: obsidian.d.ts:8005) | 0.9.16 | stable |
| The active editor | `workspace.activeEditor?.editor` (api: obsidian.d.ts:7830) | untagged | unknown |
| The active file | `getActiveFile()` (api: obsidian.d.ts:8012) | untagged | unknown |

`activeLeaf` is **deprecated**: "Please avoid using `activeLeaf` directly, especially without checking
whether `activeLeaf` is null … If you need information about the current view, use
`Workspace.getActiveViewOfType`. If you need to open a new file or navigate a view, use
`Workspace.getLeaf`" **Contract** (api: obsidian.d.ts:7791-7803), restated as a guideline
(docs: en/Plugins/Releasing/Plugin guidelines.md:142; docs: en/Plugins/Releasing/Plugin guidelines.md:144).

`activeEditor` is "A component managing the current editor. This can be null if the active view has
no editor" **Contract** (api: obsidian.d.ts:7826-7830) — it is a `MarkdownFileInfo`, whose `editor`
is itself optional (api: obsidian.d.ts:3954-3962; api: obsidian.d.ts:3967). The guideline shows the
double-optional access form (docs: en/Plugins/Releasing/Plugin guidelines.md:158).
`getActiveFile()` "Returns the file for the current view if it's a `FileView`. Otherwise, it will
return the most recently active file"
**Contract** (api: obsidian.d.ts:8008-8012) — so a non-null result does **not** prove a file view is
focused.

## Custom view lifecycle

The class chain is `View` → `ItemView` → `FileView` → `EditableFileView` → `TextFileView` →
`MarkdownView`
(api: obsidian.d.ts:7600; api: obsidian.d.ts:3590; api: obsidian.d.ts:3130; api: obsidian.d.ts:2394; api: obsidian.d.ts:7062; api: obsidian.d.ts:4188).
`View` extends `Component`, so everything the lifecycle and registration reference says about
automatic teardown applies inside a view too.

Pick the base class by what the view shows:

| Base | Use when | `@since` | Tier |
|---|---|---|---|
| `ItemView` (api: obsidian.d.ts:3590) | a panel with your own content; adds `contentEl` and `addAction` (api: obsidian.d.ts:3593; api: obsidian.d.ts:3604) | 0.9.7 | stable |
| `FileView` (api: obsidian.d.ts:3130) | the view is bound to a file; adds `file`, `allowNoFile`, `onLoadFile`, `onUnloadFile`, `onRename`, `canAcceptExtension` (api: obsidian.d.ts:3134-3144; api: obsidian.d.ts:3172-3180; api: obsidian.d.ts:3186) | untagged | unknown |
| `TextFileView` (api: obsidian.d.ts:7062) | an editable plaintext format; adds `data`, `requestSave`, `save`, and three abstract members | 0.10.12 | stable |

What a custom view must implement: `getViewType()` and `getDisplayText()` are `abstract`
(api: obsidian.d.ts:7665; api: obsidian.d.ts:7701) — "`getViewType()` returns a unique identifier for
the view. `getDisplayText()` returns a human-readable name" **Contract**
(docs: en/Plugins/User interface/Views.md:40-41). Extract the type string to a constant; "several
operations require that you specify the view you'd like to use" **Contract**
(docs: en/Plugins/User interface/Views.md:38).

`onOpen()` and `onClose()` are both `protected` and both return `Promise<void>`
(api: obsidian.d.ts:7655; api: obsidian.d.ts:7660) — "`onOpen()` is called when the view is opened
within a new leaf and is responsible for building the content of your view. `onClose()` is called
when the view should close and is responsible for cleaning up any resources used by the view"
**Contract** (docs: en/Plugins/User interface/Views.md:42-43). Unlike `Component.onunload`, these two
*are* awaited by their declared type, so asynchronous teardown is expressible here.

`TextFileView` carries the auto-save contract: "by default, this view only saves when it's closing.
To implement auto-save, your editor should call `this.requestSave()` when the content is changed"
**Contract** (api: obsidian.d.ts:7055-7058), where `requestSave` is a "Debounced save in 2 seconds
from now" (api: obsidian.d.ts:7071-7075). Its `setViewData(data, clear)` receives `clear` when
"we're opening a completely different file", and `clear()` should drop "any editor states like
undo-redo history, and any caches/indexes associated with the previous file contents" **Contract**
(api: obsidian.d.ts:7107-7118).

Two `View` fields with non-obvious defaults: `navigation` — set it `false` for "a static view that is
not intended to be navigated away … (For example: File explorer, calendar)" and `true` for a view
that opens files **Contract** (api: obsidian.d.ts:7612-7621), noting `FileView` already sets it true
(api: obsidian.d.ts:3140-3144); and `icon: IconName` @1.1.0, stable (api: obsidian.d.ts:7610), paired
with `getIcon()` @1.1.0 (api: obsidian.d.ts:7690).

**Never hold a reference to a view instance.** "Never manage references to views in your plugin.
Obsidian may call the view factory function multiple times. Avoid side effects in your view, and use
`getLeavesOfType()` whenever you need to access your view instances" **Contract**
(docs: en/Plugins/User interface/Views.md:91), with the anti-pattern and the fix shown side by side
(docs: en/Plugins/Releasing/Plugin guidelines.md:172; docs: en/Plugins/Releasing/Plugin guidelines.md:178).

## The activate-view idiom

The documented shape: look for an existing leaf of your type, otherwise create one in a sidebar, set
its view state, and reveal it **Contract**
(docs: en/Plugins/User interface/Views.md:70; docs: en/Plugins/User interface/Views.md:78-79; docs: en/Plugins/User interface/Views.md:83).
Three corrections the sample code itself does not apply:

1. `getRightLeaf(false)` returns `WorkspaceLeaf | null` (api: obsidian.d.ts:7983) — the documented
   snippet calls `setViewState` on it without a null check
   (docs: en/Plugins/User interface/Views.md:78-79) **Observed**.
2. `revealLeaf` must be awaited — see [deferred views](#deferred-views). The same snippet does not
   await it (docs: en/Plugins/User interface/Views.md:83) **Observed**.
3. `ensureSideLeaf` (above) expresses steps 1–3 in a single call when 1.7.2 is your floor.

`setViewState(viewState, eState?)` takes a `ViewState` — `type`, plus optional `state`, `active`,
`pinned`, and `group` (api: obsidian.d.ts:8287; api: obsidian.d.ts:7726-7742). To open a file in an
existing leaf instead, `openFile(file, openState?)` takes an `OpenViewState` of `state`, `eState`,
`active`, `group` (api: obsidian.d.ts:8273; api: obsidian.d.ts:4756-4764).

## View state

Two independent state channels, both declared on `View` @0.9.7, stable:

- **Persisted state** — `getState()` and `setState(state, result)`
  (api: obsidian.d.ts:7670; api: obsidian.d.ts:7675). This is what goes into the saved workspace
  layout. `setState` receives a `ViewStateResult` whose single field is `history`: "Set this to true to indicate that there is a
  state change which should be recorded in the navigation history" **Contract**
  (api: obsidian.d.ts:7749-7754). **Recommendation:** set it only for changes a user would expect the
  back button to undo — opening a different subject in the same view — and leave it alone for
  cosmetic changes such as a collapsed section.
- **Ephemeral state** — `getEphemeralState()` and `setEphemeralState(state)`
  (api: obsidian.d.ts:7680; api: obsidian.d.ts:7685), mirrored on the leaf
  (api: obsidian.d.ts:8306; api: obsidian.d.ts:8310). The typings give no JSDoc body for any of the
  four. **Inference** from the naming and from `openFile`'s separate `eState` parameter
  (api: obsidian.d.ts:4760): this channel carries transient, non-persisted position-like state such as
  a scroll offset or a target heading. **Unverified** — the contract is undocumented at this pin.

`FileView` overrides both `getState` and `setState`
(api: obsidian.d.ts:3161; api: obsidian.d.ts:3167), so a subclass that overrides them must call
`super` (**Recommendation**; the typings do not say so).

## Layout persistence

`getLayout()` returns the serialised workspace (api: obsidian.d.ts:7849) and `changeLayout(workspace)`
restores one (api: obsidian.d.ts:7843), both @0.9.7, stable. Saving is a debounced field, not a
method: `requestSaveLayout: Debouncer<[], Promise<void>>` — "Save the state of the current workspace
layout" @0.16.0, stable (api: obsidian.d.ts:7818-7823). Being a `Debouncer`, it also exposes
`cancel()` and `run()` — the latter "If there is any pending function call, clear the timer and call
the function immediately" @1.4.4 (api: obsidian.d.ts:2242-2248).

**Recommendation:** call `app.workspace.requestSaveLayout()` after your view mutates state that
`getState` reports; otherwise the change can be lost if the app exits before the next natural save.
The typings do not document when Obsidian saves the layout on its own — **Unverified**.

`layoutReady: boolean` tells you whether the layout is up; "To react to the layout becoming ready,
use `Workspace.onLayoutReady`" **Contract** (api: obsidian.d.ts:7812-7817). That hook belongs to the
lifecycle and registration reference.

## Deferred views

"As of Obsidian v1.7.2, When Obsidian loads, all views are created as instances of **DeferredView**.
Once a view is visible on screen (i.e. the tab is selected within its containing tab group), the
`leaf` will rerender and the view will be switched out to the correct `View` instance" **Contract**
(docs: en/Plugins/Guides/Defer views.md:6). The typings say the same from the leaf side: `isDeferred`
"Returns true if this leaf is currently deferred because it is in the background" @1.7.2, stable
(api: obsidian.d.ts:8288-8295).

The economics: a non-deferred custom view's **constructor runs at startup**, because "When Obsidian
opens, it will reopen all the views saved to the user's workspace. If your view is loaded (and not
deferred), this will directly impact the app load time" **Contract**
(docs: en/Plugins/Guides/Optimize plugin load time.md:22). Deferral is what keeps that cost off the
critical path, which is why undoing it is a deliberate act.

Three access patterns, in order of preference:

1. **Check `instanceof`, always.** "If your plugin is iterating the workspace (using either
   `iterateAllLeaves` or `getLeavesOfType`), it's now very important that you perform an `instanceof`
   check before making any assumptions about `leaf.view`" **Contract**
   (docs: en/Plugins/Guides/Defer views.md:12); the typings repeat it — "Do not attempt to cast this
   to your custom `View` without first checking `instanceof`" (api: obsidian.d.ts:8258-8263). Testing
   `getViewType()` and then casting is the named anti-pattern
   (docs: en/Plugins/Guides/Defer views.md:16-21).
2. **Reveal, then check.** `await workspace.revealLeaf(leaf)` — "Bring a given leaf to the foreground.
   If the leaf is in a sidebar, the sidebar will be uncollapsed. `await` this function to ensure your
   view has been fully loaded and is not deferred" @1.7.2, stable **Contract**
   (api: obsidian.d.ts:8040-8045; docs: en/Plugins/Guides/Defer views.md:59). Before 1.7.2 it did not
   return a promise, so awaiting it is also the version boundary. The guiding rule: "if your plugin is
   attempting to communicate with a view, that view should be visible" **Contract**
   (docs: en/Plugins/Guides/Defer views.md:50).
3. **Force-load, sparingly.** `await leaf.loadIfDeferred()` — "If this view is currently deferred,
   load it and await that it has fully loaded" @1.7.2, stable (api: obsidian.d.ts:8296-8301) — guarded
   with `requireApiVersion('1.7.2')` **Contract** (docs: en/Plugins/Guides/Defer views.md:77-78).
   "Manually calling `loadIfDeferred`, your plugin is removing this performance optimization from the
   given views. Use this *sparingly*" **Contract** (docs: en/Plugins/Guides/Defer views.md:84-85).

**`DeferredView` is not an exported type.** The identifier appears once in the typings, inside the
`isDeferred` JSDoc prose (api: obsidian.d.ts:8290). **Inference:** you cannot write
`view instanceof DeferredView`; test `leaf.isDeferred`, or test positively for your own class.

## Removing leaves

`leaf.detach()` removes one leaf — untagged, availability unknown (api: obsidian.d.ts:8331);
`workspace.detachLeavesOfType(viewType)` removes all of a type — @0.9.7, stable
(api: obsidian.d.ts:8037).

Leaves are the one resource registration does **not** reclaim, and the two documentation sources give
conflicting advice about where to clean them up. That conflict, and this skill's resolution, live in
the lifecycle and registration reference — read it before writing any cleanup code.

## View-scoped hotkeys

`View.scope` @1.5.7, stable: "Assign an optional scope to your view to register hotkeys for when the
view is in focus", with the documented shape `this.scope = new Scope(this.app.scope)` and a default of
`null` **Contract** (api: obsidian.d.ts:7632-7644). A `Scope` "receives keyboard events and binds
callbacks to given hotkeys. Only one scope is active at a time, but scopes may define parent scopes
(in the constructor) and inherit their hotkeys" **Contract** (api: obsidian.d.ts:5528-5529);
`register(modifiers, key, func)` accepts `null` modifiers "to capture all events matching the `key`,
regardless of modifiers" **Contract** (api: obsidian.d.ts:5539-5545), and `unregister(handler)`
removes one (api: obsidian.d.ts:5550).

**Recommendation:** this is the answer to "my plugin needs a keyboard shortcut" that does not consume
a global hotkey and does not fight the user's configuration. Pass `this.app.scope` as the parent so
global bindings still work while your view has focus.

## Pop-out windows

Pop-out windows arrived in 0.15.0, desktop only, and "For most plugins, this feature should work
out-of-the-box" **Contract**
(docs: en/Plugins/Guides/Support pop-out windows.md:6; docs: en/Plugins/Guides/Support pop-out windows.md:8).
The failure mode is global identity: "pop-out windows come with a complete different set of
globals. Each pop-out window introduces its own `Window` object, `Document` object, and fresh
copies of all global constructors (like `HTMLElement` and `MouseEvent`)" **Contract**
(docs: en/Plugins/Guides/Support pop-out windows.md:10).

| Broken assumption | Replacement | Evidence |
|---|---|---|
| `document.body.appendChild(el)` | `someElement.doc.body.appendChild(el)` | (docs: en/Plugins/Guides/Support pop-out windows.md:18; docs: en/Plugins/Guides/Support pop-out windows.md:48) |
| `el instanceof HTMLElement` | `el.instanceOf(HTMLElement)` | (api: obsidian.d.ts:56-64) |
| `evt instanceof MouseEvent` | `evt.instanceOf(MouseEvent)` | (api: obsidian.d.ts:234-241) |
| assuming one window | `node.doc` / `node.win` | (api: obsidian.d.ts:65-72) |
| a canvas keeping its context | `el.onWindowMigrated(cb)` | (api: obsidian.d.ts:216-220) |

`instanceOf` is documented as "Cross-window capable instanceof check, a drop-in replacement for
instanceof checks on DOM Nodes" **Contract** (api: obsidian.d.ts:57-59), and `onWindowMigrated`
returns a destroy function "to remove the event handler to avoid memory leaks" **Contract**
(api: obsidian.d.ts:218) — register that destroy with `Component.register`.

**`activeDocument` is not the fix.** The globals `activeWindow`/`activeDocument` "always points to
the current focused window and its document"
(docs: en/Plugins/Guides/Support pop-out windows.md:35; api: obsidian.d.ts:258-267), but appending
to `activeDocument` is called out as the wrong move: "myElement would be added to the currently
focused document, which is not necessarily the one you want" **Contract**
(docs: en/Plugins/Guides/Support pop-out windows.md:45-48). Anchor on an element you already hold.

Opening and moving windows: `moveLeafToPopout(leaf, data?)` and `openPopoutLeaf(data?)` @0.15.4,
stable, both "Only works on the desktop app", and the first "@throws Error if the app does not
support popout windows (i.e. on mobile or if Electron version is too old)" **Contract**
(api: obsidian.d.ts:7911-7917; api: obsidian.d.ts:7920-7925). Gate them; the platform-detection
rules belong to the mobile and compatibility reference. Optional placement is
`WorkspaceWindowInitData` — `x`, `y`, and a suggested `size`
(api: obsidian.d.ts:8474-8478; api: obsidian.d.ts:8480-8489).

Every `WorkspaceContainer` exposes `win` and `doc` (api: obsidian.d.ts:8190; api: obsidian.d.ts:8195),
so `leaf.getContainer().doc` is the reliable way to find the document a leaf lives in.

## Workspace events

All are `on(name, callback): EventRef` on `Workspace` and must be wrapped in
`Component.registerEvent` — see the lifecycle and registration reference.

| Event | Callback | `@since` |
|---|---|---|
| `quick-preview` (api: obsidian.d.ts:8074) | `(file, data)` — "Triggered when the active Markdown file is modified. React to file changes before they are saved to disk" (api: obsidian.d.ts:8069-8070) | 0.9.7 |
| `resize` (api: obsidian.d.ts:8080) | `()` | 0.9.7 |
| `active-leaf-change` (api: obsidian.d.ts:8087) | `(leaf: WorkspaceLeaf \| null)` | 0.10.9 |
| `file-open` (api: obsidian.d.ts:8094) | `(file: TFile \| null)` | 0.10.9 |
| `layout-change` (api: obsidian.d.ts:8100) | `()` | 0.9.20 |
| `window-open` (api: obsidian.d.ts:8106) | `(win: WorkspaceWindow, window: Window)` | 0.15.3 |
| `window-close` (api: obsidian.d.ts:8112) | `(win: WorkspaceWindow, window: Window)` | 0.15.3 |
| `css-change` (api: obsidian.d.ts:8118) | `()` | 0.9.7 |
| `file-menu` (api: obsidian.d.ts:8125) | `(menu, file, source, leaf?)` | 0.9.12 |
| `files-menu` (api: obsidian.d.ts:8131) | `(menu, files, source, leaf?)` | 1.4.10 |
| `url-menu` (api: obsidian.d.ts:8138) | `(menu, url)` | 1.5.1 |
| `editor-menu` (api: obsidian.d.ts:8144) | `(menu, editor, info)` | 1.1.0 |
| `editor-change` (api: obsidian.d.ts:8150) | `(editor, info)` | 1.1.1 |
| `editor-paste` (api: obsidian.d.ts:8159) | `(evt, editor, info)` | 1.1.0 |
| `editor-drop` (api: obsidian.d.ts:8167) | `(evt, editor, info)` | 1.1.0 |
| `quit` (api: obsidian.d.ts:8176) | `(tasks: Tasks)` | 0.10.2 |

All are stable at pin. Two normative notes: for `editor-paste` and `editor-drop`, "Check for
`evt.defaultPrevented` before attempting to handle this event, and return if it has been already
handled. Use `evt.preventDefault()` to indicate that you've handled the event" **Contract**
(api: obsidian.d.ts:8154-8155); and `quit` is best-effort only — see the lifecycle and registration
reference. A leaf additionally emits `pinned-change` and `group-change`
(api: obsidian.d.ts:8350; api: obsidian.d.ts:8354).

## Known gaps and conflicts

- **Cleanup conflict inside the views page.** It says custom views "need to be registered when the
  plugin is enabled, and cleaned up when the plugin is disabled"
  (docs: en/Plugins/User interface/Views.md:45) while its own sample leaves `onunload` empty
  (docs: en/Plugins/User interface/Views.md:63-64) **Observed**. The resolution is the leaf-cleanup
  rule in the lifecycle and registration reference.
- **A method that does not exist.** The guidelines tell you to access views through
  `Workspace.getActiveLeavesOfType()` (docs: en/Plugins/Releasing/Plugin guidelines.md:181), but no
  such member is declared — the real name is `getLeavesOfType` (api: obsidian.d.ts:8031)
  **Observed**. Use the declared one.
- **A snippet that will not compile.** The linked-views example has an unbalanced parenthesis
  (docs: en/Plugins/User interface/Workspace.md:133) **Observed**.
- **Ephemeral state is undocumented** — see [view state](#view-state). **Unverified.**
- **`WorkspaceRibbon` is an empty class** (api: obsidian.d.ts:8392; api: obsidian.d.ts:8394);
  `leftRibbon` is typed as one (api: obsidian.d.ts:7778) and `rightRibbon` is deprecated, "No longer
  used"
  (api: obsidian.d.ts:7781). Ribbon items come from the plugin method, not from this object — see the
  UI surfaces reference.
- **Layout save timing is not specified** — see [layout persistence](#layout-persistence).
- **No live run.** Nothing here was observed in a running app; every claim is a declaration, a JSDoc
  reading, or a documented statement. Agent behaviour is likewise not evaluated.
