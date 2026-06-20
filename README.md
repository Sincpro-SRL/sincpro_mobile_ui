# @sincpro/mobile_ui

Sincpro Mobile design system: generic, presentational React Native components.

- **Presentational only** — receives data via props/callbacks. No domain logic, no services, no state stores.
- **Standalone** — does not depend on `@sincpro/mobile` (the core). The core depends on this package.
- Built with NativeWind + tailwind-variants.

## Install

```bash
yarn add @sincpro/mobile_ui
```

Peer dependencies (provided by the host app): react, react-native, nativewind, react-native-reanimated, react-native-svg, react-native-safe-area-context, and the expo modules listed in `package.json`.

## Usage

```tsx
import { Form } from "@sincpro/mobile_ui/Form";
import { Display } from "@sincpro/mobile_ui/Display";
import { theme } from "@sincpro/mobile_ui/theme";
import { formatDate } from "@sincpro/mobile_ui/lib/date";
```

## Structure

- `Form`, `Display`, `Dialog`, `Feedback`, `Typography`, `Navigation`, `primitives` — component categories
- `views` — compound views (ListViewV2, FormViewV2, Wizard)
- `widgets` — generic composed widgets (HomeHeader, MenuGrid, GeoPermissionCard, TimeZoneSelector)
- `theme` — design tokens + tailwind-variants helpers
- `lib` — generic utilities (date, monetary, quantity, serializer, icon, timezone)
