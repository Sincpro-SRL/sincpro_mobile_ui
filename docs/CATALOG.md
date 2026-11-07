# Component catalog — `@sincpro/mobile-ui`

> Grouped by the Storybook taxonomy (Foundations / Components / Patterns).
> Import: `import { Display } from "@sincpro/mobile-ui/Display"` (namespace) unless a subpath is noted.

The [manifesto](./MANIFESTO.md) defines the permanent objective: composable behavior and
customizable presentation, with original defaults preserved. A missing styling/content
hook is an API limitation, not a reason to require a fork or a new visual system.

## Foundations

| Piece      | Import         | What it is                                                                                                         |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| Theme      | `…/theme`      | `DEFAULT_THEME`, `DEFAULT_DARK_THEME`, `useTheme()`, `setActiveTheme`, `defineTheme`, `themeToVars`, `theme` const |
| Tokens     | `…/tokens`     | `motion` (duration/easing/spring). zIndex/opacity are preset classes                                               |
| Typography | `…/Typography` | `Typography.Text`, `Typography.Heading`                                                                            |
| Icons      | `…/Display`    | `Display.Icon`, `IconName`, `ICON_MAP`: SF Symbols on iOS, Material on Android; branding SVGs separately             |
| Primitives | `…/primitives` | `Box`, `Row`, `Stack`, `Pressable`, `Spacer`, `AspectRatio`, `BaseButton`                                          |

## Components

### Typography

`Typography.Text`, `Typography.Heading`, `Typography.SelectableText`.
`SelectableText value` uses a read-only multiline native control with range handles and no
keyboard, preserving configured fonts and tokens. Use it for passages where selecting a
fragment matters. On iOS, `Text selectable` only offers full-paragraph copying.
`variant="bodyReadable"` opts Text/SelectableText into 17-point body text with live configured
fonts and system scaling. Legacy `body` remains 14.

### Actions

`Actions.Button` (variants primary/cta/secondary/outline/…), `Actions.IconButton`, `Actions.FAB`, `Actions.Dock`, `Navigation.AppBar.Action`.
`confirm` uses native Alert and needs no provider. Rich confirmation content uses
`Dialog.Confirmation` or the explicitly mounted `ConfirmationProvider`.

Recommended action hierarchy: `primary` for the task's main action, `secondary` for its
alternative, `link` for a quiet action and `outlineDanger` for an explicit destructive
alternative. Existing variants are retained; `primary` and `cta` currently share styling.
Buttons/icon buttons use a 48-point minimum and multiline/scaled button text by default.
Supply an accessible name for icon-only actions; the `accessibleSizing` prop was removed in v2.
`FilterButton variant="mobile"` exposes selected/disabled state, a selected check and
wrapping labels with 48-point targets. `FilterButtonGroup layout="scroll|wrap"` adds
horizontal scrolling or wrapping; the default remains its legacy row layout.
`Actions.Dock` defaults to a fixed bottom bar with a primary action and optional summary.
Press “Más opciones” to reveal secondary content in the canonical Expo sheet.
Expansion delegates gestures, Back and native presentation to `Dialog.Sheet`; use
`snapPoints` for detents and `dismissible` to control native dismissal.
`expanded` / `onExpandedChange` support host control; `defaultExpanded` initializes
uncontrolled state. The app must provide `SafeAreaProvider`. Keep collapsed fixed placement
outside scroll views and reserve space below list content. `placement="footer"` reuses
`FormViewV2.Footer`'s layout. Slots remount when moving between the screen and modal:
keep drafts and submission state in the host.
See [migration and adoption order](MOBILE_UX_MIGRATION.md).

Recommended action hierarchy: `primary` for the task's main action, `secondary` for its
alternative, `link` for a quiet action and `outlineDanger` for an explicit destructive
alternative. Existing variants are retained; `primary` and `cta` currently share styling.
Buttons/icon buttons use a 48-point minimum and multiline/scaled button text by default.
Supply an accessible name for icon-only actions; the `accessibleSizing` prop was removed in v2.
`FilterButton variant="mobile"` exposes selected/disabled state, a selected check and
wrapping labels with 48-point targets. `FilterButtonGroup layout="scroll|wrap"` adds
horizontal scrolling or wrapping; the default remains its legacy row layout.

### Inputs (`Form`)

`Input`, `TextInput`, `InputField`, `PasswordInput`, `Select`, `Switch`, `Checkbox`, `RadioButton`, `Dropdown`, `MonetaryInput`, `QuantitySelector`, `FractionalQuantityInput`, `PinInput`, `Slider`, `DatePicker` (Expo native picker), `SearchHistory` (recent searches), `Controlled*` (react-hook-form).
Action filters live in `Actions`, search in `Navigation`.

