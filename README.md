# @sincpro/mobile-ui

**Sincpro Mobile Design System** — the UI contract between design and engineering for React Native / Expo SDK 58 applications.

This package is maintained by Sincpro as part of the mobile framework ecosystem. Anyone can read the source and use the components. What Sincpro provides is the commitment behind it: stable APIs, predictable behavior, long-term support, and a team that ensures this keeps working as platforms evolve. Build on it knowing it will still be there.

> **AI agent?** Read [`AGENTS.md`](AGENTS.md) and [`docs/GOTCHAS.md`](docs/GOTCHAS.md) first.

---

## Quick Start

```bash
npx expo install @sincpro/mobile-ui
```

Wire the Tailwind preset, then import by category:

```js
// tailwind.config.js
module.exports = {
  presets: [require("@sincpro/mobile-ui/tailwind.preset")],
  content: ["./App.tsx", "./src/**/*.{ts,tsx}", "./node_modules/@sincpro/mobile-ui/**/*.js"],
};
```

```tsx
import { Actions } from "@sincpro/mobile-ui/Actions";
import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import { useToast, ToastProvider } from "@sincpro/mobile-ui/Feedback";

export default function InvoiceScreen() {
  const toast = useToast();
  return (
    <Display.Card>
      <Display.KeyValue label="Invoice #" value="INV-0042" copyable />
      <Display.Monetary value={1500.0} variant="dataLarge" />
      <Actions.Button
        accessibleSizing
        onPress={() => toast.success("Invoice sent")}
        title="Send Invoice"
      />
    </Display.Card>
  );
}
```

---

## Table of Contents

