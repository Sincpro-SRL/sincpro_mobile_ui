# Roadmap — `@sincpro/mobile-ui`

> Planes de releases futuros del design system. **No confundir con `MIGRATIONS.md`**:
> ese archivo documenta migraciones **efectivamente publicadas**; este lista trabajo
> en curso o planificado para las próximas versiones.

## Estado actual

| Línea    | Estado      | Notas                                                                |
| -------- | ----------- | -------------------------------------------------------------------- |
| `0.7.x`  | publicado   | última versión estable (tag en npm)                                  |
| `0.8.x`  | `[PLANNED]` | rebrand del theme a identidad Sincpro + restructuración del design system |
| `0.9.x`  | `[PLANNED]` | upgrade a Expo SDK 57 / React Native 0.86                            |
| `1.0.0`  | `[BACKLOG]` | API freeze, semver estricto                                         |

---

## `[PLANNED]` 0.8.x — Rebrand del theme + restructuración del DS

> Theme & brand overhaul — el framework se vuelve **brand-agnostic**. El theme default
> pasa a la identidad Sincpro gold-light; los consumidores pueden swappear palette +
> symbol globalmente sin forkear.

### What it brings

- `theme.pattern` — branded mesh token (`mode`, `size`, `source`) que alimenta
  `<Display.Pattern kind="mesh" />`.
- `branding.ts` extendido — `setBranding({ mesh, meshSize })` permite swappear el
  brand symbol globalmente.
- `validateTheme(tokens)` — sanity-check del theme en dev (`__DEV__`-only).
- **M3-era token layers:** `container.*` / `on*`, `bg.containerLowest|container|containerHigh`,
  `state.*` opacities, `material.*` (glass chrome hints).
- `buildThemeFromBrand({ brand, mode })` — deriva un `ThemeTokens` completo desde un seed.
- `resolveOnColor(fill)` — ink AA brand-agnostic para CTAs.
- Storybook usa `useTheme()` y re-skinea reactivamente al togglear light/dark.
- Subpath `@sincpro/mobile-ui/branding` exportado.
- `make test` cubre runtime del theme (contrast, build, containers).

### What changes

- `theme/default.ts` y `theme/dark.ts` rebrandeados de genérico Tailwind blue/orange
  y neon-green a Sincpro gold. Consumers que dependían del default deben llamar
  `setActiveTheme(YOUR_THEME)` al boot.
- `assets/simbolo.png` renombrado a `assets/brand-mesh.png`.
- `Display.Pattern` resolve-invert/opacity ahora vive en `MESH_PRESETS` keyed by
  `PatternMode`. Override vía `mode` prop o `theme.pattern`.

---

## `[PLANNED]` 0.9.x — Upgrade a Expo SDK 57 (React Native 0.86)

> Bumps del design system a React Native 0.86 y al nuevo Expo SDK 57. Sin breaking
> changes en la API pública para los consumidores.

### What it brings

- React Native **0.86** (antes 0.85). Sin breaking changes documentados en el lado
  de RN.
- Expo SDK **57** (`expo`, `expo-checkbox`, `expo-clipboard`, `expo-font`,
  `expo-linear-gradient`, `expo-localization`, `expo-status-bar`, `@expo/ui`,
  `eslint-config-expo`).
- Stack de animación / gestos bumped:
  - `react-native-reanimated` **4.3 → 4.5**
  - `react-native-worklets` **0.8 → 0.10**
  - `react-native-gesture-handler` **2.31 → 2.32**

### What changes

- `peerDependencies` ranges ajustados a SDK 57 (e.g. `react-native: ">=0.86"`,
  `react: ">=19.2"`, `expo-*: ">=57.0.0"`, `reanimated: ">=4.5"`). Consumers deben
  correr `npx expo install expo@^57 --fix`.
- `expo prebuild` ahora limpia y regenera los directorios `android/` / `ios/`
  por default — usar `--no-clean` para aplicar in-place.
- `react-native-keyboard-controller` 1.21.6 → 1.21.9 (alineado con `reanimated`
  4.5). Sin cambio de código requerido.

### Notas

- React sigue en **19.2.3** (sin cambio desde SDK 56).
- `@expo/vector-icons` 15.x, `react-native-svg` 15.15.x y
  `react-native-safe-area-context` 5.7.x siguen siendo compatibles — no requieren
  bump.
- Hermes V1 + Reanimated: importar `react-native-reanimated` puede subir el uso de
  memoria 25–30% con Hermes V1 (regresión documentada upstream). Si ves OOM,
  habilitar [worklets bundle mode](https://docs.swmansion.com/react-native-worklets/docs/bundleMode/).

---

## `[BACKLOG]` 1.0.0 — API freeze + semver estricto

> Primer release estable del DS. Implica lock de API pública, deprecaciones
> completas del bagaje legacy, y SLA de mantenimiento.

### Candidatos a estabilizar

- API pública: namespaces `Display`, `Form`, `Actions`, `Navigation`, `Dialog`,
  `Feedback`, `Typography`, `Primitives`, `Layouts`, `Views`, `Widgets`.
- `peerDependencies` como rangos cerrados.
- Eliminación de `*.deprecated` después de un major version cycle.

---

## Defer / próximo trimestre

| Paquete       | Hoy    | Latest | Por qué se difiere                                                              |
| ------------- | ------ | ------ | ------------------------------------------------------------------------------- |
| `typescript`  | 6.0.3  | 7.0.2  | Major; riesgo de incompatibilidades con `babel-preset-expo`, `tsc-alias`.        |
| `eslint`      | 9.39.4 | 10.7.0 | Major; v10 trae breaking changes en flat config.                                |
| `tailwindcss` | 3.4.19 | 4.3.3  | Requiere NativeWind v5 (aún no estable). Intencional (NW v4 requiere TW v3).    |
| Node engine   | 22 LTS | 24 LTS | Node 22 LTS hasta Apr 2027. Suficiente.                                         |
| `tsconfig.json` `ignoreDeprecations: "6.0"` | activo | — | No-op con TS 6 instalado. Sacar cuando se confirme TS 7 estable.         |

---

## Cómo leer este archivo

- **`[PLANNED]`** = trabajo en curso o próximo, con scope ya acordado.
- **`[BACKLOG]`** = ideas con consenso pero sin owner ni fecha.
- **Sin tag** = estado actual del repo.
- Cuando un item `[PLANNED]` se libera, su sección se mueve a `MIGRATIONS.md` con
  el formato `## X.Y → X.Z` y se borra de acá.