### Data Display (`Display`)

`Carousel` provides previous/next actions and a localized page label for short
collections. `index`/`onIndexChange` support controlled navigation, including restoring
rejected native swipes. Measured end spacing supports narrow cards and the final snap.
`renderControls` receives validated navigation actions; it owns the custom controls'
names/disabled states. Root native props, content/item/dot styles and text props keep
the appearance open. Snap geometry belongs to `itemWidth`/`gap`, not `itemStyle`.
It is a ScrollView, not a replacement for large virtualized lists.

`Card`, `Chip`, `Tag`, `Badge`, `Avatar`, `AvatarGroup`, `Accordion`, `ListItem`, `KeyValue`, `AmountSummary`, `DataTable`, `Stat`, `StatCard`, `Rating`, `SwipeableRow`, `SectionHeader`, `Timeline`, `Image`, `Carousel`, `Tooltip`, `StatusDot` (presence), `Divider`, `Monetary`, `Date` (variants `inline`/`withIcon`/`pill` + `relative`), `CopyableText`, `CountRecords`, `Logo`, `Icon`, `IconBadge` (icon + count/dot).

`CopyableText` presents short values as tap-to-copy text with a familiar copy icon,
pending spinner and transient checkmark without layout shift. `selectable` preserves native
selection of longer text and separates the full-copy action; failures remain visible/retryable
and results are announced. `KeyValue copyable` requires a string or number and forwards
`selectable`; `align="auto"` stacks on narrow screens or enlarged text.
`SectionHeader` exposes header semantics.
`AmountSummary.Root` composes `Row` and `Total` using `Display.Monetary`; set the currency
at the root or per row. It presents values only—calculations, business labels and status
remain in the consuming app. `KeyValue copyable` already covers copying identifiers and
other scalar fields; do not build a second copy control for those rows.

`ListGroup` groups short settings/data lists using a title, optional description/action/footer,
one inset surface or `surface="plain"`, and hairline separators between direct children.
No shadows or per-row cards. Customize `className`, `contentClassName`, slots,
`separators`, `headerProps` and `footerTextProps`; colors inherit existing theme variables.
Default header is 16 points, description/footer 13, preserving distinct reading roles.
Use one direct child per row; a Fragment counts as one child, not a list of rows.
Use FlatList/SectionList for large collections, not this non-virtualized wrapper.

`ListItem variant="mobile"` opts into regular 14-point titles/values, 13-point help, wrapping, 48-point
actions and tonal press highlighting instead of opacity/scale feedback. `value`, `disabled`,
`accessibilityHint` and `layout="auto|row|stacked"` support navigation/settings rows.
Auto stacks accessories below text on screens under 360 points or font scales above 1.3;
choose stacked explicitly for narrow embedded containers. A trailing control belongs in
a row without `onPress`. Existing legacy ListItem defaults stay unchanged.
`density="comfortable"` explicitly selects the earlier 17/16-point mobile presentation.
Container `style` and `titleTextProps`/`subtitleTextProps`/`valueTextProps` allow local fonts,
sizes, colors and weight without replacing interaction logic.
Mobile rows omit their own dividers so ListGroup can manage them; `showDivider` explicitly
enables a standalone row divider when needed.
`SectionHeader variant="mobile"` uses the same reading variant.
Header title/subtitle text props can override its type roles; header semantics stay intact.
Group `style`, `contentStyle` and `separatorStyle` expose local spacing, shape and separators.
Header `style`, `contentStyle`, `actionStyle` and `actionTextProps` expose its layout and action.
`Foundations/Typography` includes compact/comfortable hierarchy examples with identical content.
Icons without an explicit color follow live theme changes; consumer-supplied colors/custom
icon renderers retain control.

`CopyableText` presents short values as tap-to-copy text with a familiar copy icon,
pending spinner and transient checkmark without layout shift. `selectable` preserves native
selection of longer text and separates the full-copy action; failures remain visible/retryable
and results are announced. `KeyValue copyable` requires a string or number and forwards
`selectable`; `align="auto"` stacks on narrow screens or enlarged text.
`SectionHeader` exposes header semantics.

`ListGroup` groups short settings/data lists using a title, optional description/action/footer,
one inset surface or `surface="plain"`, and hairline separators between direct children.
No shadows or per-row cards. Customize `className`, `contentClassName`, slots,
`separators`, `headerProps` and `footerTextProps`; colors inherit existing theme variables.
Default header is 16 points, description/footer 13, preserving distinct reading roles.
Use one direct child per row; a Fragment counts as one child, not a list of rows.
Use FlatList/SectionList for large collections, not this non-virtualized wrapper.

