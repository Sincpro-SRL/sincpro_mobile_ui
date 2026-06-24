# @sincpro/mobile-ui

**Sincpro Mobile Design System** — the UI contract between design and engineering for React Native / Expo SDK 56 applications.

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
  content: [
    "./App.tsx",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@sincpro/mobile-ui/**/*.js",
  ],
};
```

```tsx
import { Display } from "@sincpro/mobile-ui/Display";
import { Form }    from "@sincpro/mobile-ui/Form";
import { useToast, ToastProvider } from "@sincpro/mobile-ui/Feedback";

export default function InvoiceScreen() {
  const toast = useToast();
  return (
    <Display.Card>
      <Display.KeyValue label="Invoice #" value="INV-0042" copyable />
      <Display.Monetary amount={1500.00} variant="dataLarge" />
      <Form.Button onPress={() => toast.success("Invoice sent")}>
        Send Invoice
      </Form.Button>
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
import { ToastProvider, useToast } from "@sincpro/mobile-ui/Feedback";

// 1. Wrap the app once (createAppShell does this automatically)
<ToastProvider position="top">{children}</ToastProvider>

// 2. Call from anywhere in the tree
const toast = useToast();
toast.success("Invoice saved");
toast.promise(sendInvoice(), {
  loading: "Sending…",
  success: "Invoice sent",
  error:   "Failed to send",
});
```

### Bottom Sheet and Dialogs

```tsx
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { ConfirmationProvider, useConfirmationContext } from "@sincpro/mobile-ui/Dialog";

// Controlled sheet — built on RN Modal, no native peer deps
<Sheet visible={open} onClose={() => setOpen(false)} title="Options">
  <Form.Button onPress={confirm}>Confirm</Form.Button>
</Sheet>

// Imperative confirmation
const { confirm } = useConfirmationContext();
const agreed = await confirm({ title: "Delete invoice?", message: "This cannot be undone." });
```

### Multi-Step Wizard

```tsx
import { Wizard, useWizard } from "@sincpro/mobile-ui/views/Wizard";

<Wizard initialStep="customer">
  <Wizard.Step id="customer"><CustomerStep /></Wizard.Step>
  <Wizard.Step id="items"><ItemsStep /></Wizard.Step>
  <Wizard.Step id="review"><ReviewStep /></Wizard.Step>
</Wizard>

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
```

---

## Component Catalog

### Actions

| Component | Description |
|-----------|-------------|
| `Actions.Button` | Primary action — gradient, outline, flat, link variants; optional confirm dialog |
| `Actions.IconButton` | Icon-only tap target — ghost, primary, secondary, tertiary variants |
| `Actions.FAB` | Floating Action Button — fixed position, optional label |
| `Actions.FilterButton` | Chip-style active/inactive toggle |
| `Actions.FilterButtonGroup` | Horizontal scroll container for filter chips |

### Display

| Component | Description |
|-----------|-------------|
| `Display.Badge` | Status badge — success, warning, danger, info, neutral |
| `Display.Card` | Surface container with optional shadow and padding |
| `Display.KeyValue` | Label + value row, optional clipboard copy |
| `Display.Stat` | KPI cell — label, value, optional trend indicator |
| `Display.StatCard` | Card-wrapped KPI |
| `Display.Monetary` | Formatted monetary amount using mono typography |
| `Display.PriceTag` | Currency-formatted price with size options |
| `Display.DataTable` | Scrollable table for structured data |
| `Display.ListItem` | Row with icon, label, sublabel, optional action |
| `Display.Chip` | Compact label tag |
| `Display.Avatar` / `AvatarGroup` | User avatar, stacked group |
| `Display.Icon` | Vector icon wrapper (`@expo/vector-icons`) |
| `Display.StatusDot` | Colored presence / state indicator |
| `Display.Divider` | Horizontal separator |
| `Display.GradientSurface` | Container with linear gradient background |
| `Display.Timeline` | Vertical event timeline |
| `Display.SwipeableRow` | Row with swipe-to-reveal actions |
| `Display.Tooltip` | Overlay tooltip |
| `Display.CopyableText` | Text with one-tap clipboard copy |
| `Display.Logo` | Brand logo (falls back to `setBranding` value) |
| `Display.Accordion` | Collapsible content section |
| `Display.Carousel` | Horizontal swipe carousel |
| `Display.Story` / `StoryTray` / `StoryViewer` | Stories UI pattern |
| `Display.MediaCard` | Card with image or video embed |
| `Display.Pattern` | Decorative background pattern |

### Form

| Component | Description |
|-----------|-------------|
| `Form.TextInput` | Text field with label, error, and helper text |
| `Form.PasswordInput` | Text input with show/hide toggle |
| `Form.PinInput` | PIN code entry |
| `Form.MonetaryInput` | Currency input with formatting |
| `Form.QuantitySelector` | Integer increment / decrement |
| `Form.FractionalQuantityInput` | Decimal quantity input |
| `Form.Select` | Dropdown select (modal-based) |
| `Form.Dropdown` | Inline dropdown menu |
| `Form.RadioButton` | Single-select radio option |
| `Form.Checkbox` | Multi-select checkbox |
| `Form.Switch` | Toggle switch |
| `Form.Slider` | Range slider (`@react-native-community/slider` peer) |
| `Form.DatePicker` | Date picker (`@react-native-community/datetimepicker` peer) |
| `Form.SearchBar` | Search input with clear button |
| `Form.ControlledInput` | `TextInput` + react-hook-form |
| `Form.ControlledRadioButton` | `RadioButton` + react-hook-form |
| `Form.ControlledCheckbox` | `Checkbox` + react-hook-form |
| `Form.ControlledDropdown` | `Dropdown` + react-hook-form |
| `Form.ControlledMonetaryInput` | `MonetaryInput` + react-hook-form |
| `Form.Button` / `IconButton` / `FAB` | Action components in Form namespace |

### Feedback

| Component | Description |
|-----------|-------------|
| `Feedback.Spinner` | Animated loading spinner |
| `Feedback.Loading` | Full-screen loading overlay |
| `Feedback.Skeleton` | Content placeholder shimmer |
| `Feedback.Progress` | Linear progress bar |
| `Feedback.ProgressCircle` | Circular progress indicator |
| `Feedback.Banner` | Contextual notification banner |
| `Feedback.Empty` / `EmptyState` | Empty list or page placeholder |
| `Feedback.Error` | Error state with optional retry |
| `Feedback.PermissionCard` | Permission request UI |
| `ToastProvider` / `useToast` | Queued toast notification system |
| `ErrorBoundary` | React error boundary wrapper |

### Navigation

| Component | Description |
|-----------|-------------|
| `Navigation.AppBar` | Top navigation bar with action slots |
| `Navigation.BottomNav` | Bottom tab bar |
| `Navigation.Header` | Screen header |
| `Navigation.HeaderToolbar` | Header with left, center, right slots |
| `Navigation.CollapsingHeader` | Header that collapses on scroll |
| `Navigation.FloatingBar` | Floating action bar |
| `Navigation.SearchBar` | Navigation-level search input |
| `Navigation.SegmentedControl` | Segmented control switcher |
| `Navigation.Tabs` | Tab navigation container |
| `Navigation.Steps` | Step indicator / breadcrumb |
| `Navigation.Menu` / `MenuSection` | Dropdown menu with sections |

### Dialog

| Component | Description |
|-----------|-------------|
| `Dialog.BottomSheet` | Bottom drawer (RN Modal, no native peer deps) |
| `Dialog.ActionSheet` | Action sheet with options list |
| `Dialog.Confirmation` | Confirm / cancel modal |
| `Dialog.EditValue` | Inline edit value modal |
| `Sheet` (direct import) | Controlled sheet via `Dialog/Dialog.Sheet` |
| `ConfirmationProvider` / `useConfirmationContext` | Imperative confirmation API |

### Typography

| Component | Description |
|-----------|-------------|
| `Typography.Text` | Main text component — accepts `variant` prop from the full scale |
| `Typography.Heading` | Heading shorthand |

### Primitives

| Component | Description |
|-----------|-------------|
| `Box` | NativeWind layout container |
| `Row` | Horizontal flex |
| `Stack` | Vertical flex |
| `Spacer` | Flexible space filler |
| `Pressable` | Animated press target |
| `AspectRatio` | Aspect-ratio container |

### Layouts

| Component | Description |
|-----------|-------------|
| `Container` | Padded layout container |
| `ScrollContainer` | Scrollable layout wrapper |
| `GradientContainer` | Container with gradient background |
| `PlainLayout` | Unstyled layout for custom screens |
| `TabNavigatorLayout` | Layout for tab-based screen structure |

### Views

| Component | Description |
|-----------|-------------|
| `ListViewV2` | Paginated list with filtering and empty states |
| `FormViewV2` | Dynamic form view with field management |
| `AuthFormView` | Authentication form layout |
| `Wizard` / `useWizard` | Multi-step wizard with guards and lifecycle hooks |

### Widgets

| Component | Description |
|-----------|-------------|
| `ScreenHeader` | Composite screen header widget |
| `MenuGrid` / `MenuCard` | Grid and card-based navigation menus |
| `QuickActions` | Quick action icon grid |
| `PromoBanner` | Swipeable promotional carousel |
| `PromoModal` | Promotional modal overlay |
| `HomeHeader` | Home screen hero header |
| `GeoPermissionCard` | Geolocation permission request card |
| `TimeZoneSelector` | Timezone picker widget |
| `JSONViewer` | Collapsible JSON tree (debug / dev tools) |

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
<View style={themeStyle}>{children}</View>
```

### Reading the theme in components

```tsx
import { useTheme } from "@sincpro/mobile-ui/theme";

function PriceCard() {
  const theme = useTheme();
  return <View style={{ backgroundColor: theme.bg.card, borderColor: theme.border.default }} />;
}
```

### Defining a custom theme

```tsx
import { extendTheme } from "@sincpro/mobile-ui/theme";

// Deep-merges on top of the DS base theme
const MY_THEME = extendTheme({
  accent:    "#00C357",
  primary:   "#0B0B0B",
  secondary: "#6B6963",
  bg: {
    page: "#FAFAFA",
    card: "#FFFFFF",
  },
  text: {
    accent: "#006E2E",  // text on accent-tinted surfaces
  },
});
```

### ThemeTokens reference

| Group | Keys |
|-------|------|
| `primary / secondary / accent` | Main brand color scales |
| `bg.*` | `page, card, muted, accent, hover, disabled, popover` |
| `text.*` | `primary, secondary, tertiary, muted, accent, inverse, disabled, onPrimary, onSecondary, onAccent, onDanger, onSuccess` |
| `icon.*` | `primary, secondary, tertiary, inverse, disabled` |
| `border.*` | `default, light, strong, focus` |
| `success / warning / danger / info` | Semantic state colors |
| `*Light` | Tinted backgrounds for each state |
| `ring / input` | Focus ring and input border |
| `gradient.*` | `primary, accent` — arrays of color stops |
| `shadow.*` | `sm, md, lg` — React Native shadow objects |

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

| Group | Variants |
|-------|----------|
| Display | `display` |
| Headings | `h1` `h2` `h3` `h4` `h5` `h6` |
| Body | `bodyLarge` `body` `bodySmall` |
| Labels | `label` `labelSmall` |
| Data (mono) | `data` `dataLarge` |
| Meta (mono) | `overline` `caption` `captionSmall` |
| Buttons | `button` `buttonSmall` `buttonLarge` |
| Legacy | `title` `subtitle` |

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
  titleMedium:  "Satoshi-Medium",
  title:        "Satoshi-Bold",
  titleBlack:   "Satoshi-Black",
});