1. [What is a Design System](#what-is-a-design-system)
2. [Philosophy](#philosophy)
3. [Key Features](#key-features)
4. [Component Catalog](#component-catalog)
5. [Theme System](#theme-system)
6. [Typography System](#typography-system)
7. [Motion Tokens](#motion-tokens)
8. [Branding](#branding)
9. [Tailwind Setup](#tailwind-setup)
10. [Import Patterns](#import-patterns)
11. [Storybook](#storybook)
12. [Development](#development)

---

## What is a Design System

A design system is a shared language between the people who design products and the people who build them. It defines how things look, how they behave, and how they are named — once — so every screen built from it is consistent by default.

Without a design system, every developer makes local decisions: which shade of green for success, how many pixels for a button press state, which font weight for a label. Those decisions accumulate. Over time the product looks like it was built by ten different teams, because it was.

`@sincpro/mobile-ui` is Sincpro's answer to that problem for mobile. It encodes the design decisions once, in components and tokens that the whole team uses. When the brand evolves, the change propagates everywhere. When a new screen needs a data table, it already exists, already handles edge cases, and already matches everything else.

**The design system is not a collection of pretty components. It is the baseline every Sincpro app starts from.**

---

## Philosophy

**Composable behavior, customizable presentation.** Sincpro defaults are a starting
point, not a mandatory visual style. Preserve existing appearances while exposing public
APIs for fonts, sizes, shapes, content and composition. See the
[permanent design-system manifesto](docs/MANIFESTO.md) for the goal, acceptance criteria
and current limitations; full customizability is an objective, not a completed audit.

The [UX/UI evolution plan](docs/UX-UI-PLAN.md) tracks the rollout. The first native pilot
is in Storybook under `Patterns/Records/Detail`: list, detail, copy, edit, cancel and
recoverable error. It uses fictional data and local state, not persistence or a backend.

### Accessible interaction

- `Actions.Button` (including `.Icon`), `Actions.IconButton`, `BaseButton`,
  `Feedback.EmptyState`, `Feedback.Error` and `Form.Input` accept `accessibleSizing` to
  opt into a minimum 48-point target. Buttons also allow enlarged, multiline labels in
  this mode. Existing sizing remains the default for compatibility.
- Supply `accessibilityLabel` for icon-only actions. Loading buttons expose busy/disabled
  state and retain their accessible name.
- `Display.CopyableText` uses a familiar copy icon: tap a short value to copy it.
  A transient checkmark confirms success without adding a “Copiado” block or shifting
  layout; screen readers receive an announcement. Use `selectable` for longer text:
  native text selection stays independent of the 48-point icon action that copies the
  full value. Failures stay explicit and retryable. It accepts `disabled`, `testID`,
  `accessibilityLabel`, `onCopied` and `onCopyError`. Copy targets intentionally reserve 48 points.
- `Display.KeyValue copyable` enables copying string/number values (enforced by its type).
  Use `align="stacked"` for long content or `align="auto"` to stack below 360 points or
  above a 1.3 font scale. Existing `align="row"` remains unchanged; React nodes are
  display-only.
- `KeyValue selectable` also supports native text selection, with or without copying.
  Choose the mode by the purpose of the field, not an automatic character-count threshold.
- `Typography.SelectableText` provides read-only native range selection without opening
  the keyboard. It preserves typography/tokens and backs the longer-text modes above.
  On iOS, `Text selectable` alone only exposes full-paragraph copying, not range handles.
- Headings and section titles expose native header semantics.
- Checkbox/Select announce control state; their `accessibleSizing` mode enlarges targets.
- Sheet supports accessible escape and `showCloseButton`; `SwipeableRow visibleActions`
  supplies a non-gesture alternative. Keep explicit labels for essential actions.
- `Dialog/NativeSheet` is an optional Expo 58 native presentation (`@expo/ui` peer);
  import it by subpath, not the root barrel. Use short action sheets for choices and a
  sheet for a scoped task; do not stack sheets. Mobile-task stories demonstrate native
  summaries, cancelable selection, filters applied only on confirmation and archive/undo.
- Form/List view refresh always clears the busy state on failure and accepts
  `onRefreshError` for application recovery without discarding content.
- AppBar, BottomNav and SegmentedControl support accessible sizing; banners expose status
  semantics, and confirmation defaults use explicit verbs.

The [audit and validation report](docs/UX-AUDIT.md) records scope, evidence and device limits.

### Clean Sincpro grouping and customization

`Display.ListGroup` groups related settings or a short list on one surface, with a title,
optional description/footer/action and hairline separators only between rows. Choose
`surface="plain"` for grouping by proximity instead of a rounded container.

```tsx
<Display.ListGroup
  title="Cuenta"
  footer="Puedes cambiar estas preferencias en cualquier momento."
  contentClassName="rounded-lg bg-bg-muted"
>
  <Display.ListItem
    variant="mobile"
    title="Idioma"
    value="Español"
    chevron
    onPress={openLanguageChoices}
  />
  <Display.ListItem
    variant="mobile"
    title="Avisos importantes"
    trailing={notificationControl}
  />
</Display.ListGroup>
```

- `ListItem variant="mobile"` opts into wrapping, a 48-point target,
  tonal row press feedback and adaptive accessories. `layout="auto"` stacks values/controls
  below the text on narrow screens or enlarged text; use `layout="stacked"` for narrow
  embedded containers. Navigation values are also exposed as native accessibility values.
- New mobile rows default to `density="compact"`: regular 14-point titles/values,
  13-point supporting text and 8-point vertical padding. `density="comfortable"` restores
  the earlier PR's 17/16-point reading presentation and 12-point padding.
  Legacy rows (`variant="default"`) keep their original appearance.
- Put a toggle/checkbox in a **non-pressable** row; do not nest a second action inside a
  pressable row. The leading/trailing slots remain consumer-owned.
- `Typography.Text variant="bodyReadable"` and `Typography.SelectableText` with the same
  variant opt into 17 points while retaining `configureFonts` and system font scaling.
  The 14-point `body` and existing ListItem appearance remain unchanged.
- Customize per instance with `className`, `contentClassName`, slots, surface and separators.
  Rows also accept `style`, `titleTextProps`, `subtitleTextProps` and `valueTextProps`.
  Text props accept typography variants, weights, font families and native style arrays.
  `ListGroup.headerProps` forwards header styling/text props; `footerTextProps` controls
  string footers. Default groups use a 16-point section heading and 13-point description/footer.
  Group `style`, `contentStyle` and `separatorStyle` control spacing, surface and dividers.
  Headers expose `style`, `contentStyle`, `actionStyle` and `actionTextProps` as well.
  For example, `titleTextProps={{ style: { fontFamily: "MyLoadedFont", fontSize: 15 } }}`
  changes only one row, without copying its focus, accessibility or press behavior.
  Customize branding centrally with `buildThemeFromBrand`/`extendTheme`, `setActiveTheme`
  and `themeToVars` on the host, plus `configureFonts` for already-loaded font families.
  Do not introduce a competing palette or hardcode colors in every screen.
- This group is not virtualized: use FlatList/SectionList for large or unbounded collections.

Stories: `Patterns/Forms/Settings` shows Sincpro defaults, long content, customized
surfaces and text roles. `Foundations/Typography/CompactHierarchy` and
`ComfortableHierarchy` show the same content at two densities, not two mandatory screens.
Customization is not a complete visual approval.

### Compose collections, not a prescribed screen

`Patterns/Collections/Browsing` shows the same local data as rows, cards and
long-label variants. It combines icons, bounded 56-point artwork, readable text, metrics,
independent open/save actions and a native detail sheet. These are recipes to adapt,
not new domain-specific screen components or a web toolbar squeezed onto a phone.

```tsx
import { FilterBar } from "@sincpro/mobile-ui/widgets";

<FilterBar
  filters={filterOptions}
  onFilterPress={toggleFilter}
  onClearFilters={clearFilters}
  onOpenFilters={openFilterSheet}
  resultsLabel={resultsLabel}
  search={{
    value: query,
    onChangeText: setQuery,
    accessibilityLabel: "Buscar recursos",
    clearAccessibilityLabel: "Limpiar búsqueda",
  }}
/>;
```

Each filter supplies `id`, `label`, `selected` and optional `disabled`. State, matching,
result counts and advanced-filter drafts belong to the host. Clearing filters does not
silently clear the search query. Search, advanced action, result label and clear action
are optional; customize labels, `className`, theme and `layout="scroll|wrap|auto"`.
Auto wraps above font scale 1.3, otherwise it scrolls horizontally. Quick chips apply
immediately; the recipe's advanced sheet applies only on confirmation.

`Actions.FilterButton variant="mobile"` adds readable wrapping labels and 48-point targets.
`FilterButtonGroup layout="scroll|wrap"` and `Navigation.SearchBar accessibleSizing` are
additive; legacy filter layout and search sizing remain unchanged.
When placing these controls in a host ScrollView, use `keyboardShouldPersistTaps="handled"`
so a filter can act on the first tap while the keyboard is open.
Use virtualized lists for production-sized collections.

Dependencies follow the latest stable version compatible with Expo 58, not unbounded
upgrades. Validate with `CI=1 npx expo install --check` in addition to the quality gates.

### Controlled reordering without a closed row design

Optional import: `@sincpro/mobile-ui/widgets/ReorderableList`. Install
`react-native-sortables@^1.10.1` in the host; it uses the host's Gesture Handler 3.3+,
Reanimated 4.7+ and Worklets setup. Wrap the app in `GestureHandlerRootView`.
The adapter is deliberately **not** in the generic widgets/root barrels: applications
that do not use drag-and-drop do not need to resolve this optional peer.

```tsx
import ReorderableList from "@sincpro/mobile-ui/widgets/ReorderableList";

<ReorderableList
  items={sections}
  keyExtractor={(item) => item.id}
  getItemLabel={(item) => item.name}
  onChange={(next) => setSections(next)}
  renderItem={({ item }) => <MySectionContent section={item} />}
  itemStyle={{ borderRadius: 16, padding: 8 }}
/>;
```

- A one-column, **non-virtualized short-list** adapter with variable-height content.
  It does not own screen scrolling, persistence, confirmation or domain rules.
  Do not use it as an unbounded feed, kanban board, file drop zone or cross-app drag API.
- Only the dedicated handle starts drag. Default arrows and the handle's native
  increment/decrement actions offer alternatives; content can retain buttons, inputs
  or any custom layout. Drag/drop uses insertion, not swapping.
- `onChange(next, { key, fromIndex, toIndex, source })` delivers an immutable order
  (`source` is `drag` or `button`). Update controlled state synchronously; persist later,
  showing save failures/retry in the host. A drop in the original position emits no change.
  Draft/apply/cancel/undo can be built by owning that state, without replacing the gesture.
- Keys must be unique non-empty strings, stable across renders, never array indices.
  Content updates with the same keys preserve current objects. Insert/remove/external
  reorder or disabling **during** drag cancels the gesture, retains host data and shows
  an accessible error. `onReorderRejected` reports `data-changed` or `disabled`.
  The gesture engine remounts on rejection; keep persistent item state in the host.
- `renderItem` controls content. `renderControls` receives `dragHandle`, movement
  callbacks and boundary flags; keep that handle and an accessible non-drag alternative
  when replacing controls. `renderHandleContent` replaces **noninteractive** handle
  contents only, keeping the gesture, accessible name and adjustable actions.
- Root `className`/`style`, `itemStyle`, `contentStyle`, `controlsStyle`, `handleStyle`
  and `actionStyle` accept local layout/shape/spacing. Child content owns typography.
  `labels` localizes controls, announcements and conflict errors.
- `sortableProps` forwards engine options such as activation delay, row gap, decorations,
  animation settings and autoscroll, while the adapter owns identity, single-column
  insertion and controlled callbacks. Provide a stable Reanimated `scrollableRef` to
  the **actual Animated.ScrollView** for autoscroll; do not nest another scroll container
  or attach the ref to a different view. Native scroll props/ref belong to the host.
  Custom motion, targets and colors still require accessibility validation.

`Patterns/Collections/Reordering` demonstrates default, custom content/controls, long
rows and an external-update conflict. Only this recipe uses the new dependency;
existing form/list/query templates keep their behavior.

### Keyboard-aware forms and field navigation

Expo 58 does not automatically make arbitrary form layouts keyboard-safe.
The host must include `react-native-keyboard-controller` and its `KeyboardProvider` at
the app root. Use a development build when the runtime does not include that native module.

```tsx
<Form.KeyboardForm contentContainerStyle={{ padding: 16, gap: 16 }}>
  {fields}
</Form.KeyboardForm>
```

`KeyboardForm` owns the scroll and scopes editable inputs with `KeyboardToolbar.Group`.
Its toolbar provides previous/next/dismiss actions, including phone/number keyboards.
The scroll reserves the measured toolbar height plus 24 points (normally 72 total);
it grows with enlarged text. Override `bottomOffset` for additional accessories.
`toolbar={false}` keeps automatic avoidance without the toolbar.
Customize `toolbarLabels` or compose `Form.KeyboardToolbar` with an existing aware scroll,
using `onHeightChange` to reserve its measured height. The toolbar compensates for space
below its parent, such as a safe area or form footer, instead of floating over the caret.
The default toolbar uses compact icons; `toolbarProps={{ showDoneLabel: true }}` opts into
a text dismiss action. `toolbarProps` also accepts `className`, `style`, `actionStyle`,
`labelStyle`, `iconSize` and `renderActionContent(action, { label, disabled })`.
The content slot replaces only non-interactive content: the toolbar retains focus actions,
accessible labels and disabled states. `toolbarLabels` remains supported;
`toolbarProps` takes precedence. Font size/family and shape can be changed without
reimplementing keyboard behavior.
Do not nest this component inside another vertical ScrollView.

For existing templates, opt into `FormViewV2.Content keyboardToolbar` or
`AuthFormView keyboardToolbar` / `AuthContainer keyboardToolbar`; defaults stay unchanged.
`Form.Input` forwards its native ref for explicit return-key navigation:
`onSubmitEditing={() => nextRef.current?.focus()}` with `submitBehavior="submit"`.
`KeyboardForm` forwards its ref to the native aware scroll for methods such as
`assureFocusedInputVisible()` after validation/layout changes.
The three templates accept `keyboardFormProps` (excluding `children` and `toolbar`) for
the same ref, offsets, toolbar customization, scroll callbacks and content styling.
`keyboardToolbar` remains the explicit opt-in; omitting it preserves the original
template layout without a toolbar.
Multiline Return remains a newline; dismissing the keyboard does not submit the form.
Story: `Patterns/Forms/Keyboard navigation`.

`ListViewV2.Content` accepts native `keyboardShouldPersistTaps` and `keyboardDismissMode`
across populated, empty and error states. Handled row/retry actions receive the first tap
while search has focus (`"handled"` by default); pass `"never"` for the old dismiss-first
behavior. Drag-dismiss remains opt-in (`keyboardDismissMode="on-drag"`).
This changes interaction, not the list's typography or layout.

```tsx
<FormViewV2.Content
  keyboardToolbar
  keyboardFormProps={{
    ref: scrollRef,
    toolbarProps: {
      style: { borderRadius: 16 },
      iconSize: 18,
      showDoneLabel: true,
      labelStyle: { fontFamily: "MyFont", fontSize: 13 },
    },
  }}
>
  {fields}
</FormViewV2.Content>
```

Default list rows now honor the template's `onPressItem` and `readonly` settings;
direct `Navigation.RowItem` usage can still supply the legacy callback on `item`.

### Structured queries, not just quick chips

`widgets.FilterBuilder` edits a controlled `CriteriaGroup`: nested `all`/`any`/`none`
groups and configured conditions. Supply fields with their label, type, permitted
operators and arity (`none`, `one`, `range`); choice values are explicit. Numbers remain
editable strings until validated/committed, date fields use the native picker, and invalid
conditions produce visible errors. The mobile editor opens one group at a time instead of
squeezing an arbitrarily indented desktop tree into the screen.

`widgets.CollectionOptions` is a full-screen, keyboard-aware workspace:

```tsx
<CollectionOptions
  visible={open}
  value={query}
  fields={filterFields}
  sortFields={sortFields}
  groupFields={groupFields}
  savedQueries={savedQueries}
  onApply={applyQuery}
  onClose={closeOptions}
  onSave={saveQuery}
/>
```

`CollectionQuery` contains `search`, `filter`, ordered `sort` entries and ordered
`groupBy` field IDs. Order and grouping priorities have explicit move/remove actions;
dragging is not required. Loading a saved configuration changes the draft only;
Apply commits all dimensions together, Cancel discards the draft. Save errors keep the
draft/name for retry. The host owns saving/loading and closes the workspace after Apply.

The DS does not fetch models, evaluate filters, sort a page as if it were the full dataset,
persist favorites or translate this tree into a backend query language. Relational paths,
remote model discovery and a JSON editor are not implemented here. The web builder is a
semantic reference, not a component copied into mobile.

`Navigation.SearchBar suggestions={{ items, onSelect, loading, error, onRetry }}` shows
host-supplied autocomplete while focused. Choosing a suggestion calls `onSelect` without
silently rewriting the query. A host may complete a title or create a field-specific
condition; it owns matching, request cancellation and stale responses.

`Navigation.Search` composes that existing field with horizontally scrolling chips,
advanced filters in a `Dialog/Sheet`, recent searches and suggestions:

```tsx
<Navigation.Search.Root>
  <Navigation.Search.Field value={query} onChangeText={setQuery} />
  <Navigation.Search.Filters>
    <Actions.FilterButton active title="Todos" onPress={() => {}} variant="mobile" />
  </Navigation.Search.Filters>
  <Navigation.Search.FilterSheet
    activeCount={activeFilterCount}
    onApply={applyFilters}
    onClear={clearDraftFilters}
  >
    <FilterFields />
  </Navigation.Search.FilterSheet>
  <Navigation.Search.History items={recent} onRemove={removeRecent} onSelect={setQuery} />
</Navigation.Search.Root>
```

It composes presentation only; the host owns query/filter state, history persistence and
results. Keep `ListViewV2.Header.Search` when its built-in debounced `onSearch` behavior is
preferred. Use `Navigation.AppBar` for back/context and `Navigation.Steps` for sequential
flows rather than adding breadcrumb trails to compact mobile headers.

Story: `Patterns/Collections/Query configuration` exercises actual local filtering,
multiple sorting priorities, grouping levels and saving/loading configurations.

### Native E2E

With Maestro installed and an iOS simulator running Expo Go, start an isolated test server:

```bash
EXPO_PUBLIC_STORYBOOK_TEST=1 npx expo start --port 8082
make storybook-e2e
```

This disables Storybook's on-device chrome for tests without changing the normal server.
The flows verify copy, edit, cancel, failed-save recovery and long-content/dark interaction.
`STORYBOOK_URL` can override the default `exp://127.0.0.1:8082`.
Maestro analytics are disabled by the Makefile target. These flows target Expo Go on iOS;
Android needs a connected device and its appropriate app ID/host configuration.
Tests stop/relaunch Expo Go and switch stories; run them on a dedicated test simulator.
Enlarged-text screenshots are accessibility stress tests, not the default typography.

### Maintained for the long term

Enterprise software lives for years. The screens built with this DS will be in production long after the initial project is delivered. Sincpro's commitment is to maintain API stability, patch what breaks on platform upgrades, and evolve the system without forcing rewrites on consumers.

Changing a behavior that existing apps depend on is a breaking change. We treat it as one. Additions are additive; deprecations are marked and kept for a full major version cycle before removal.

### Presentational only

Components in this package are driven entirely by props and callbacks. There is no routing, no domain state, no API calls. This is intentional: it makes components independently testable in Storybook, reusable across different app architectures, and safe to upgrade without side effects in business logic.

### Token-driven, not hardcoded

No color, no font size, no shadow is hardcoded in a component. Every visual property references a design token — a CSS variable injected at the root. Swapping the entire visual language of an app means changing one token map, not hunting down hex codes across a codebase.

### Compound component API

Related components are grouped into namespaced objects (`Display`, `Form`, `Navigation`, etc.). One import gives access to an entire category, and the namespace makes the relationship between components visible at the call site.

---

## Key Features

### Controlled Form Components

Every interactive input ships a `Controlled*` variant that integrates directly with `react-hook-form`. No wrapper, no boilerplate:

```tsx
import { Form } from "@sincpro/mobile-ui/Form";
import { useForm } from "react-hook-form";

const { control } = useForm<{ email: string; amount: number }>();

<Form.ControlledInput
  control={control}
  name="email"
  label="Email address"
  rules={{ required: "Required" }}
/>
<Form.ControlledMonetaryInput
  control={control}
  name="amount"
  label="Amount (USD)"
/>
```

### Toast Notifications

Queued toast system with promise support — covers the full loading → success / error lifecycle:

```tsx
import { Toast, ToastProvider, useToast } from "@sincpro/mobile-ui/Feedback";

// 1. Wrap the app once (createAppShell does this automatically)
<ToastProvider position="top">{children}</ToastProvider>;

// 2. Call from anywhere in the tree
const toast = useToast();
toast.success("Invoice saved");
toast.promise(sendInvoice(), {
  loading: "Sending…",
  success: "Invoice sent",
  error: "Failed to send",
});

// Compose custom content while keeping the shared toast surface and lifecycle
toast.show({
  render: ({ dismiss, update }) => (
    <>
      <Toast.Icon variant="loading" />
      <Toast.Content>
        <Toast.Title>Syncing catalog</Toast.Title>
        <Toast.Description>Downloading product images…</Toast.Description>
      </Toast.Content>
      <Toast.Action label="Details" onPress={() => update({ message: "Still syncing…" })} />
      <Toast.Close onPress={dismiss} />
    </>
  ),
  variant: "loading",
});
```

Toast cards can also be dismissed with an upward or downward swipe. Custom render content keeps
the shared card surface, safe-area placement, lifecycle, and swipe behavior.

### Bottom Sheet and Dialogs

```tsx
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { ConfirmationProvider, useConfirmationContext } from "@sincpro/mobile-ui/Dialog";

// Controlled sheet — built on RN Modal, no native peer deps
<Sheet visible={open} onClose={() => setOpen(false)} title="Options">
  <Actions.Button onPress={confirm}>Confirm</Actions.Button>
</Sheet>;

// Imperative confirmation
const { confirm } = useConfirmationContext();
const agreed = await confirm({ title: "Delete invoice?", message: "This cannot be undone." });
```

### Multi-Step Wizard

```tsx
import { Wizard, useWizard } from "@sincpro/mobile-ui/views/Wizard";

<Wizard initialStep="customer">
  <Wizard.Step id="customer">
    <CustomerStep />
  </Wizard.Step>
  <Wizard.Step id="items">
    <ItemsStep />
  </Wizard.Step>
  <Wizard.Step id="review">
    <ReviewStep />
  </Wizard.Step>
</Wizard>;

// Inside any step
const { go, back } = useWizard();
go("items");
```

### Data Display

```tsx
import { Display } from "@sincpro/mobile-ui/Display";

<Display.Stat      label="Sales today" value="$12,400" trend="+8%" />
<Display.PriceTag  amount={299.99} currency="USD" />
<Display.KeyValue  label="Order #" value="ORD-8821" copyable />
<Display.Badge     variant="success">Paid</Display.Badge>
<Display.Monetary  amount={1500.00} variant="dataLarge" />
<Display.DataTable columns={cols} rows={rows} />

<Display.AmountSummary.Root currencySymbol="Bs">
  <Display.AmountSummary.Row label="Subtotal" value={120} />
  <Display.AmountSummary.Row label="Delivery" value={8.5} />
  <Display.AmountSummary.Total label="Total" value={128.5} />
</Display.AmountSummary.Root>
```

`AmountSummary` formats and arranges amounts; the app supplies labels, calculations and
business states. `KeyValue copyable` remains the reusable copy affordance for identifiers.
`Actions.Dock` defaults to a fixed bottom action bar. Swipe up on its handle or press
“Más opciones” to reveal additional content above it; the primary action remains fixed.
Swipe down or press “Ocultar opciones” to collapse. Mount it in a full-screen safe-area
container and reserve bottom space in scrolling content. Inside `FormViewV2.Footer`, set
`placement="footer"` to reuse that view's sticky layout. The expanded panel sizes to its
content up to `maxExpandedHeightRatio` (default `0.6`); overflow scrolls inside the panel.

---

## Component Catalog

### Actions

| Component                   | Description                                                                      |
| --------------------------- | -------------------------------------------------------------------------------- |
| `Actions.Button`            | Primary action — gradient, outline, flat, link variants; optional confirm dialog |
| `Actions.IconButton`        | Icon-only tap target — ghost, primary, secondary, tertiary variants              |
| `Actions.FAB`               | Floating Action Button — fixed position, optional label                          |
| `Actions.Dock`              | Fixed primary action with swipe-expandable content and persistent CTA             |
| `Actions.FilterButton`      | Chip-style active/inactive toggle                                                |
| `Actions.FilterButtonGroup` | Horizontal scroll container for filter chips                                     |

### Display

| Component                                     | Description                                            |
| --------------------------------------------- | ------------------------------------------------------ |
| `Display.Badge`                               | Status badge — success, warning, danger, info, neutral |
| `Display.Card`                                | Surface container with optional shadow and padding     |
| `Display.KeyValue`                            | Label + value row, optional clipboard copy             |
| `Display.AmountSummary`                       | Composable monetary rows and total                      |
| `Display.Stat`                                | KPI cell — label, value, optional trend indicator      |
| `Display.StatCard`                            | Card-wrapped KPI                                       |
| `Display.Monetary`                            | Formatted monetary amount using mono typography        |
| `Display.PriceTag`                            | Currency-formatted price with size options             |
| `Display.DataTable`                           | Scrollable table for structured data                   |
| `Display.ListItem`                            | Row with icon, label, sublabel, optional action        |
| `Display.Chip`                                | Compact label tag                                      |
| `Display.Avatar` / `AvatarGroup`              | User avatar, stacked group                             |
| `Display.Icon`                                | Vector icon wrapper (`@expo/vector-icons`)             |
| `Display.StatusDot`                           | Colored presence / state indicator                     |
| `Display.Divider`                             | Horizontal separator                                   |
| `Display.GradientSurface`                     | Container with linear gradient background              |
| `Display.Timeline`                            | Vertical event timeline                                |
| `Display.SwipeableRow`                        | Row with swipe-to-reveal actions                       |
| `Display.Tooltip`                             | Overlay tooltip                                        |
| `Display.CopyableText`                        | Text with one-tap clipboard copy                       |
| `Display.Logo`                                | Brand logo (falls back to `setBranding` value)         |
| `Display.Accordion`                           | Collapsible content section                            |
| `Display.Carousel`                            | Horizontal swipe carousel                              |
| `Display.Story` / `StoryTray` / `StoryViewer` | Stories UI pattern                                     |
| `Display.MediaCard`                           | Card with image or video embed                         |
| `Display.Pattern`                             | Decorative background pattern                          |

### Form

| Component                               | Description                                                         |
| --------------------------------------- | ------------------------------------------------------------------- |
| `Form.TextInput`                        | Text field with label, error, and helper text                       |
| `Form.PasswordInput`                    | Text input with show/hide toggle                                    |
| `Form.PinInput`                         | PIN code entry                                                      |
| `Form.MonetaryInput`                    | Currency input with formatting                                      |
| `Form.QuantitySelector`                 | Integer increment / decrement                                       |
| `Form.FractionalQuantityInput`          | Decimal quantity input                                              |
| `Form.Select`                           | Dropdown select (modal-based)                                       |
| `Form.Dropdown`                         | Inline dropdown menu                                                |
| `Form.RadioButton`                      | Single-select radio option                                          |
| `Form.Checkbox`                         | Multi-select checkbox                                               |
| `Form.Switch`                           | Toggle switch                                                       |
| `Form.Slider`                           | Range slider (`@react-native-community/slider` peer)                |
| `Form.DatePicker`                       | Date picker (`@react-native-community/datetimepicker` peer)         |
| `Form.SearchBar`                        | Search input with clear button                                      |
| `Form.ControlledInput`                  | `TextInput` + react-hook-form                                       |
| `Form.ControlledRadioButton`            | `RadioButton` + react-hook-form                                     |
| `Form.ControlledCheckbox`               | `Checkbox` + react-hook-form                                        |
| `Form.ControlledDropdown`               | `Dropdown` + react-hook-form                                        |
| `Form.ControlledMonetaryInput`          | `MonetaryInput` + react-hook-form                                   |
| `Actions.Button` / `IconButton` / `FAB` | Action components (preferred over deprecated `Form.Button` aliases) |

### Feedback

| Component                       | Description                      |
| ------------------------------- | -------------------------------- |
| `Feedback.Spinner`              | Animated loading spinner         |
| `Feedback.Loading`              | Full-screen loading overlay      |
| `Feedback.Skeleton`             | Content placeholder shimmer      |
| `Feedback.Progress`             | Linear progress bar              |
| `Feedback.ProgressCircle`       | Circular progress indicator      |
| `Feedback.Banner`               | Contextual notification banner   |
| `Feedback.Empty` / `EmptyState` | Empty list or page placeholder   |
| `Feedback.Error`                | Error state with optional retry  |
| `Feedback.PermissionCard`       | Permission request UI            |
| `ToastProvider` / `useToast`    | Queued toast notification system |
| `ErrorBoundary`                 | React error boundary wrapper     |

### Navigation

| Component                         | Description                           |
| --------------------------------- | ------------------------------------- |
| `Navigation.AppBar`               | Top navigation bar with action slots  |
| `Navigation.BottomNav`            | Bottom tab bar                        |
| `Navigation.Header`               | Screen header                         |
| `Navigation.HeaderToolbar`        | Header with left, center, right slots |
| `Navigation.CollapsingHeader`     | Header that collapses on scroll       |
| `Navigation.FloatingBar`          | Floating action bar                   |
| `Navigation.SearchBar`            | Navigation-level search input         |
| `Navigation.Search`               | Compound field, filters, history and filter sheet |
| `Navigation.SegmentedControl`     | Segmented control switcher            |
| `Navigation.Tabs`                 | Tab navigation container              |
| `Navigation.Steps`                | Step indicator / breadcrumb           |
| `Navigation.Menu` / `MenuSection` | Dropdown menu with sections           |

### Dialog

| Component                                         | Description                                   |
| ------------------------------------------------- | --------------------------------------------- |
| `Dialog.BottomSheet`                              | Bottom drawer (RN Modal, no native peer deps) |
| `Dialog.ActionSheet`                              | Action sheet with options list                |
| `Dialog.Confirmation`                             | Confirm / cancel modal                        |
| `Dialog.EditValue`                                | Inline edit value modal                       |
| `Sheet` (direct import)                           | Controlled sheet via `Dialog/Dialog.Sheet`    |
| `ConfirmationProvider` / `useConfirmationContext` | Imperative confirmation API                   |

### Typography

| Component            | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `Typography.Text`    | Main text component — accepts `variant` prop from the full scale |
| `Typography.Heading` | Heading shorthand                                                |

### Primitives

| Component     | Description                 |
| ------------- | --------------------------- |
| `Box`         | NativeWind layout container |
| `Row`         | Horizontal flex             |
| `Stack`       | Vertical flex               |
| `Spacer`      | Flexible space filler       |
| `Pressable`   | Animated press target       |
| `AspectRatio` | Aspect-ratio container      |

### Layouts

| Component            | Description                           |
| -------------------- | ------------------------------------- |
| `Container`          | Padded layout container               |
| `ScrollContainer`    | Scrollable layout wrapper             |
| `GradientContainer`  | Container with gradient background    |
| `PlainLayout`        | Unstyled layout for custom screens    |
| `TabNavigatorLayout` | Layout for tab-based screen structure |

### Views

| Component              | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `ListViewV2`           | Paginated list with filtering and empty states    |
| `FormViewV2`           | Dynamic form view with field management           |
| `AuthFormView`         | Authentication form layout                        |
| `Wizard` / `useWizard` | Multi-step wizard with guards and lifecycle hooks |
| `AppSplashView`        | Branded splash screen with logo and loading state |

### Widgets

| Component               | Description                               |
| ----------------------- | ----------------------------------------- |
| `ScreenHeader`          | Composite screen header widget            |
| `MenuGrid` / `MenuCard` | Grid and card-based navigation menus      |
| `QuickActions`          | Quick action icon grid                    |
| `PromoBanner`           | Swipeable promotional carousel            |
| `PromoModal`            | Promotional modal overlay                 |
| `HomeHeader`            | Home screen hero header                   |
| `GeoPermissionCard`     | Geolocation permission request card       |
| `TimeZoneSelector`      | Timezone picker widget                    |
| `JSONViewer`            | Collapsible JSON tree (debug / dev tools) |

---

## Theme System

All component colors reference CSS variables — never hardcoded values. Swapping the theme rewrites the variables and every component updates without touching any component code.

### Setting the active theme

When using `@sincpro/mobile`, `createAppShell({ theme })` handles this for you. For standalone DS usage:

```tsx
import { setActiveTheme, themeToVars } from "@sincpro/mobile-ui/theme";
import { vars } from "nativewind";

// Set globally
setActiveTheme(MY_DARK_THEME);

// Inject CSS variables into a subtree
const themeStyle = vars(themeToVars(MY_DARK_THEME));
<View style={themeStyle}>{children}</View>;
```

### Reading the theme in components

```tsx
import { useTheme } from "@sincpro/mobile-ui/theme";

function PriceCard() {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.bg.card, borderColor: theme.border.default }} />
  );
}
```

### Defining a custom theme

```tsx
import { extendTheme } from "@sincpro/mobile-ui/theme";

// Deep-merges on top of the DS base theme
const MY_THEME = extendTheme({
  accent: "#00C357",
  primary: "#0B0B0B",
  secondary: "#6B6963",
  bg: {
    page: "#FAFAFA",
    card: "#FFFFFF",
  },
  text: {
    accent: "#006E2E", // text on accent-tinted surfaces
  },
});
```

### ThemeTokens reference

| Group                               | Keys                                                                                                                    |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `primary / secondary / accent`      | Main brand color scales                                                                                                 |
| `bg.*`                              | `page, card, muted, accent, hover, disabled, popover`                                                                   |
| `text.*`                            | `primary, secondary, tertiary, muted, accent, inverse, disabled, onPrimary, onSecondary, onAccent, onDanger, onSuccess` |
| `icon.*`                            | `primary, secondary, tertiary, inverse, disabled`                                                                       |
| `border.*`                          | `default, light, strong, focus`                                                                                         |
| `success / warning / danger / info` | Semantic state colors                                                                                                   |
| `*Light`                            | Tinted backgrounds for each state                                                                                       |
| `ring / input`                      | Focus ring and input border                                                                                             |
| `gradient.*`                        | `primary, accent` — arrays of color stops                                                                               |
| `shadow.*`                          | `sm, md, lg` — React Native shadow objects                                                                              |

---

## Typography System

Typography is built on a **role → family** indirection. Components never hardcode a font family — they resolve `fontFamilies[role]` at render time. Calling `configureFonts` changes the mapping globally with no re-render required.

### Variants

24 predefined text style variants via `Typography.Text`:

```tsx
import { Typography } from "@sincpro/mobile-ui/Typography";

<Typography.Text variant="display">Hero text</Typography.Text>
<Typography.Text variant="h1">Page title</Typography.Text>
<Typography.Text variant="body">Body paragraph at 14px.</Typography.Text>
<Typography.Text variant="data">1,204.50</Typography.Text>         {/* mono, medium weight */}
<Typography.Text variant="overline">SECTION LABEL</Typography.Text> {/* UPPERCASE mono */}
<Typography.Text variant="caption">Metadata</Typography.Text>
<Typography.Text variant="button">Action Label</Typography.Text>
```

| Group       | Variants                             |
| ----------- | ------------------------------------ |
| Display     | `display`                            |
| Headings    | `h1` `h2` `h3` `h4` `h5` `h6`        |
| Body        | `bodyLarge` `body` `bodySmall`       |
| Labels      | `label` `labelSmall`                 |
| Data (mono) | `data` `dataLarge`                   |
| Meta (mono) | `overline` `caption` `captionSmall`  |
| Buttons     | `button` `buttonSmall` `buttonLarge` |
| Legacy      | `title` `subtitle`                   |

### FontRole

Every configurable font slot in the DS:

```
light · regular · medium · semiBold · extraBold    ← body roles   (Inter by default)
mono · monoMedium                                  ← data roles   (Fira Code by default)
titleRegular · titleMedium · title · titleBlack    ← display roles (Inter fallback)
```

`title*` roles default to Inter. Override them with the app's brand display typeface.

### Configuring brand fonts at runtime

```tsx
import { configureFonts, resetFonts } from "@sincpro/mobile-ui/theme/typography";

configureFonts({
  titleRegular: "Satoshi-Regular",
  titleMedium: "Satoshi-Medium",
  title: "Satoshi-Bold",
  titleBlack: "Satoshi-Black",
});

// Reset to defaults — useful in tests and Storybook stories
resetFonts();
```

### Font size scale

| Token  | `px` | Token | `px` |
| ------ | ---- | ----- | ---- |
| `xs`   | 10   | `4xl` | 28   |
| `sm`   | 13   | `5xl` | 32   |
| `base` | 14   | `6xl` | 36   |
| `lg`   | 16   | `7xl` | 48   |
| `xl`   | 18   | `8xl` | 64   |
| `2xl`  | 20   |       |      |
| `3xl`  | 24   |       |      |

### Custom text styles

```tsx
import { createTextStyle, createCustomTextStyle } from "@sincpro/mobile-ui/theme/typography";

// From a named variant with overrides
const errorLabel = createTextStyle("labelSmall", { color: "#FF4D1F" });

// Fully custom
const amountStyle = createCustomTextStyle("4xl", "monoMedium", {
  lineHeight: "none",
  letterSpacing: "tight",
});
```

---

## Motion Tokens

Centralized animation constants so motion feels consistent across every screen — not improvised per component:

```tsx
import { duration, easing, spring } from "@sincpro/mobile-ui/tokens";

// Durations (ms)
duration.instant; // 0    — immediate state swap, no transition
duration.fast; // 120  — micro-interactions (button press, toggle)
duration.normal; // 200  — standard transitions (modal, drawer)
duration.slow; // 320  — large layout shifts
duration.slower; // 480  — onboarding, emphasis animations

// Bezier easing curves
easing.standard; // general purpose
easing.decelerate; // elements entering the screen
easing.accelerate; // elements leaving the screen
easing.emphasized; // expressive, attention-drawing transitions

// Reanimated spring presets
spring.default; // balanced bounce
spring.gentle; // smooth, no overshoot
spring.snappy; // fast with slight bounce
```

Usage with Reanimated:

```tsx
import { withTiming, withSpring } from "react-native-reanimated";
import { duration, easing, spring } from "@sincpro/mobile-ui/tokens";

const opacity = withTiming(1, { duration: duration.normal, easing: easing.decelerate });
const scale = withSpring(1, spring.snappy);
```

---

## Branding

Configure the app logo once. DS components (`Display.Logo`, `Navigation.AppBar`, `AuthFormView`) use it as a fallback when no explicit `source` prop is passed:

```tsx
import { setBranding } from "@sincpro/mobile-ui";

// Call before rendering the tree
setBranding({
  logo: require("../assets/logo.png"),
});
```

When using `@sincpro/mobile`, pass `branding` to `createAppShell` — it calls `setBranding` internally.

---

## Tailwind Setup

The preset ships the full token class set (`bg-primary`, `text-text-secondary`, `border-border-focus`, …) and the NativeWind v4 configuration.

### `tailwind.config.js`

```js
module.exports = {
  presets: [require("@sincpro/mobile-ui/tailwind.preset")],
  content: ["./App.tsx", "./src/**/*.{ts,tsx}", "./node_modules/@sincpro/mobile-ui/**/*.js"],
  theme: {
    extend: {
      // Override font families to match loaded font names
      fontFamily: {
        light: ["Inter_300Light"],
        regular: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        extrabold: ["Inter_800ExtraBold"],
      },
    },
  },
};
```

### Global CSS

Import the DS global stylesheet at the root of the app:

```tsx
import "@sincpro/mobile-ui/theme/globals.css";
```

---

## Import Patterns

### By category subpath — recommended

Best tree-shaking; makes the component's category visible at the call site:

```tsx
import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import { Feedback } from "@sincpro/mobile-ui/Feedback";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Dialog } from "@sincpro/mobile-ui/Dialog";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { Actions } from "@sincpro/mobile-ui/Actions";
```

### Theme and tokens

```tsx
import { useTheme, setActiveTheme, extendTheme, themeToVars } from "@sincpro/mobile-ui/theme";
import { duration, easing, spring, motion } from "@sincpro/mobile-ui/tokens";
```

### Direct component imports

For components outside a namespace:

```tsx
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";
import { ToastProvider, useToast } from "@sincpro/mobile-ui/Feedback";
import { Wizard, useWizard } from "@sincpro/mobile-ui/views/Wizard";
```

### Layout primitives

```tsx
import { Box, Row, Stack, Spacer } from "@sincpro/mobile-ui/primitives";
import Container from "@sincpro/mobile-ui/layouts/Container";
import PlainLayout from "@sincpro/mobile-ui/layouts/PlainLayout";
import TabNavigatorLayout from "@sincpro/mobile-ui/layouts/TabNavigatorLayout";
```

---

## Storybook

Every component in the DS has a Storybook story for on-device preview and manual QA. Run it on simulator or physical device:

```bash
make storybook          # expo start — Expo Go or dev build
make storybook-android  # expo run:android
```

Stories are organized into four groups:

| Group           | Contents                                                |
| --------------- | ------------------------------------------------------- |
| **Foundations** | Tokens, typography scale, color palette, motion         |
| **Components**  | All compound component namespaces                       |
| **Patterns**    | Composed examples (list screen, form screen, auth flow) |
| **Legacy**      | Deprecated components kept for backwards compatibility  |

Stories live in `.rnstorybook/stories/**/*.stories.tsx`. The Storybook harness is excluded from the published package (`files: ["dist", ...]`) and never lands in consumer bundles.

UX is a cross-cutting quality, not another catalog category. Component states live with
their component (`Actions/Button`, `Data Display/CopyableText`, `Inputs/Select`, `Feedback`);
task compositions live under named `Patterns/Forms`, `Patterns/Records`,
`Patterns/Collections`, `Patterns/Views` and `Patterns/Profiles`.
The former `Patterns/UX`, top-level `Views` and `Templates` story IDs changed;
package exports did not. The taxonomy is regression-tested.
Stories that own a full-screen scroll set `parameters.ownsScroll = true`; the canvas does
not wrap them in a second vertical scroll. Other canvases use keyboard-aware scrolling.

---

## Development

| Command              | What it does                                           |
| -------------------- | ------------------------------------------------------ |
| `make build`         | `tsc` + `tsc-alias` → `dist/` (JS + type declarations) |
| `make format`        | Auto-fix: ESLint + Prettier + type-check               |
| `make verify-format` | CI gate — runs `format`, fails if any file changed     |
| `make storybook`     | Start Expo dev server for Storybook                    |
| `make publish`       | Bump version + `npm publish`                           |

After building, copy the dist to consumers in the local monorepo (no symlinks setup):

```bash
cp -r dist/* ../sincpro_mobile_tickets/node_modules/@sincpro/mobile-ui/dist/
```

Architectural decisions, naming conventions, and guardrails: [`AGENTS.md`](AGENTS.md).
