# Migration guide — `@sincpro/mobile-ui`

> Contratos de migración del package. La próxima major SDK 58 está preparada en código;
> publicación y versión pertenecen al release del usuario.

El package sigue **semver**: minor versions son aditivos, majors pueden romper.
Para instrucciones de rebrand, ver [`REBRAND.md`](./REBRAND.md).

---

## Próxima major (4.0) — rendimiento y estabilidad SDK 58

Detalle con ejemplos en [`MIGRATION-V4.md`](./MIGRATION-V4.md). Resumen:

- **Overlays en un host único, en la misma ventana.** Montar `<OverlayHost>` una vez en la raíz
  (el `AppShell` de `@sincpro/mobile` lo hace). `Dialog.Sheet` conserva su API y suma `onClosed`.
  Una sheet cerrada no monta nada. Toast se dibuja en la capa superior del host. Ya no se usa
  `@expo/ui/community/bottom-sheet`.
- **Teclado:** `Form.KeyboardToolbar` se reemplaza por `Form.KeyboardToolbarHost`, montado una
  vez (iOS encendido, Android apagado por defecto). `KeyboardForm` tiene API propia (sin
  `toolbar`, `toolbarProps`, `ref` ni props de keyboard-controller). Se eliminan
  `keyboardToolbar`/`toolbarProps` de FormViewV2, AuthContainer y AuthFormView.
- **Íconos:**
  - `Display.Icon` no lanza error: un nombre desconocido muestra `info` y avisa en dev.
  - Íconos propios con `registerIcons()` y `CustomIconRegistry` (module augmentation).
  - `ICON_MAP`/`IconDefinition` dejan de ser públicos; usar `ICON_NAMES`.
  - El host carga `ICON_FONTS` (incluido en `useAppFonts`).
  - Nuevo peer `@expo-google-fonts/material-symbols`.
- **Tema:** `useThemeVars()` da las variables de NativeWind con identidad estable por versión.
- **Build:** `dist` compilado con React Compiler.
- Siguen vigentes los contratos ya publicados en 3.x: safe area por borde, barras en el host,
  ListViewV2 con la entidad original, FlashList v2 y NativeWind `^4.2.7`.

No se cambia `version`, no se publica ni se crea un commit automáticamente.

---

## 0.6.x → 0.7.x

Placeholder. Migraciones anteriores se agregan acá cuando este archivo se introdujo.

---

## 0.7.x → 0.8.x (planned — theme rebrand + a11y contract)

Breaking if your app relied on the previous **sample** defaults without calling
`setActiveTheme`:

| Before (0.7 sample)                             | After (0.8 sample)                       |
| ----------------------------------------------- | ---------------------------------------- |
| Light `primary` `#2563EB` (blue)                | `#C9A84C` (gold sample)                  |
| Dark `primary` `#00F58C` (neon)                 | `#C9A84C` (gold sample)                  |
| Theme names `default` / `dark`                  | `default-light` / `default-dark`         |
| CTA ink often hardcoded white                   | `text.onPrimary` via `resolveOnColor`    |
| Brand text via `text-primary` / `theme.primary` | `text-text-accent` / `theme.text.accent` |

**What to do**

1. Call `setActiveTheme(yourTheme)` at boot (see [`REBRAND.md`](./REBRAND.md)).
2. Replace brand-colored text classes: `text-primary` → `text-text-accent`.
3. Set on-colors with `resolveOnColor(fill)` — do not hardcode white/black for every brand.
4. Gradient preset `gold-mesh` → `warm` (alias eliminado en la major SDK 58).
5. New token layers (additive): `container.*`, `bg.containerLowest|container|containerHigh`,
   `state.*`, `material.*`. Prefer `buildThemeFromBrand` for new apps.
6. Chips/badges: use `bg-container-success` + `text-container-on-success`.
   Las clases antiguas `bg-success-light` se eliminaron en la major SDK 58.

`validateTheme(tokens)` flags CTA contrast, focus ring, brand text on page/card,
container pairs, and muted/disabled collisions in `__DEV__`.

---

## Cómo leer la versión del package

- `0.x.y` — etapa histórica pre-estable. Minor bumps podían incluir breaking changes.
- Después de `1.0.0`: `major` = breaking, `minor` = additive, `patch` = fixes only.

El host instala una major publicada y probada desde npm; no tarballs ni enlaces locales.
