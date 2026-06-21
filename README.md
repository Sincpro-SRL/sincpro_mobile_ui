# @sincpro/mobile-ui

Sincpro Mobile design system: generic, presentational React Native components.

- **Presentational only** — receives data via props/callbacks. No domain logic, no services, no state stores.
- **Standalone** — does not depend on `@sincpro/mobile` (the core). The core depends on this package.
- Built with NativeWind + tailwind-variants.

## Install

```bash
npx expo install @sincpro/mobile-ui
```

Peer dependencies (provided by the host app): `react`, `react-native`, `nativewind`, `react-native-reanimated`, `react-native-svg`, `react-native-safe-area-context`, `react-native-keyboard-controller`, `react-native-worklets`, `react-hook-form`, `react-native-currency-input`, `@expo/vector-icons`, `@expo-google-fonts/montserrat`, and the expo modules listed in `package.json`.

## Tailwind preset (required)

The components use design tokens exposed as Tailwind classes (`bg-primary`, `text-text-secondary`, …) backed by CSS variables. The consumer app wires them via the shipped preset and content globs:

```js
// tailwind.config.js
module.exports = {
  presets: [require("@sincpro/mobile-ui/tailwind.preset")],
  content: ["./App.tsx", "./src/**/*.{ts,tsx}", "./node_modules/@sincpro/mobile-ui/**/*.js"],
  theme: { extend: { colors: { brand: "#FF6600" } } },
};
```

The token values are CSS variables; override them (a custom theme) in your global CSS `:root`, or inject at runtime with `vars()`. The framework's `createAppShell({ theme })` does this automatically.

## Usage

```tsx
import { Form } from "@sincpro/mobile-ui/Form";
import { Display } from "@sincpro/mobile-ui/Display";
import { theme } from "@sincpro/mobile-ui/theme";
```

## Storybook (on-device, Expo)

Visualiza los componentes en simulador/dispositivo con Storybook React Native (dev-only, no se publica):

```bash
make storybook          # expo start (Expo Go / dev build)
make storybook-android  # expo run:android
```

Las stories viven en `.rnstorybook/stories/**/*.stories.tsx` e importan desde `@sincpro/mobile-ui/*`. El harness (`App.tsx`, `metro.config.js`, `.rnstorybook/`) está excluido del paquete publicado (`files: ["dist", ...]`).

## Structure

- `Form`, `Display`, `Dialog`, `Feedback`, `Typography`, `Navigation`, `primitives` — component categories
- `views` — compound views (ListViewV2, FormViewV2, Wizard)
- `widgets` — generic composed widgets (HomeHeader, MenuGrid, GeoPermissionCard, TimeZoneSelector)
- `theme` — design tokens + tailwind-variants helpers (`defineTheme`, `extendTheme`, `themeToVars`)
- `utils` — generic utilities (date, monetary, quantity, serializer, icon, timezone)
