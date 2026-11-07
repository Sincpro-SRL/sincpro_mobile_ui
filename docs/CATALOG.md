# Component catalog — `@sincpro/mobile-ui`

> Grouped by the Storybook taxonomy (Foundations / Components / Patterns / Legacy).
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
| Icons      | `…/icons/*`    | SVG icon set + `Display.Icon` (vector-icons)                                                                       |
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

`Actions.Button` (variants primary/cta/secondary/outline/…), `Actions.IconButton`, `Actions.FAB`, `Actions.Dock`, `Navigation.AppBar.Action`. (`Form.Button` / `Form.IconButton` / `Form.FAB` exist as deprecated aliases.)

Recommended action hierarchy: `primary` for the task's main action, `secondary` for its
alternative, `link` for a quiet action and `outlineDanger` for an explicit destructive
alternative. Existing variants are retained; `primary` and `cta` currently share styling.
Use `accessibleSizing` on buttons/icon buttons for a 48-point minimum, multiline/scaled
button text, and a supplied accessible name for icon-only actions.
`FilterButton variant="mobile"` exposes selected/disabled state, a selected check and
wrapping labels with 48-point targets. `FilterButtonGroup layout="scroll|wrap"` adds
horizontal scrolling or wrapping; the default remains its legacy row layout.
`Actions.Dock` defaults to a fixed bottom bar with a primary action and optional summary.
Swipe up on its handle (or press “Más opciones”) to reveal secondary content above the bar;
the 48-point handle claims touches immediately to prevent ancestor scroll competition.
Expansion uses a native modal with a dim blocking backdrop, safe-area insets and keyboard
avoidance. The content fits `maxExpandedHeightRatio` (default 0.6) and remaining screen
height, then scrolls; the primary action is outside the scrolling panel.
Swipe down, accessible escape, native Back, “Ocultar opciones” or the backdrop close it;
`dismissOnBackdrop={false}` disables only backdrop dismissal.
`expanded` / `onExpandedChange` support host control; `defaultExpanded` initializes
uncontrolled state. The app must provide `SafeAreaProvider`. Keep collapsed fixed placement
outside scroll views and reserve space below list content. `placement="footer"` reuses
`FormViewV2.Footer`'s layout. Slots remount when moving between the screen and modal:
keep drafts and submission state in the host.
See [migration and adoption order](MOBILE_UX_MIGRATION.md).

Recommended action hierarchy: `primary` for the task's main action, `secondary` for its
alternative, `link` for a quiet action and `outlineDanger` for an explicit destructive
alternative. Existing variants are retained; `primary` and `cta` currently share styling.
Use `accessibleSizing` on buttons/icon buttons for a 48-point minimum, multiline/scaled
button text, and a supplied accessible name for icon-only actions.
`FilterButton variant="mobile"` exposes selected/disabled state, a selected check and
wrapping labels with 48-point targets. `FilterButtonGroup layout="scroll|wrap"` adds
horizontal scrolling or wrapping; the default remains its legacy row layout.

### Inputs (`Form`)

`Input`, `TextInput`, `InputField`, `PasswordInput`, `Select`, `Switch`, `Checkbox`, `RadioButton`, `Dropdown`, `MonetaryInput`, `QuantitySelector`, `FractionalQuantityInput`, `PinInput`, `Slider`, `DatePicker` (native picker), `SearchHistory` (recent searches), `FilterButton`, `Controlled*` (react-hook-form).

### Data Display (`Display`)

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

`Display.Image` retains native Image and its original icon-only fallback. Native callbacks,
accessible names, `containerStyle` and `renderError(retry)` are available without replacing
loading behavior. Changing the source resets success/failure/loading; equivalent source
objects preserve state. A retry reloads the same source. Errors log and notify `onError`.
`style` continues to customize the image itself; `containerStyle` styles its frame.

`ExpoImage` is an optional subpath `…/Display/ExpoImage`, not a member of `Display` or the
root barrel. Install `expo-image` in the host with `npx expo install expo-image`.
It forwards Expo Image props: `cachePolicy`, `recyclingKey`, `placeholder`, `contentFit`,
`allowDownscaling`, events and styles, plus NativeWind `className`.
Defaults remain Expo disk caching and no transition. Explicit transitions, animated image
autoplay and SF Symbol effects respect live Reduce Motion. Errors log and notify `onError`;
error/retry UI and cache/privacy policy belong to the host. Set `cachePolicy="none"` where
persistence is inappropriate. Do not prefetch an entire collection or force memory caching.
The existing Image and its consumers are not silently migrated to this optional native peer.

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
This is limited to these components, not a system-wide motion certification.
`useReducedMotion` is available from `…/Feedback` for other host-owned animations.

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

`SegmentedControl accessibleSizing` wraps labels at 14 points with 48-point minimum
targets; legacy labels remain single-line at 12. Group/per-option disabled state, accessible
names/hints, `style`, `optionStyle` and `labelTextProps` support local composition.
Options remain host-controlled and keep selected tab semantics.

