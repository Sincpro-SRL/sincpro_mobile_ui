# Migración a v4 — rendimiento y estabilidad (Expo SDK 58)

v4 corrige la causa de los congelamientos y la lentitud de v3: componentes que montaban
infraestructura nativa **por instancia** (una sheet nativa por Select, por Confirmation y por
fila de lista; un toolbar de teclado por formulario). La regla nueva es **N declaraciones,
1 host**: los componentes se declaran donde viven y se dibujan en un único host de la raíz,
en la misma ventana de la app. La escala visual (tamaños, spacing, tipografía) no cambia.

## 1. Montar los hosts una vez

`@sincpro/mobile` (AppShell 2.x) lo hace solo. Una app que arma su raíz a mano:

```tsx
import { OverlayHost } from "@sincpro/mobile-ui/Dialog";
import { ToastProvider } from "@sincpro/mobile-ui/Feedback";
import KeyboardToolbarHost from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
import { useThemeVars } from "@sincpro/mobile-ui/theme";
import { useAppFonts } from "@sincpro/mobile-ui/theme/typography";

const fontsLoaded = useAppFonts();
const themeVars = useThemeVars();

<GestureHandlerRootView style={{ flex: 1 }}>
  <View style={[{ flex: 1 }, themeVars]}>
    <SafeAreaProvider>
      <KeyboardProvider>
        <ToastProvider>
          <OverlayHost>{app}</OverlayHost>
        </ToastProvider>
        <KeyboardToolbarHost />
      </KeyboardProvider>
    </SafeAreaProvider>
  </View>
</GestureHandlerRootView>;
```

`useAppFonts()` ya incluye la fuente de íconos (`ICON_FONTS`). Si la app carga sus fuentes por
su cuenta, debe sumar `...ICON_FONTS` antes de ocultar el splash.

## 2. Sheets y overlays

| Antes (v3)                                                                                             | v4                                                                    |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `@expo/ui` BottomSheet por instancia (otra ventana en Android; Host de SwiftUI siempre montado en iOS) | `SheetSurface` en el `OverlayHost`, en la misma ventana               |
| Cerrada = montada con `index -1`                                                                       | Cerrada = **no monta nada**                                           |
| `onClose` disparaba el desmontaje inmediato                                                            | `onClose` pide cerrar; `onClosed` corre al terminar la animación      |
| Toast detrás de las sheets nativas                                                                     | Toast en la capa superior del host (`box-none`, nunca bloquea toques) |

- Navegar o abrir otro overlay **después** de cerrar: hacerlo en `onClosed`, no en `onClose`.
- El contenido de una sheet se dibuja en el host. Ve los providers de la raíz (tema, toast,
  navegación si el host está dentro del navegador), **no** los providers de pantalla que estén
  entre el host y la sheet. Lo que necesite, pasarlo por props.
- Nunca una sheet dentro de una fila de lista: la pantalla tiene **una** sheet y las filas
  llaman `onOpen(item)`.
- Android back cierra la sheet de más arriba; una sheet `dismissible={false}` lo consume.

## 3. Teclado

