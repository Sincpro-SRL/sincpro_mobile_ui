# @sincpro/mobile-ui

Sincpro Mobile design system — generic, presentational React Native components (Expo SDK 56).

- **Presentational only** — driven by props/callbacks. No domain logic, services, or state stores.
- **Standalone** — does not depend on `@sincpro/mobile` (the core depends on this package).
- **Mobile-first** — built with NativeWind 4 + tailwind-variants, design tokens via CSS variables.

> 🤖 **AI agents:** read [`AGENTS.md`](AGENTS.md) (ecosystem & patterns) and [`docs/GOTCHAS.md`](docs/GOTCHAS.md) (known traps) first.

## Install

```bash
npx expo install @sincpro/mobile-ui
```

Peer dependencies are provided by the host app: `react`, `react-native`, `nativewind`,
`react-native-reanimated`, `react-native-svg`, `react-native-safe-area-context`,
`react-native-keyboard-controller`, `react-native-worklets`, `react-hook-form`,
`react-native-currency-input`, `@expo/vector-icons`, `@expo-google-fonts/montserrat`, plus the
expo modules listed in `package.json`. A few components need **optional** peers (install only if
you use them): `@react-native-community/slider` (`Form/Slider`), `@react-native-community/datetimepicker`
(`Form/DatePicker`), `@expo/ui` (future native primitives).

## Tailwind preset (required)

Components use design tokens exposed as Tailwind classes (`bg-primary`, `text-text-secondary`, …)
backed by CSS variables. Wire them via the shipped preset and content globs:

```js
// tailwind.config.js
module.exports = {
  presets: [require("@sincpro/mobile-ui/tailwind.preset")],
  content: ["./App.tsx", "./src/**/*.{ts,tsx}", "./node_modules/@sincpro/mobile-ui/**/*.js"],
  theme: { extend: { colors: { brand: "#FF6600" } } },
};
```

Token values are CSS variables; override them (a custom theme) in your global CSS `:root`, or inject
at runtime with `vars()`. The framework's `createAppShell({ theme })` does this automatically.

## Usage & import patterns

Import by **category subpath** (recommended — better tree-shaking) or from the root:

```tsx
import { Form } from "@sincpro/mobile-ui/Form"; // inputs + actions
import { Display } from "@sincpro/mobile-ui/Display"; // data display
import { Feedback } from "@sincpro/mobile-ui/Feedback"; // app state (Toast, Skeleton…)
import { Navigation } from "@sincpro/mobile-ui/Navigation"; // AppBar, BottomNav, SearchBar…
import { Dialog } from "@sincpro/mobile-ui/Dialog"; // overlays (Sheet, ActionSheet…)
import { theme, useTheme } from "@sincpro/mobile-ui/theme";
import { motion } from "@sincpro/mobile-ui/tokens";
```

Full component catalog by category: [`docs/CATALOG.md`](docs/CATALOG.md).

### Dark mode

Ships `DEFAULT_THEME` (light) and `DEFAULT_DARK_THEME`. Set the active theme with `setActiveTheme`
(or `createAppShell({ theme })` in the core) and inject the CSS vars with `vars(themeToVars(tokens))`
on the subtree. `useTheme()` is a reactive hook to read the theme in components.

### Branding (logo by context)

Configure the logo once; headers/login take it as a fallback:

```tsx
import { setBranding } from "@sincpro/mobile-ui";
setBranding({ logo: require("../assets/logo.png") }); // Display.Logo uses it when no `source` is passed
```

### Toast (queued feedback)

```tsx
import { ToastProvider, useToast } from "@sincpro/mobile-ui/Feedback";
// wrap the app in <ToastProvider>; then:
const toast = useToast();
toast.promise(save(), { loading: "Saving…", success: "Done", error: "Failed" });
```

### Bottom sheet

```tsx
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
// controlled by visible/onClose; closes via the top handle (swipe-down) or your own button.
// Built on RN Modal — no provider or native deps required.
```

## Conventions

- **Language:** code, comments, and JSDoc are in **English**. Docs in `docs/` are English.
- **Styling:** NativeWind-first (`className` + tokens). Native/JS escape hatch only where `className`
  can't reach (gradients, native props, Modal surfaces). See [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md).
- **Backwards compatible:** changes are additive by default; superseded components are kept and marked
  `@deprecated` (see `Legacy/*` in Storybook). See [`docs/STRUCTURE.md`](docs/STRUCTURE.md).

## Storybook (on-device, Expo)

Preview components on simulator/device with Storybook React Native (dev-only, not published):

```bash
make storybook          # expo start (Expo Go / dev build)
make storybook-android  # expo run:android
```

Stories live in `.rnstorybook/stories/**/*.stories.tsx`, grouped as **Foundations / Components /
Patterns / Legacy**. The harness (`App.tsx`, `.rnstorybook/`) is excluded from the published package
(`files: ["dist", …]`).

## Build & release

`make build` compiles `tsc + tsc-alias → dist/` (JS + types). The `exports` map publishes category
subpaths (`./Display`, `./Form`, …) plus a catch-all `./*`. See [`CHANGELOG.md`](CHANGELOG.md).
