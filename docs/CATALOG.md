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

`Actions.Button` (variants primary/cta/secondary/outline/…), `Actions.IconButton`, `Actions.FAB`, `Navigation.AppBar.Action`. (`Form.Button` / `Form.IconButton` / `Form.FAB` exist as deprecated aliases.)

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

`Card`, `Chip`, `Tag`, `Badge`, `Avatar`, `AvatarGroup`, `Accordion`, `ListItem`, `KeyValue`, `DataTable`, `Stat`, `StatCard`, `Rating`, `SwipeableRow`, `SectionHeader`, `Timeline`, `Image`, `Carousel`, `Tooltip`, `StatusDot` (presence), `Divider`, `Monetary`, `Date` (variants `inline`/`withIcon`/`pill` + `relative`), `CopyableText`, `CountRecords`, `Logo`, `Icon`, `IconBadge` (icon + count/dot).

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

`PriceTag`, `ProductCard`.

### Media & Social (`Display`)

`MediaCard`, `MediaEmbed`, `Story`, `StoryTray`, `StoryViewer`.

### Feedback (`Feedback`)

`Loading`, `Spinner`, `Skeleton`, `Progress`, `ProgressCircle`, `Banner`, `Empty`, `EmptyState`, `Error`, `PermissionCard`, `SplashScreen`, `ErrorBoundary`, `ToastProvider` + `useToast` (info/success/warning/danger/**loading**/**promise**).

### Navigation (`Navigation`)

`AppBar` (+`Action`, variants default/large/center), `BottomNav` (+ center FAB), `SearchBar` (pill), `CollapsingHeader`, `FloatingBar`, `Menu` (kebab + separators), `SegmentedControl`, `Tabs`, `Steps`, `RowItem`, `MenuButton` (settings/menu row — `Display.MenuButton`).

`SearchBar accessibleSizing` opts into readable 17-point text and 48-point input/clear
targets. Name search and clear independently with `accessibilityLabel` and
`clearAccessibilityLabel`. Legacy height remains 44.
`suggestions` accepts host-owned items `{id,label,description?}`, `onSelect`, loading,
error/retry and empty copy. Suggestions appear on focus; selecting one does not guess
which field to search or mutate the query. `Navigation.SearchSuggestions` is also composable.

### Overlays (`Dialog`)

`Sheet` (bottom sheet on RN Modal — subpath `Dialog/Sheet`, swipe-down to close), `ActionSheet`, `Confirmation` (+`ConfirmationProvider`), `EditValue`.

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