| Antes (v3)                                                                       | v4                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Form.KeyboardToolbar` propio dentro de cada `KeyboardForm`                      | `Form.KeyboardToolbarHost` único (keyboard-controller con nuestro estilo y etiquetas en español)                                                                                                                                 |
| Toolbar solo en iOS (`ios`/`android` por plataforma)                             | La misma barra en Android e iOS, encendida por defecto. `<KeyboardToolbarHost enabled={false} />` la apaga en las dos                                                                                                            |
| `KeyboardFormProps extends KeyboardAwareScrollViewProps`                         | API propia: `bottomOffset`, `stickyFooterHeight`, `style`, `contentContainerStyle`, `className`, `contentContainerClassName`, `keyboardShouldPersistTaps`, `showsVerticalScrollIndicator`, `bounces`, `refreshControl`, `testID` |
| `toolbar`, `toolbarProps`, `keyboardToolbar`                                     | Eliminados                                                                                                                                                                                                                       |
| `ScrollContainer` con `KeyboardAwareScrollViewProps` y `bottomOffset` fijo de 72 | `ScrollContainerProps` = props de `KeyboardForm` + `edges`. Mismo espacio sobre el teclado que cualquier formulario (toolbar + 24); `contentInsetAdjustmentBehavior="automatic"` se mantiene                                     |

Cada `KeyboardForm` y cada sheet es un grupo: anterior y siguiente no salen del formulario.

## 4. Íconos

```ts
declare module "@sincpro/mobile-ui/Display/icon-registry" {
  interface CustomIconRegistry {
    odoo: true;
  }
}
registerIcons({ odoo: ({ size, color }) => <OdooLogo color={color} size={size} /> });
// <Display.Icon name="odoo" />
```

- **Nombres:** un nombre desconocido ya no rompe la pantalla; muestra `info` y avisa una vez en
  dev. `type`, `customIcon`, `fallback` y `children` se avisan y se ignoran.
- **Android y web:** el glifo de Material Symbols se dibuja con un `Text`, en un solo render y
  sin escalar con la fuente del sistema. iOS usa SF Symbols.
- **API pública:** `ICON_MAP`/`IconDefinition` ya no son públicos. Para listar los nombres,
  usar `ICON_NAMES`.

## 5. Listas

| Antes (v3)                           | v4                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `listProps` (props de FlashList)     | `tuning`, con vocabulario propio (tabla de abajo)                                          |
| `listRef: FlashListRef<IRowItem<T>>` | `ref: ListViewHandle` (`scrollToIndex(index, { position })`, `scrollToTop`, `scrollToEnd`) |
| `ListViewV2.Content.List`            | Eliminado: es un detalle interno de `Content`                                              |
| `ListViewVirtualizationProps`        | `ListViewTuning<T>`                                                                        |

| `listProps`                                               | `tuning`                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| `drawDistance`, `extraData`                               | igual                                                                      |
| `getItemType(row, index)`                                 | `rowType(item, index)`, con el item original                               |
| `initialScrollIndex`                                      | `initialIndex`                                                             |
| `onEndReachedThreshold`                                   | `loadMoreThreshold`                                                        |
| `maintainVisibleContentPosition`                          | `keepVisiblePosition: true` (apagado por defecto)                          |
| `onViewableItemsChanged` + `viewabilityConfig`            | `onVisibleRowsChange(rows)` + `visiblePercent`; `rows` = `{ item, index }` |
| `maxItemsInRecyclePool`, `viewabilityConfigCallbackPairs` | Eliminados; no hay casos de uso                                            |

## 6. Campos de texto

`Form.Input` es el único campo de texto. Absorbe `InputField`, `PasswordInput` y `TextInput`,
que duplicaban la lógica de foco, error y accesibilidad con otro aspecto.

| Antes (v3)                                                             | v4                                                                   |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `<Form.InputField label error inputProps={{ value, onChangeText }} />` | `<Form.Input look="outline" label error value onChangeText />`       |
| `<Form.PasswordInput label error inputProps={{ ... }} />`              | `<Form.Input look="outline" secure label error ... />`               |
| `<Form.TextInput ... />` (sin etiqueta)                                | `<Form.Input look="outline" ... />` (radio 4 en vez de 6, padding 8) |
| `<Form.Input secureTextEntry />`                                       | `<Form.Input secure />` (con botón mostrar/ocultar)                  |

| look      | Etiqueta          | Campo                                       | Espacio inferior |
| --------- | ----------------- | ------------------------------------------- | ---------------- |
| `card`    | bodySmall, medium | superficie con sombra, rounded-lg, alto ≥48 | 8                |
| `outline` | bodyLarge         | solo borde, rounded, alto 44                | 16               |

- `outline` reproduce clase por clase el aspecto de `InputField`, y `outline` + `secure` el de `PasswordInput`.
- `PasswordInput` forzaba `autoComplete="off"`; `secure` no. Para mantenerlo, pasar `autoComplete="off"`. Para que el gestor de contraseñas complete el campo (recomendado), pasar `autoComplete="current-password"`.
- Quedan aparte, porque son widgets y no modos de texto: `PinInput` (celdas de código), `MonetaryInput` (formato de moneda), `QuantitySelector` y `FractionalQuantityInput` (steppers).

## 7. Encabezado colapsable

`Navigation.CollapsingHeader` anima en el hilo de UI (Reanimated). Antes recibía un
`Animated.Value` de React Native, y su propia guía pedía `useNativeDriver: false`: cada frame de
scroll cruzaba al hilo JS y recalculaba el layout.

| Antes (v3)                                                                                                                   | v4                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `<CollapsingHeader scrollY={animatedValue} />` + `Animated.ScrollView` con `Animated.event(..., { useNativeDriver: false })` | `<CollapsingHeader.Root>` con `<CollapsingHeader />` y `<CollapsingHeader.ScrollView>`; el host no toca eventos de scroll |
| `scrollY: Animated.Value`                                                                                                    | `scrollY?: ScrollOffset` (`{ get(): number }`): cualquier shared value de Reanimated, para listas propias (FlashList)     |

Las interpolaciones (opacidad, desplazamiento y alto del título grande, opacidad del título
compacto) son las mismas.

## 8. Reglas de rendimiento (rompen en silencio si se ignoran)

1. **Filas:** son funciones puras de sus props, van con `memo`, sin estado, sin overlays y sin
   efectos.
2. **Renderer:** el de `ListViewV2.Content` va con `useCallback` en la pantalla, y los datos
   (`items`) memoizados. Un array nuevo o un renderer inline repinta todas las filas.
3. **Pressable:** nunca el `Pressable` de React Native con `className`. Usar
   `@sincpro/mobile-ui/primitives/Pressable`.
4. **Ventanas nativas:** nada de `Modal` para overlays que no son pantalla completa. Un Modal es
   otra ventana y bloquea todos los toques de la app mientras está visible.
5. **`Typography.Text`:** sin `className` toma el camino rápido (StyleSheet). Usar `className`
   solo cuando aporte (espaciado, color semántico).

## 9. Medir

- `make perf-test` / `make perf-baseline`: Reassure (renders y tiempo en jest).
- Storybook `Patterns/Performance/Laboratorio`: lista de 500 filas, formulario de 20 campos, ciclo de 50
  aperturas de sheet, Login ↔ Servidor y 300 íconos, con HUD (`PerfProbe`). Medir en un build
  **release** en un Android real.