`SearchBar accessibleSizing` opts into readable 17-point text and 48-point input/clear
targets. Name search and clear independently with `accessibilityLabel` and
`clearAccessibilityLabel`. Legacy height remains 44.
`suggestions` accepts host-owned items `{id,label,description?}`, `onSelect`, loading,
error/retry and empty copy. Suggestions appear on focus; selecting one does not guess
which field to search or mutate the query. `Navigation.SearchSuggestions` is also composable.
`Navigation.Search.Root` composes the existing `Field`, `Filters`, `FilterSheet`, `History`
and `Suggestions`; it does not own query/filter state or data fetching. Use it in a
`ListViewV2.Header` composition and keep `ListViewV2.Header.SearchHistory` when that
existing list-specific API fits. For hierarchy, prefer `AppBar` back navigation and
`Steps` for sequential flows; generic breadcrumbs are not added because they consume
horizontal space without improving common mobile navigation.

`SearchBar accessibleSizing` opts into readable 17-point text and 48-point input/clear
targets. Name search and clear independently with `accessibilityLabel` and
`clearAccessibilityLabel`. Legacy height remains 44.
`suggestions` accepts host-owned items `{id,label,description?}`, `onSelect`, loading,
error/retry and empty copy. Suggestions appear on focus; selecting one does not guess
which field to search or mutate the query. `Navigation.SearchSuggestions` is also composable.

### Overlays (`Dialog`)

`Sheet` (bottom sheet on RN Modal — subpath `Dialog/Sheet`, swipe-down to close, optional fixed `footer`), `ActionSheet`, `Confirmation` (+`ConfirmationProvider`), `EditValue`.

`NativeSheet` — optional subpath `Dialog/NativeSheet`, backed by Expo 58
`@expo/ui/community/bottom-sheet`. SwiftUI presentation on iOS and Material3 on Android,
with tokenized React Native content, visible close action and scrolling. Requires the optional
`@expo/ui` peer installed in the host. Intentionally absent from root/category barrels.
Its two detents are 60%/90% on iOS; Android uses native partial/expanded states rather than
arbitrary percentages. This is additive; it does not replace `Sheet`.

Use `Sheet showCloseButton` for a visible, named close action; accessible escape is also
supported. Essential swipe actions must have an equivalent visible action:
`SwipeableRow visibleActions` provides a composition slot.

`ActionSheet` uses named actions, 48-point targets, scrollable choices and persistent
cancellation. Theme variables are reapplied inside native modal portals. Stories under
`Patterns/Records/Actions` demonstrate explicit row actions, undo, draft filters and
selection cancellation; do not nest sheets.

`NativeSheet` — optional subpath `Dialog/NativeSheet`, backed by Expo 58
`@expo/ui/community/bottom-sheet`. SwiftUI presentation on iOS and Material3 on Android,
with tokenized React Native content, visible close action and scrolling. Requires the optional
`@expo/ui` peer installed in the host. Intentionally absent from root/category barrels.
Its two detents are 60%/90% on iOS; Android uses native partial/expanded states rather than
arbitrary percentages. This is additive; it does not replace `Sheet`.

Use `Sheet showCloseButton` for a visible, named close action; accessible escape is also
supported. Essential swipe actions must have an equivalent visible action:
`SwipeableRow visibleActions` provides a composition slot.

`ActionSheet` uses named actions, 48-point targets, scrollable choices and persistent
cancellation. Theme variables are reapplied inside native modal portals. Stories under
`Patterns/Records/Actions` demonstrate explicit row actions, undo, draft filters and
selection cancellation; do not nest sheets.

### Layout (`…/layouts`)

`Container`, `ScrollContainer`, `GradientContainer`, `AuthContainer`, `PlainLayout`.

## Patterns

- **Views** (`…/views/*`): `FormViewV2`, `ListViewV2`, `AuthFormView`, `Wizard`, `AppSplashView` — screen templates.
- **Widgets** (`…/widgets`): `MenuGrid`, `MenuCard`, `GeoPermissionCard`, `TimeZoneSelector`, `JSONViewer`, `PromoBanner`, `PromoModal`, `QuickActions`, `HomeHeader`, `ScreenHeader`, `MenuSection`, `CircleButton`.

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

## Legacy (deprecated — `@deprecated`, still exported)

| Piece                                                                              | Replacement                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `Navigation.Header`, `HeaderToolbar`, `widgets.ScreenHeader`, `widgets.HomeHeader` | `Navigation.AppBar`                                     |
| `widgets.CircleButton`                                                             | `Actions.IconButton` / `AppBar.Action`                  |
| `Form.SearchBar`                                                                   | `Navigation.SearchBar`                                  |
| `Form.Button` / `Form.IconButton` / `Form.FAB`                                     | `Actions.Button` / `Actions.IconButton` / `Actions.FAB` |
| `layouts.TabNavigatorLayout`                                                       | `Navigation.BottomNav` + core router layout             |
| `Dialog.BottomSheet` (custom)                                                      | `Dialog.Sheet` (RN Modal)                               |

`*` optional peer (`@react-native-community/slider`, `@react-native-community/datetimepicker`). `@expo/ui` is an optional peer for future native primitives (Switch/ContextMenu). `Dialog.Sheet` needs no native deps (RN Modal).