`ListItem variant="mobile"` opts into regular 14-point titles/values, 13-point help, wrapping, 48-point
actions and tonal press highlighting instead of opacity/scale feedback. `value`, `disabled`,
`accessibilityHint` and `layout="auto|row|stacked"` support navigation/settings rows.
Auto stacks accessories below text on screens under 360 points or font scales above 1.3;
choose stacked explicitly for narrow embedded containers. A trailing control belongs in
a row without `onPress`. Existing legacy ListItem defaults stay unchanged.
`density="comfortable"` explicitly selects the earlier 17/16-point mobile presentation.
Container `style` and `titleTextProps`/`subtitleTextProps`/`valueTextProps` allow local fonts,
sizes, colors and weight without replacing interaction logic.
Mobile rows omit their own dividers so ListGroup can manage them; `showDivider` explicitly
enables a standalone row divider when needed.
`SectionHeader variant="mobile"` uses the same reading variant.
Header title/subtitle text props can override its type roles; header semantics stay intact.
Group `style`, `contentStyle` and `separatorStyle` expose local spacing, shape and separators.
Header `style`, `contentStyle`, `actionStyle` and `actionTextProps` expose its layout and action.
`Foundations/Typography` includes compact/comfortable hierarchy examples with identical content.
Icons without an explicit color follow live theme changes; consumer-supplied colors/custom
icon renderers retain control.

### Commerce (`Display`)

`Display.Image` uses Expo Image and its original icon-only fallback. Expo callbacks,
accessible names, `containerStyle` and `renderError(retry)` are available without replacing
loading behavior. Changing the source resets success/failure/loading; equivalent source
objects preserve state. A retry reloads the same source. Errors log and notify `onError`.
`style` continues to customize the image itself; `containerStyle` styles its frame.

`Display.ExpoImage` is the common direct renderer, also exported by `…/Display/ExpoImage`.
Install the required `expo-image` peer in the host with `npx expo install expo-image`.
It forwards Expo Image props: `cachePolicy`, `recyclingKey`, `placeholder`, `contentFit`,
`allowDownscaling`, events and styles, plus NativeWind `className`.
Defaults remain Expo disk caching and no transition. Explicit transitions, animated image
autoplay and SF Symbol effects respect live Reduce Motion. Errors log and notify `onError`;
error/retry UI and cache/privacy policy belong to the host. Set `cachePolicy="none"` where
persistence is inappropriate. Do not prefetch an entire collection or force memory caching.
v2 migrates logos, product/media thumbnails, stories, splash logos and empty illustrations
to this renderer. `resizeMode` is replaced by `contentFit`; events use Expo payloads, not
`nativeEvent`. Recycling identity defaults to the source identity, including native shared
image references without serializing them. SVG texture images retain their SVG renderer.
See [migration v2](./MIGRATION-V2.md).

`PriceTag`, `ProductCard`.

### Media & Social (`Display`)

`MediaCard`, `MediaEmbed`, `Story`, `StoryTray`, `StoryViewer`.

### Feedback (`Feedback`)

`Loading`, `Spinner`, `Skeleton`, `Progress`, `ProgressCircle`, `Banner`, `Empty`, `EmptyState`, `Error`, `PermissionCard`, `SplashScreen`, `ErrorBoundary`, `ToastProvider` + `useToast` (info/success/warning/danger/**loading**/**promise**) with composable `Toast` slots, a custom render callback, and upward/downward swipe dismissal.

`Skeleton`, `Progress` (indeterminate), `Spinner` and `Loading` respect the live system
Reduce Motion preference. `animated={false}` explicitly opts out; `true` never overrides
the system setting. Indicators start static until the asynchronous preference is known;
lookup failures warn and leave motion disabled. Skeletons remain hidden from screen readers.
Static loading indicators retain their shape and busy semantics, not an invented percentage.
RN sheet/selection transitions, modal overlays, carousel navigation, dock, menus,
accordion and toast now also follow the live setting. Gestures remain usable.
The shared preference store makes one native request/listener for active consumers,
ignores stale queries, and releases the listener after the last consumer leaves.
This is not a system-wide motion certification, especially for custom renderers or
the optional native Sheet engine.
`useReducedMotion` is available from `…/Feedback` for other host-owned animations.