// Reset to defaults — useful in tests and Storybook stories
resetFonts();
```

### Font size scale

| Token | `px` | Token | `px` |
|-------|------|-------|------|
| `xs` | 10 | `4xl` | 28 |
| `sm` | 13 | `5xl` | 32 |
| `base` | 14 | `6xl` | 36 |
| `lg` | 16 | `7xl` | 48 |
| `xl` | 18 | `8xl` | 64 |
| `2xl` | 20 | | |
| `3xl` | 24 | | |

### Custom text styles

```tsx
import { createTextStyle, createCustomTextStyle } from "@sincpro/mobile-ui/theme/typography";

// From a named variant with overrides
const errorLabel = createTextStyle("labelSmall", { color: "#FF4D1F" });

// Fully custom
const amountStyle = createCustomTextStyle("4xl", "monoMedium", {
  lineHeight:    "none",
  letterSpacing: "tight",
});
```

---

## Motion Tokens

Centralized animation constants so motion feels consistent across every screen — not improvised per component:

```tsx
import { duration, easing, spring } from "@sincpro/mobile-ui/tokens";

// Durations (ms)
duration.instant  // 0    — immediate state swap, no transition
duration.fast     // 120  — micro-interactions (button press, toggle)
duration.normal   // 200  — standard transitions (modal, drawer)
duration.slow     // 320  — large layout shifts
duration.slower   // 480  — onboarding, emphasis animations

