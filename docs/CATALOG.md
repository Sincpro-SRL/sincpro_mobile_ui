# Component catalog — `@sincpro/mobile-ui`

> Grouped by the Storybook taxonomy (Foundations / Components / Patterns / Legacy).
> Import: `import { Display } from "@sincpro/mobile-ui/Display"` (namespace) unless a subpath is noted.

## Foundations

| Piece      | Import         | What it is                                                                                                         |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| Theme      | `…/theme`      | `DEFAULT_THEME`, `DEFAULT_DARK_THEME`, `useTheme()`, `setActiveTheme`, `defineTheme`, `themeToVars`, `theme` const |
| Tokens     | `…/tokens`     | `motion` (duration/easing/spring). zIndex/opacity are preset classes                                               |
| Typography | `…/Typography` | `Typography.Text`, `Typography.Heading`                                                                            |
| Icons      | `…/icons/*`    | SVG icon set + `Display.Icon` (vector-icons)                                                                       |
| Primitives | `…/primitives` | `Box`, `Row`, `Stack`, `Pressable`, `Spacer`, `AspectRatio`, `BaseButton`                                          |

## Components

### Actions

`Form.Button` (variants primary/cta/secondary/outline/…), `Form.IconButton`, `Form.FAB`, `Navigation.AppBar.Action`.

### Inputs (`Form`)

`Input`, `TextInput`, `InputField`, `PasswordInput`, `Select`, `Switch`, `Checkbox`, `RadioButton`, `Dropdown`, `MonetaryInput`, `QuantitySelector`, `FractionalQuantityInput`, `PinInput`, `Slider`, `DatePicker` (native picker), `SearchHistory` (recent searches), `FilterButton`, `Controlled*` (react-hook-form).

### Data Display (`Display`)

`Card`, `Chip`, `Tag`, `Badge`, `Avatar`, `AvatarGroup`, `Accordion`, `ListItem`, `KeyValue`, `DataTable`, `Stat`, `StatCard`, `Rating`, `SwipeableRow`, `SectionHeader`, `Timeline`, `Image`, `Carousel`, `Tooltip`, `StatusDot` (presence), `Divider`, `Monetary`, `Date` (variants `inline`/`withIcon`/`pill` + `relative`), `CopyableText`, `CountRecords`, `Logo`, `Icon`, `IconBadge` (icon + count/dot).

### Commerce (`Display`)

`PriceTag`, `ProductCard`.

### Media & Social (`Display`)

`MediaCard`, `MediaEmbed`, `Story`, `StoryTray`, `StoryViewer`.

### Feedback (`Feedback`)

`Loading`, `Spinner`, `Skeleton`, `Progress`, `ProgressCircle`, `Banner`, `Empty`, `EmptyState`, `Error`, `PermissionCard`, `SplashScreen`, `ErrorBoundary`, `ToastProvider` + `useToast` (info/success/warning/danger/**loading**/**promise**).

### Navigation (`Navigation`)

`AppBar` (+`Action`, variants default/large/center), `BottomNav` (+ center FAB), `SearchBar` (pill), `CollapsingHeader`, `FloatingBar`, `Menu` (kebab + separators), `SegmentedControl`, `Tabs`, `Steps`, `RowItem`, `MenuButton` (settings/menu row — `Display.MenuButton`).

### Overlays (`Dialog`)

`Sheet` (bottom sheet on RN Modal — subpath `Dialog/Sheet`, swipe-down to close), `ActionSheet`, `Confirmation` (+`ConfirmationProvider`), `EditValue`.

### Layout (`…/layouts`)

`Container`, `ScrollContainer`, `GradientContainer`, `AuthContainer`, `PlainLayout`.

## Patterns

- **Views** (`…/views/*`): `FormViewV2`, `ListViewV2`, `AuthFormView`, `Wizard` — screen templates.
- **Widgets** (`…/widgets`): `MenuGrid`, `MenuCard`, `GeoPermissionCard`, `TimeZoneSelector`, `JSONViewer`.

## Legacy (deprecated — `@deprecated`, still exported)

| Piece                                                                              | Replacement                                 |
| ---------------------------------------------------------------------------------- | ------------------------------------------- |
| `Navigation.Header`, `HeaderToolbar`, `widgets.ScreenHeader`, `widgets.HomeHeader` | `Navigation.AppBar`                         |
| `widgets.CircleButton`                                                             | `Form.IconButton` / `AppBar.Action`         |
| `Form.SearchBar`                                                                   | `Navigation.SearchBar`                      |
| `layouts.TabNavigatorLayout`                                                       | `Navigation.BottomNav` + core router layout |
| `Dialog.BottomSheet` (custom)                                                      | `Dialog.Sheet` (RN Modal)                   |

`*` optional peer (`@react-native-community/slider`, `@react-native-community/datetimepicker`). `@expo/ui` is an optional peer for future native primitives (Switch/ContextMenu). `Dialog.Sheet` needs no native deps (RN Modal).