`DomainSplashScreen` waits for real loading completion and `minDuration`, never inventing
a percentage or hiding while `isLoading` remains true. Children stay mounted with input/
accessibility blocked under the overlay. Completion is once per cycle with timer/animation
cleanup. `renderLoading`, root/overlay styles and native test ID customize presentation.
`Toast.Root`, `Toast.Action` and `Toast.Close` expose native props/styles; default temporary
toasts include a visible close alternative and Escape dismissal. Theme and transitions
update live. Custom toast renderers own their close alternative.

`Spinner` uses `text` as its accessible name (fallback "Cargando"); `accessibilityLabel`
overrides it. `Loading` forwards that name, `animated` and `testID` to its indicator.
Both progress shapes accept `accessibilityLabel`, `accessibilityHint`, native view props,
`className` and `style`. Progress accepts `indicatorClassName` / `indicatorStyle` independently
of the track. Values remain fractions from 0 to 1; finite out-of-range values clamp.
Non-finite determinate values throw a descriptive RangeError rather than rendering invalid
geometry or announcing NaN. Indeterminate Progress omits the percentage and exposes busy.
Spinner and ProgressCircle default colors follow live theme changes; explicit colors stay
consumer-controlled. No automatic live announcements on every progress update.

### Navigation (`Navigation`)

`AppBar` (+`Action`, variants default/large/center), `BottomNav` (+ center FAB), `SearchBar` (pill), `Search` (compound field, filter chips, advanced filter sheet, history and suggestions), `CollapsingHeader`, `FloatingBar`, `Menu` (kebab + separators), `SegmentedControl`, `Tabs`, `Steps`, `RowItem`, `MenuButton` (settings/menu row — `Display.MenuButton`).

`SegmentedControl` wraps labels at 14 points with 48-point minimum targets by default.
The old single-line 12-point mode was removed. Group/per-option disabled state, accessible
names/hints, `style`, `optionStyle` and `labelTextProps` support local composition.
Options remain host-controlled and keep selected tab semantics.

`SearchBar` uses readable 17-point text and 48-point input/clear
targets. Name search and clear independently with `accessibilityLabel` and
`clearAccessibilityLabel`. There is no legacy 44-point mode.
`suggestions` accepts host-owned items `{id,label,description?}`, `onSelect`, loading,
error/retry and empty copy. Suggestions appear on focus; selecting one does not guess
which field to search or mutate the query. `Navigation.SearchSuggestions` is also composable.
`Navigation.Search.Root` composes the existing `Field`, `Filters`, `FilterSheet`, `History`
and `Suggestions`; it does not own query/filter state or data fetching. Use it in a
`ListViewV2.Header` composition and keep `ListViewV2.Header.SearchHistory` when that
existing list-specific API fits. For hierarchy, prefer `AppBar` back navigation and
`Steps` for sequential flows; generic breadcrumbs are not added because they consume
horizontal space without improving common mobile navigation.

`SearchBar` uses readable 17-point text and 48-point input/clear
targets. Name search and clear independently with `accessibilityLabel` and
`clearAccessibilityLabel`. There is no legacy 44-point mode.
`suggestions` accepts host-owned items `{id,label,description?}`, `onSelect`, loading,
error/retry and empty copy. Suggestions appear on focus; selecting one does not guess
which field to search or mutate the query. `Navigation.SearchSuggestions` is also composable.

### Overlays (`Dialog`)

`Sheet` — subpath `Dialog/Sheet`, backed by `@expo/ui/community/bottom-sheet`.
This is the only sheet implementation; `@expo/ui` is a required peer.
Use `visible/onClose`, optional `title/footer/snapPoints/dismissible`, and
`scrollable={false}` when content owns a FlashList. Native Back and swipe dismissal
return control through `onClose`; the visible close action is built in.

`ActionSheet`, rich `Confirmation` (+`ConfirmationProvider`) and `EditValue` compose
this sheet. Simple confirmations use `requestConfirmation` (native Alert).
`EditValue` commits through `onConfirm(value)` and cancels through `onClose`.
Supply `onChange` with staged `value` for controlled drafts, `{key,label,value}` options
for presets, or `footerAdornment` for additive actions; persistence remains in the host.
Theme variables are reapplied inside native portals.
Stories under `Patterns/Records/Actions` demonstrate explicit row actions, undo, draft
filters and selection cancellation; do not nest sheets.
Essential swipe actions need an equivalent visible action:
`SwipeableRow visibleActions` provides a composition slot.

### Layout (`…/layouts`)

`Container`, `ScrollContainer`, `GradientContainer`, `AuthContainer`, `PlainLayout`.
Container/ScrollContainer default to left/right safe area; the header owns top,
and the host tab bar owns bottom. Standalone auth owns all edges by default.
All system bars belong to the host, never to these layouts.

## Patterns

