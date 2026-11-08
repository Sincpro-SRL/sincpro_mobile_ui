# Migration guide — `@sincpro/mobile-ui`

> Contratos de migración del package. La próxima major SDK 58 está preparada en código;
> publicación y versión pertenecen al release del usuario.

El package sigue **semver**: minor versions son aditivos, majors pueden romper.
Para instrucciones de rebrand, ver [`REBRAND.md`](./REBRAND.md).

---

## Próxima major — modernización SDK 58

- Instalación explícita: `npx expo install @expo/ui expo-symbols @shopify/flash-list
  expo-image react-native-keyboard-controller`. Mantener una sola copia de los peers
  y los rangos SDK 58 declarados por el paquete.
- `Display.Icon`: `name` obligatorio de tipo `IconName`, sin `type`, `iconType`,
  `customIcon` ni familias. Importar `ICON_MAP` desde `@sincpro/mobile-ui/Display`
  para reutilizar `sf`/`md` en los íconos del navegador del host. Los SVG de branding se renderizan
  por separado. Nombre/tamaño inválido produce un error explícito.
- Una sola `Dialog.Sheet` sobre `@expo/ui`; se borran `BottomSheet`, `NativeSheet` y
  SheetProvider. Select/Dropdown/Menu/DatePicker/Slider/SegmentedControl usan controles
  oficiales. No hay Modal RN para selección o edición.
- `Container` y `ScrollContainer` reservan solo izquierda/derecha por defecto.
  AppBar/Header reservan arriba; el navegador del host reserva abajo. Una pantalla sin navegador
  debe reservar su borde inferior explícitamente. AuthContainer es standalone y permite
  `edges` para composición embebida.
- Las barras se controlan en el host con Expo. Se borran `barStyle`, `statusBarHidden`,
  `statusBarColor` y ScreenStatusBar de los layouts/cabeceras.
- ScrollContainer usa KeyboardAwareScrollView. Los formularios muestran toolbar por
  defecto; configurarla solo con `toolbarProps`. FormViewV2.Footer sigue al teclado y
  Content reserva su altura, incluyendo toolbar y separación del último campo.
- ListViewV2 recibe entidades originales y metadata separada. `listRef` usa
  `FlashListRef<IRowItem<T>>`; la configuración pasa a FlashList v2. Se eliminan knobs
  exclusivos de FlatList, como `getItemLayout`/`windowSize`/batching y clipping.
  El mantenimiento de posición visible queda desactivado por defecto.
- Eliminar Header/HeaderToolbar/HomeHeader/ScreenHeader/TabNavigatorLayout, TabIcon/
  TabItem y aliases de widgets. Usar AppBar, Display.MenuGrid/MenuCard/CircleButton,
  Navigation.MenuSection y Actions.Button/IconButton/FAB/FilterButton.
  Form.SearchBar pasa a Navigation.SearchBar; `gold-mesh` pasa a `warm`.
- React Compiler habilitado, con reglas actuales de react-hooks como gate.
  NativeWind se mantiene en `^4.2.7`: v5 rc declara Expo 57, no soporte SDK 58.
- Typography.Text elimina `color`: usar `className` o `style={{color}}`.
  Monetary conserva `style` y usa `symbolStyle` en lugar de `symbolColor`.
  Los tokens `successLight/warningLight/dangerLight/infoLight` se reemplazan por
  `container.*` y clases `bg-container-*`.
- EditValue usa `onClose/onConfirm(value)`; `onChange` controla el borrador, `options`
  configura presets y `footerAdornment` permite incrementos sin un segundo modal.
  Sheet elimina `showCloseButton/dismissOnBackdrop`; el cierre visible es parte del
  contrato y `dismissible` controla el cierre nativo. Dock usa `snapPoints`.
- Storybook conserva Gorhom solo como peer obligatorio de su shell de desarrollo.
  Se elimina el addon de controles que exigía slider/date picker antiguos.

No se cambia `version`, no se publica ni se crea un commit automáticamente. Antes de
modernizar core, el usuario debe publicar esta major y confirmar su versión en npm.

---

## 0.6.x → 0.7.x

Placeholder. Migraciones anteriores se agregan acá cuando este archivo se introdujo.

---

## 0.7.x → 0.8.x (planned — theme rebrand + a11y contract)

Breaking if your app relied on the previous **sample** defaults without calling
`setActiveTheme`:

| Before (0.7 sample) | After (0.8 sample) |
| --- | --- |
| Light `primary` `#2563EB` (blue) | `#C9A84C` (gold sample) |
| Dark `primary` `#00F58C` (neon) | `#C9A84C` (gold sample) |
| Theme names `default` / `dark` | `default-light` / `default-dark` |
| CTA ink often hardcoded white | `text.onPrimary` via `resolveOnColor` |
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