// Bezier easing curves
easing.standard    // general purpose
easing.decelerate  // elements entering the screen
easing.accelerate  // elements leaving the screen
easing.emphasized  // expressive, attention-drawing transitions

// Reanimated spring presets
spring.default   // balanced bounce
spring.gentle    // smooth, no overshoot
spring.snappy    // fast with slight bounce
```

Usage with Reanimated:

```tsx
import { withTiming, withSpring } from "react-native-reanimated";
import { duration, easing, spring } from "@sincpro/mobile-ui/tokens";

const opacity = withTiming(1, { duration: duration.normal, easing: easing.decelerate });
const scale   = withSpring(1, spring.snappy);
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
  content: [
    "./App.tsx",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@sincpro/mobile-ui/**/*.js",
  ],
  theme: {
    extend: {
      // Override font families to match loaded font names
      fontFamily: {
        light:     ["Inter_300Light"],
        regular:   ["Inter_400Regular"],
        medium:    ["Inter_500Medium"],
        semibold:  ["Inter_600SemiBold"],
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
import { Display }    from "@sincpro/mobile-ui/Display";
import { Form }       from "@sincpro/mobile-ui/Form";
import { Feedback }   from "@sincpro/mobile-ui/Feedback";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Dialog }     from "@sincpro/mobile-ui/Dialog";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { Actions }    from "@sincpro/mobile-ui/Actions";
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
import { ConfirmationProvider }          from "@sincpro/mobile-ui/Dialog";
import { ToastProvider, useToast }       from "@sincpro/mobile-ui/Feedback";
import { Wizard, useWizard }             from "@sincpro/mobile-ui/views/Wizard";
```

### Layout primitives

```tsx
import { Box, Row, Stack, Spacer }  from "@sincpro/mobile-ui/primitives";
import Container                    from "@sincpro/mobile-ui/layouts/Container";
import PlainLayout                  from "@sincpro/mobile-ui/layouts/PlainLayout";
import TabNavigatorLayout           from "@sincpro/mobile-ui/layouts/TabNavigatorLayout";
```

---

## Storybook

Every component in the DS has a Storybook story for on-device preview and manual QA. Run it on simulator or physical device:

```bash
make storybook          # expo start — Expo Go or dev build
make storybook-android  # expo run:android
```

Stories are organized into four groups:

| Group | Contents |
|-------|----------|
| **Foundations** | Tokens, typography scale, color palette, motion |
| **Components** | All compound component namespaces |
| **Patterns** | Composed examples (list screen, form screen, auth flow) |
| **Legacy** | Deprecated components kept for backwards compatibility |

Stories live in `.rnstorybook/stories/**/*.stories.tsx`. The Storybook harness is excluded from the published package (`files: ["dist", ...]`) and never lands in consumer bundles.

---

## Development

| Command | What it does |
|---------|-------------|
| `make build` | `tsc` + `tsc-alias` → `dist/` (JS + type declarations) |
| `make format` | Auto-fix: ESLint + Prettier + type-check |
| `make verify-format` | CI gate — runs `format`, fails if any file changed |
| `make storybook` | Start Expo dev server for Storybook |
| `make publish` | Bump version + `npm publish` |

After building, copy the dist to consumers in the local monorepo (no symlinks setup):

```bash
cp -r dist/* ../sincpro_mobile_tickets/node_modules/@sincpro/mobile-ui/dist/
```

Architectural decisions, naming conventions, and guardrails: [`AGENTS.md`](AGENTS.md).