- **Views** (`…/views/*`): `FormViewV2`, `ListViewV2`, `AuthFormView`, `Wizard`, `AppSplashView` — screen templates.
- **Widgets** (`…/widgets`): `TimeZoneSelectorModal`, `JSONViewer`, `PromoBanner`, `PromoModal`, `QuickActions`.
  MenuGrid/MenuCard/CircleButton live in Display; MenuSection lives in Navigation.

`FilterBar` (`…/widgets` or named export from `…/widgets/FilterBar`) composes optional search,
quick chips, an advanced-filter action, results and clear. Controlled `filters` contain
`id`, `label`, `selected`, optional `disabled`; `onFilterPress(id)` leaves data/state to
the host. `onClearFilters` clears filters only, not the query. Customize labels, classes,
theme and layout; auto wraps above font scale 1.3, otherwise scrolls horizontally.
It does not fetch, filter, paginate or own advanced drafts.
`Patterns/Collections/Browsing` demonstrates rows/cards, fixed 56-point decorative
artwork, icon fallbacks, metrics, independent open/save actions, actual local filtering,
empty recovery and staged advanced filters. Adapt or replace any part of the recipe.

`FilterBuilder` edits configured text/number/date/choice conditions and nested
all/any/none groups, with single-group drill-down instead of excessive mobile indentation.
Operators and value arity come from field metadata. Invalid values remain recoverable.
`CollectionOptions` combines its draft with multi-field sorting, ordered group levels,
and callback-owned saved configurations in a full-screen keyboard-aware workspace.
Load does not apply; Cancel discards and Apply commits. The host owns data execution,
persistence and backend adapters. No relational model explorer or JSON editor is provided.
Story: `Patterns/Collections/Query configuration`.

`Form.KeyboardForm` combines an aware scroll, scoped native input group and named
previous/next/dismiss toolbar. `Form.KeyboardToolbar` is separately composable.
Requires a root KeyboardProvider and a runtime with keyboard-controller included.
Existing `FormViewV2.Content`, `AuthFormView` and `AuthContainer` opt in with
`keyboardToolbar`; existing defaults are preserved. Avoid nesting vertical scrolls.
Story: `Patterns/Forms/Keyboard navigation`.

`Form.ErrorSummary` presents ordered validation errors and requires
`onSelectError(id)` for native field focus. Match inline messages and keep field drafts
controlled; `KeyboardForm` handles the focused input/keyboard viewport.
Header/error content slots, native root props, item styles and text overrides customize appearance while
the summary retains selection semantics and 48-point targets. First appearance announces;
editing ongoing errors does not repeatedly interrupt typing. `announce={false}` supports
hosts already announcing their validation result.
Story: `Patterns/Forms/Validation` includes default/custom content and retained drafts.

### Controlled reordering (optional widget)

`widgets/ReorderableList` is imported by its own subpath, **not** the general widgets
barrel. Optional peer `react-native-sortables` uses the host's Gesture Handler/Reanimated
runtime. It supports a controlled, variable-height single-column short list with a drag
handle, up/down alternatives, native adjustable actions and immutable order events.

`renderItem` owns arbitrary content; `renderControls`/`renderHandleContent` customize
controls without replacing the gesture engine. Root/item/content/controls/handle/action
styles, localized labels and `sortableProps` remain public. See the README contract,
especially stable keys, synchronous controlled updates, autoscroll refs and external
changes during drag. No persistence or business rules live in the widget.

`Patterns/Collections/Reordering` includes default/custom/long/conflict examples.
Not a virtualized list or a universal cross-container drag framework.

## APIs removed in the SDK 58 major

| Piece                                                                              | Replacement                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `Navigation.Header`, `HeaderToolbar`, `widgets.ScreenHeader`, `widgets.HomeHeader` | `Navigation.AppBar`                                     |
| `widgets.CircleButton`                                                             | `Actions.IconButton` / `AppBar.Action`                  |
| `Form.SearchBar`                                                                   | `Navigation.SearchBar`                                  |
| `Form.Button` / `Form.IconButton` / `Form.FAB`                                     | `Actions.Button` / `Actions.IconButton` / `Actions.FAB` |
| `layouts.TabNavigatorLayout`                                                       | Navegador del host                                     |
| `Dialog.BottomSheet`, `Dialog.NativeSheet`                                         | `Dialog.Sheet` (`@expo/ui`)                             |

Native controls use the required `@expo/ui` peer, symbols `expo-symbols`, and long lists
FlashList v2. Storybook's shell still requires Gorhom as a development-only peer;
the on-device controls addon was removed because it requires the obsolete community
slider/date picker. Component demonstrations remain interactive through story state.
