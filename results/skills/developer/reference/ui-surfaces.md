# UI surfaces

Every place a plugin can put pixels in front of a user, other than the editor and a custom view:
ribbon, status bar, notices, menus, modals and suggesters, icons, raw DOM, tooltips, and Bases views
— plus the two cross-cutting concerns that decide whether any of it works for everyone:
right-to-left layout and language.

## Contents

- [Evidence boundary and availability](#evidence-boundary-and-availability)
- [Surface chooser](#surface-chooser)
- [Ribbon](#ribbon)
- [Status bar](#status-bar)
- [Notices](#notices)
- [Menus](#menus)
- [Modals and suggesters](#modals-and-suggesters)
- [Icons](#icons)
- [Building DOM](#building-dom)
- [Tooltips](#tooltips)
- [Right-to-left](#right-to-left)
- [Localisation](#localisation)
- [Bases views](#bases-views)
- [Gaps and conflicts](#gaps-and-conflicts)

## Evidence boundary and availability

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Declarations and JSDoc are **Contract**; documentation samples are **Contract** where they
state a rule and **Observed** where they only show one working shape.

**Undated surfaces.** Several long-standing UI classes and helpers carry no `@since` tag anywhere in
the pinned sources: the `Modal` class (api: obsidian.d.ts:4474-4477), `Menu`
(api: obsidian.d.ts:4242-4245), `MenuItem` (api: obsidian.d.ts:4310-4313), and the four icon helpers
(api: obsidian.d.ts:387-393; api: obsidian.d.ts:5682-5689). Their generated reference pages carry no
version marker either
(docs: en/Reference/TypeScript API/Modal.md:10; docs: en/Reference/TypeScript API/Menu.md:10).
**Gap:** for these, the availability tier cannot be derived from the pin. Treat them as
long-established and say so rather than inventing an `@since`. Individual *members* of those classes
usually are dated, and those dates are cited below.

Where a member is dated, this page states `@since` plus its tier at the pin — **stable (≤1.12.7)**
or **insider-only (>1.12.7)** — measured against the stable release recorded in
(rel: desktop-releases.json:3).

## Surface chooser

| You want | Use | `@since` | Tier |
|---|---|---|---|
| A discoverable, hotkeyable action | A command — see the lifecycle-and-registration reference | — | — |
| A persistent clickable icon | `addRibbonIcon` (api: obsidian.d.ts:4938) | 0.9.7 | stable |
| Ambient, always-visible state (desktop) | `addStatusBarItem` (api: obsidian.d.ts:4947) | 0.9.7 | stable |
| A transient message | `new Notice(...)` (api: obsidian.d.ts:4637) | 0.9.7 class (api: obsidian.d.ts:4611) | stable |
| A contextual action list | `Menu` (api: obsidian.d.ts:4245) | undated | see above |
| Focused input or a decision | `Modal` (api: obsidian.d.ts:4477) | undated | see above |
| Pick one of many items | `SuggestModal` / `FuzzySuggestModal` (api: obsidian.d.ts:6877; api: obsidian.d.ts:3294) | 0.9.20 (docs: en/Reference/TypeScript API/SuggestModal.md:12) / 0.9.20 (api: obsidian.d.ts:3292) | stable |
| Type-ahead on your own text input | `AbstractInputSuggest` (api: obsidian.d.ts:294) | 1.4.10 (api: obsidian.d.ts:292) | stable |
| A data view inside Bases | `registerBasesView` (api: obsidian.d.ts:5009) | 1.10.0 (api: obsidian.d.ts:5007) | stable |

Two routing rules that prevent most rework:

- **Never make a surface the only entry point.** Users can remove a ribbon icon or hide the ribbon
  entirely, so ribbon functionality must also be reachable another way, typically a command
  **Contract** (docs: en/Plugins/User interface/Ribbon actions.md:19-20). The same reasoning applies
  to the status bar, which does not exist at all on mobile.
- **Settings rows are not a general UI kit.** Building setting rows inside a modal, and every rule
  about the settings tab itself, belongs to the settings reference.

## Ribbon

`addRibbonIcon(icon, title, callback)` returns the created `HTMLElement`; the first argument is an
icon id, the second becomes the tooltip **Contract** `@since 0.9.7`, stable
(api: obsidian.d.ts:4932-4938). The ribbon is the left sidebar, and its stated purpose is "to host
actions defined by plugins" **Contract** (docs: en/Plugins/User interface/Ribbon actions.md:1).

Two documented rules: mirror the action as a command, because the icon may be gone; and do **not**
add your own plugin setting to toggle a ribbon item — "It is also recommended that plugins do not
add their own toggles for ribbon items" **Contract**
(docs: en/Plugins/User interface/Ribbon actions.md:20). The user already controls ribbon visibility;
a second control is a second source of truth.

Register in `onload`; teardown is automatic. The registration contracts belong to the
lifecycle-and-registration reference.

## Status bar

`addStatusBarItem()` returns an `HTMLElement` you populate **Contract** `@since 0.9.7`, stable
(api: obsidian.d.ts:4940-4947). The JSDoc carries the constraint in three words: "Not available on
mobile." (api: obsidian.d.ts:4941), and the docs repeat it as a caution — custom status bar items
"are **not** supported on Obsidian mobile apps" **Contract**
(docs: en/Plugins/User interface/Status bar.md:3-4).

**Consequence:** any feature whose only readout is a status bar item is a desktop-only feature in
practice, even when `isDesktopOnly` is `false`. Deciding how to gate that — `Platform` checks,
manifest flags — is owned by the mobile-and-compatibility reference.

Layout detail worth knowing: Obsidian inserts a default gap between separate status bar items, so
several related indicators belong inside **one** item rather than several **Contract**
(docs: en/Plugins/User interface/Status bar.md:20).

## Notices

`new Notice(message, duration?)` — "Use to present timely, high-value information" **Contract**
(api: obsidian.d.ts:4609-4613). The message may be a string or a `DocumentFragment`, and
**`duration: 0` makes the notice permanent**: "If this is 0, the Notice will stay visible until the
user manually dismisses it" **Contract** (api: obsidian.d.ts:4632-4637). `setMessage()` updates a
live notice and `hide()` dismisses it programmatically **Contract** `@since 0.9.7`, stable
(api: obsidian.d.ts:4643; api: obsidian.d.ts:4649).

**Gap:** the default duration when `duration` is omitted is not stated anywhere in the pinned
sources. Do not quote a number; pass an explicit duration when it matters.

Element access: use `messageEl` or `containerEl`, both `@since 1.8.7`, stable
(api: obsidian.d.ts:4624; api: obsidian.d.ts:4629). `noticeEl` is **@deprecated** in favour of
`messageEl` (api: obsidian.d.ts:4616-4619) — a common finding in older plugins.

**Recommendation:** a notice is not an error log. Recurring failures belong in the developer console
or a persistent surface; a stream of notices is the most common way plugins become annoying, and the
docs frame the class around "timely, high-value" information for that reason.

## Menus

Construct with `new Menu()`, add rows through `addItem`, then show it **Contract**
(docs: en/Plugins/User interface/Context menus.md:1; docs: en/Plugins/User interface/Context menus.md:9-11).

**The ordering trap:** `addItem` and `addSeparator` "Only works when menu is not shown yet"
**Contract** `@since 0.15.3`, stable (api: obsidian.d.ts:4265-4269; api: obsidian.d.ts:4271-4275).
Build the whole menu, then show it; a late `addItem` is silently ineffective.

Showing it:

- `showAtMouseEvent(evt)` `@since 0.12.6`, stable (api: obsidian.d.ts:4285) — opens where the user
  clicked **Contract** (docs: en/Plugins/User interface/Context menus.md:35).
- `showAtPosition({ x, y })` `@since 1.1.0`, stable (api: obsidian.d.ts:4290) — coordinates are
  "relative to the top-left corner of the Obsidian window" **Contract**
  (docs: en/Plugins/User interface/Context menus.md:38), not the element and not the screen.
- `Menu.forEvent(evt)` `@since 1.6.0`, stable (api: obsidian.d.ts:4307).
- `setUseNativeMenu(...)` "(Only works on the desktop app)" `@since 0.16.0`, stable
  (api: obsidian.d.ts:4257-4262).

Item styling: `setIcon` and `setChecked` `@since 0.16.2`, stable
(api: obsidian.d.ts:4330; api: obsidian.d.ts:4336); `setDisabled`, `setWarning`, and `setIsLabel`
`@since 0.15.0`, stable (api: obsidian.d.ts:4341; api: obsidian.d.ts:4348; api: obsidian.d.ts:4353).
`setWarning` turns the title and icon red — or "whatever color is applied to the class `is-warning`
by a theme" (api: obsidian.d.ts:4342-4348), so it is theme-overridable, not a guaranteed colour.

**Extending Obsidian's own menus** is an event subscription, not a menu you own: subscribe to the
workspace `file-menu` and `editor-menu` events and add items to the menu you are handed, wrapping
the subscription in `registerEvent()` **Contract**
(docs: en/Plugins/User interface/Context menus.md:42; docs: en/Plugins/User interface/Context menus.md:51-52).
The event catalogue itself is owned by the lifecycle-and-registration reference.

`setSection(section)` places an item in an existing group `@since 0.15.3`, stable
(api: obsidian.d.ts:4367). **Gap:** the section ids are not enumerated anywhere; the documented
discovery method is to "inspect the DOM elements to see their `data-section` attribute"
(api: obsidian.d.ts:4360-4367). Any section id you use is therefore an **Unverified** dependency on
undocumented internals — say so when recommending one.

## Modals and suggesters

**`Modal`.** Extend it, call `super(app)`, then `setTitle(...)` and either `setContent(...)` or your
own DOM under `this.contentEl` **Contract**
(docs: en/Plugins/User interface/Modals.md:1; docs: en/Plugins/User interface/Modals.md:6-9; api: obsidian.d.ts:4538-4542).
`open()` shows it "on the active window. On phones, the modal will animate on screen"
(api: obsidian.d.ts:4516-4519); `close()`, `onOpen()`, and `onClose()` complete the lifecycle
(api: obsidian.d.ts:4525; api: obsidian.d.ts:4529; api: obsidian.d.ts:4533). `setCloseCallback` is
`@since 1.10.0`, stable (api: obsidian.d.ts:4548).

The documented result-delivery pattern is an `onSubmit` callback passed to the constructor, with the
primary button marked by `setCta()` **Contract**
(docs: en/Plugins/User interface/Modals.md:43; docs: en/Plugins/User interface/Modals.md:59). A
modal that mutates plugin state directly is harder to test and harder to reuse.

**`ConfirmationModal`** exists as a first-class confirm dialog — `addCheckbox`, `addButton`,
`addCancelButton`, with buttons that "auto-close the modal on click unless the handler returns
truthy" (api: obsidian.d.ts:1958-1963; api: obsidian.d.ts:1984; api: obsidian.d.ts:1994). It is
`@since 1.13.0` (api: obsidian.d.ts:1961), **insider-only at pin** — never the default
recommendation; build the confirm step from `Modal` instead.

**`SuggestModal<T>`** gives a filtered list: implement `getSuggestions(query)`,
`renderSuggestion(item, el)`, and `onChooseSuggestion(item, evt)` **Contract**
(docs: en/Plugins/User interface/Modals.md:105-120).
**`FuzzySuggestModal<T>`** implements those three for you and asks for `getItems()`,
`getItemText(item)`, and `onChooseItem(item, evt)` instead — fuzzy matching out of the box
**Contract** `@since 0.9.20`, stable
(api: obsidian.d.ts:3292-3294; docs: en/Plugins/User interface/Modals.md:128). To highlight matches
yourself, override `renderSuggestion` and call `renderResults(el, text, match)`; the fourth `offset`
argument re-bases a match into a second field **Contract**
(docs: en/Plugins/User interface/Modals.md:153; docs: en/Plugins/User interface/Modals.md:179).

**`AbstractInputSuggest<T>`** attaches type-ahead "to an `<input>` element or a
`<div contentEditable>`" **Contract** `@since 1.4.10`, stable (api: obsidian.d.ts:288-294).
Implement `getSuggestions(query)` (`@since 1.5.7`) and handle selection through `onSelect(callback)`
(`@since 1.4.10`), both stable (api: obsidian.d.ts:325; api: obsidian.d.ts:336).

**The `limit` trap.** Three suggester bases expose a `limit` field, and only one documents what it
defaults to:

| Field | JSDoc | Consequence |
|---|---|---|
| `AbstractInputSuggest.limit` | "Set to 0 to disable. Defaults to 100" (api: obsidian.d.ts:297-301) | You know what you are changing |
| `EditorSuggest.limit` | "Override this to use a different limit for suggestion items" (api: obsidian.d.ts:2699-2703) | Different **from what?** Undocumented |
| `SuggestModal.limit` | no description at all (api: obsidian.d.ts:6878-6882) | Same problem |

**Inference:** the two undocumented fields almost certainly have a non-zero default too, but the
pinned sources do not say so, and `0` means *disabled* on the one field that is documented — so
`limit = 0` on the others is not safely readable as "no limit". **Recommendation:** set `limit`
explicitly on any suggester whose result set can be large, and never rely on the unstated default.
Returning fewer results from `getSuggestions` is the portable way to bound the work; the
per-keypress cost of `EditorSuggest.onTrigger` is owned by the performance reference.

## Icons

The icon set is **Lucide**, and the pin carries a hard version ceiling: "Only icons up to v0.446.0
are supported at this time" **Contract**
(docs: en/Plugins/User interface/Icons.md:5; docs: en/Plugins/User interface/Icons.md:7).

**This fails silently.** `setIcon(parent, iconId)` "Does nothing if no icon associated with the
iconId" (api: obsidian.d.ts:5683-5689) — no exception, no console warning, just an empty element. A
name copied from a current Lucide site listing therefore produces a blank ribbon icon or a blank
menu row with no diagnostic at all. When a user reports "my icon doesn't show", the icon name and
its Lucide version are the first two things to check. `getIcon(iconId)` returns `null` for the same
case (api: obsidian.d.ts:3351), which is the cheapest way to test a name at runtime, and
`getIconIds()` lists what is actually registered (api: obsidian.d.ts:3357).

`IconName` is just `string` — "Can be any Lucide icon name or an internal icon name"
(api: obsidian.d.ts:8495-8498). The type system will not catch a typo either.

Custom icons: `addIcon(iconId, svgContent)` takes SVG **without** the surrounding `<svg>` tag, and
the artwork "needs to fit within a `0 0 100 100` view box to be drawn properly" **Contract**
(api: obsidian.d.ts:388-393; docs: en/Plugins/User interface/Icons.md:53; docs: en/Plugins/User interface/Icons.md:55).
Upstream also states Lucide's design constraints — 24×24 canvas, ≥1px padding, 2px stroke, round
joins and caps, centred strokes, 2px shape radius, 2px spacing **Contract**
(docs: en/Plugins/User interface/Icons.md:61-70).

Size is CSS, not an argument: set the `--icon-size` variable on the containing element, using
presets such as `var(--icon-size-m)` **Contract** (docs: en/Plugins/User interface/Icons.md:24-29).

**Gap:** none of `setIcon`, `addIcon`, `getIcon`, or `getIconIds` carries an `@since` in the typings
or in the generated reference — see [Evidence boundary](#evidence-boundary-and-availability).

## Building DOM

Obsidian augments `Node` and `HTMLElement` with element helpers. `createEl(tag, o?, callback?)`
creates a child and returns it, with `createDiv` and `createSpan` as shorthands and `createFragment`
for detached fragments **Contract** (api: obsidian.d.ts:187-189; api: obsidian.d.ts:196). The
options object accepts `cls`, `text`, `attr`, `title`, `parent`, `value`, `placeholder`, and `href`
(api: obsidian.d.ts:137-165). `empty()` clears a node's children and `detach()` removes it
(api: obsidian.d.ts:50-51); `setText`, `appendText`, and `toggleClass` cover the common mutations
(api: obsidian.d.ts:77; api: obsidian.d.ts:55; api: obsidian.d.ts:82).

The narrative shows the intended idiom: nest by chaining the elements `createEl` returns **Contract**
(docs: en/Plugins/User interface/HTML elements.md:27; docs: en/Plugins/User interface/HTML elements.md:38-41),
and attach styling through `cls` rather than inline styles **Contract**
(docs: en/Plugins/User interface/HTML elements.md:68). Conditional styling uses `toggleClass`
(docs: en/Plugins/User interface/HTML elements.md:82).

Style your elements from a `styles.css` in the **plugin root directory** **Contract**
(docs: en/Plugins/User interface/HTML elements.md:45), and prefer Obsidian's own CSS variables — the
docs give `--background-modifier-border` and `--text-muted` as examples — so the plugin follows the
user's theme **Contract** (docs: en/Plugins/User interface/HTML elements.md:63). The variable system
itself is owned by the themes-and-CSS reference.

**`innerHTML` and friends.** The operational rule here is short: build DOM with the helpers above
and clear it with `el.empty()` **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:92; docs: en/Plugins/Releasing/Plugin guidelines.md:94).
The security rationale, the three-way distinction between assignments that are a policy problem and
those that are merely style, and `sanitizeHTMLToDom` are owned by the security-and-policies
reference — route there rather than restating severity here.

**Gap:** the whole global augmentation block carries essentially no `@since` tags — one across the
entire block (api: obsidian.d.ts:26-30) — so these helpers cannot be version-gated from the pin
either. They are used throughout the official narrative, which is the practical evidence that they
are long-standing **Observed**.

## Tooltips

`setTooltip(el, tooltip, options?)` attaches a hover tooltip `@since 1.4.4`, stable
(api: obsidian.d.ts:6720-6727). `displayTooltip(el, content, options?)` "Manually trigger[s] a
tooltip … To display a tooltip on hover, use `setTooltip` instead" `@since 1.8.7`, stable
(api: obsidian.d.ts:2252-2258) — use it for a tooltip that must appear without a pointer, not as the
default.

`TooltipOptions` carries `placement` (undated), plus `delay` `@since 1.4.11` and `classes`/`gap`
`@since 1.8.7`, all stable
(api: obsidian.d.ts:7217-7219; api: obsidian.d.ts:7231-7235; api: obsidian.d.ts:7220-7229).
Placement is one of four values (api: obsidian.d.ts:7239).

Note that several surfaces already own a tooltip: the ribbon's `title` argument becomes one
(api: obsidian.d.ts:4933; api: obsidian.d.ts:4938), and `DomElementInfo.title` is documented as
"HTML title (for hover tooltip)" (api: obsidian.d.ts:153-155). Do not stack a second tooltip on top
of either.

## Right-to-left

Obsidian 1.6 reworked RTL with a mirrored interface and mixed-language support, and upstream states
plainly that "These changes can affect themes and plugins" **Contract**
(docs: en/Plugins/User interface/Right-to-left.md:7-8). Everything in this section is CSS you write
for your own surfaces.

- **`.mod-rtl` on `<body>`** marks an RTL *interface* language, chosen in Settings → General; the
  language code also lands in `lang` on `<html>`, and changing it requires a restart **Contract**
  (docs: en/Plugins/User interface/Right-to-left.md:14; docs: en/Plugins/User interface/Right-to-left.md:94).
- **Use logical properties, not directional ones**: `margin-inline-start/end`,
  `padding-inline-start/end`, `border-inline-start/end`, `inset-inline-start/end` in place of the
  `left`/`right` variants **Contract**
  (docs: en/Plugins/User interface/Right-to-left.md:38; docs: en/Plugins/User interface/Right-to-left.md:44-51).
  Same for values: `float: inline-start/end` and `text-align: start/end`
  (docs: en/Plugins/User interface/Right-to-left.md:53; docs: en/Plugins/User interface/Right-to-left.md:57-60).
- **Guard newer selectors with `@supports`**, because some users run older installers with older
  Chromium, and split partially supported properties into a fallback line plus the new value
  **Contract** (docs: en/Plugins/User interface/Right-to-left.md:64-67). The installer-versus-app
  version distinction behind that advice is owned by the mobile-and-compatibility reference.
- **Icons are mirrored automatically.** To opt one out, unset the transform under `.mod-rtl`
  **Contract**
  (docs: en/Plugins/User interface/Right-to-left.md:114-116; docs: en/Plugins/User interface/Right-to-left.md:121-123).
- **`--direction`** is `1` in LTR and `-1` in RTL, for `translateX()`-style maths where no logical
  value exists **Contract**
  (docs: en/Plugins/User interface/Right-to-left.md:128; docs: en/Plugins/User interface/Right-to-left.md:132).
- **`unicode-bidi: plaintext`** is the documented treatment for a single line of user content that
  could be either direction — file names, outline items, tooltips, status bar elements — giving
  correct direction and correct ellipsis trimming **Contract**
  (docs: en/Plugins/User interface/Right-to-left.md:136-138).
- **Direction is mixed in practice.** The editor sets `dir` per line on `.cm-line` from the first
  strongly directional character, and reading mode uses `dir="auto"` per block, independently of the
  interface language **Contract**
  (docs: en/Plugins/User interface/Right-to-left.md:110; docs: en/Plugins/User interface/Right-to-left.md:112).
  An LTR interface with RTL notes is a normal configuration, so do not key content styling off
  `.mod-rtl`.

## Localisation

`getLanguage()` returns "the ISO code for the currently configured app language. Defaults to 'en'"
**Contract** `@since 1.8.7`, stable
(api: obsidian.d.ts:3360-3365; docs: en/Reference/TypeScript API/getLanguage.md:14). That is the
entire supported localisation surface.

**Gap, and a large one.** No narrative page in the developer docs mentions `getLanguage`,
translation, or localisation of plugin strings at all: the function appears only in the typings and
in its own generated stub. There is no documented file layout, no bundled string catalogue, no
recommended library, and no guidance on locale fallback. Third-party i18n libraries are outside this
skill's sources by design.

**Recommendation:** where a user asks how to localise a plugin, say what is verifiable — read the
locale with `getLanguage()`, default to `'en'` when you have no catalogue for the returned code —
and label any file-layout or library advice as outside the evidence rather than presenting a
convention as official. `getLanguage` needs `minAppVersion` at or above 1.8.7; use the untagged
`requireApiVersion` guard only after independently verifying that the guard exists at the lower floor.

## Bases views

Bases is a core plugin that renders dynamic views of note data; plugins can register entirely custom
view types **Contract**
(docs: en/Plugins/Guides/Build a Bases view.md:4; docs: en/Plugins/Guides/Build a Bases view.md:6).
Everything here is `@since 1.10.0`, **stable at pin**.

- **Registration can fail by design.** `registerBasesView(viewId, registration)` "@returns false if
  bases are not enabled in this vault" **Contract** (api: obsidian.d.ts:5002-5009). Branch on the
  return value; a plugin that assumes success shows a feature that silently is not there.
- **The registration object** is `{ name, icon, factory, options? }` **Contract**
  (api: obsidian.d.ts:1254-1276), and the factory receives the controller plus "The container below
  the Bases toolbar where the view will be displayed" (api: obsidian.d.ts:1241-1247).
- **Your view subclasses `BasesView`** and implements `onDataUpdated()` — "Called when there is new
  data for the query. This view should rerender with the updated data" **Contract**
  (api: obsidian.d.ts:1144-1149; docs: en/Plugins/Guides/Build a Bases view.md:73). It is the single
  render entry point.
- **Do not retain the data object.** `BasesView.data` "will be replaced with a new result set when
  changes to the vault or Bases config occur, so views should not keep a reference to it. Also note
  the contained BasesEntry objects will be recreated" **Contract** (api: obsidian.d.ts:1131-1137).
  Read it fresh inside `onDataUpdated()`; caching entries across updates is a stale-render bug
  waiting to happen.
- **The performance contract is explicit and unusually strong for these docs:** "An unfiltered Base
  will provide an entry for every file in the vault, so your view should be able to handle thousands
  of entries, reuse DOM elements, and avoid rendering off screen where appropriate" **Contract**
  (docs: en/Plugins/Guides/Build a Bases view.md:123). The guide's own
  `containerEl.empty()`-and-rebuild sample is explicitly a simplification, not a template to ship.
  Measurement technique is owned by the performance reference.
- **Support grouping.** `BasesQueryResult.data` carries the flat list, but "Where appropriate, views
  should support groupBy by using `groupedData` instead of this value" **Contract**
  (api: obsidian.d.ts:975-980; api: obsidian.d.ts:988).
- **User-configurable options** go in the registration's `options` callback; each entry becomes a
  control in the view configuration menu and "user input will automatically be stored in the Bases
  configuration file" **Contract**
  (docs: en/Plugins/Guides/Build a Bases view.md:87; docs: en/Plugins/Guides/Build a Bases view.md:89).

**Copy-paste trap, Observed:** the guide's step-2 factory returns the constructed view
(docs: en/Plugins/Guides/Build a Bases view.md:58), while the step-3 factory with `options` drops
the `return` (docs: en/Plugins/Guides/Build a Bases view.md:99). Copying step 3 verbatim registers a
factory that returns `undefined`, which does not match the declared `BasesViewFactory` return type
(api: obsidian.d.ts:1247).

## Gaps and conflicts

- **Undated classes.** `Modal`, `Menu`, `MenuItem`, and the icon helpers have no `@since` — see
  [Evidence boundary](#evidence-boundary-and-availability). State that rather than guessing a
  version.
- **Generated reference lags the typings.** The generated `Modal` page declares
  `export class Modal implements CloseableComponent` (docs: en/Reference/TypeScript API/Modal.md:16)
  while the typings at this pin declare `implements HistoryHandler` (api: obsidian.d.ts:4477).
  **Recommendation:** for anything structural, read the typings; use the generated pages only for
  `@since` dates that the typings omit — which is exactly how they are used above.
- **Typo'd version tags.** Six declarations carry `@ince` instead of `@since`, including the
  `SuggestModal` class and its `limit` field (api: obsidian.d.ts:6875; api: obsidian.d.ts:6880) and
  three `Setting` adders (api: obsidian.d.ts:5831; api: obsidian.d.ts:5836; api: obsidian.d.ts:5841),
  so a tooling pass that reads tags mechanically will treat them as undated. The generated page still
  shows 0.9.20 for `SuggestModal` (docs: en/Reference/TypeScript API/SuggestModal.md:12) **Observed**.
- **Menu section ids are undocumented** — see [Menus](#menus).
- **Notice default duration is undocumented** — see [Notices](#notices).
- **Suggester `limit` defaults are undocumented on two of three bases** —
  see [Modals and suggesters](#modals-and-suggesters).
- **Localisation has no narrative coverage at all** — see [Localisation](#localisation).
- **Nothing here was rendered.** Silent icon failures, RTL mirroring, mobile modal animation, and
  Bases registration returning `false` are read from declarations and documentation at this pin,
  never observed in a running app — **Unverified** as behaviour.
