# Estructura & clasificación — `@sincpro/mobile-ui`

> Cómo está organizado el design system y **dónde va cada cosa**. Regla de oro: la carpeta indica
> el _tier de composición_ y la _responsabilidad_. Si dudás dónde poner un componente nuevo, esta
> tabla decide.

## Convención de nombres

- **`PascalCase/`** = namespace de componentes exportado como **compound** (`Display`, `Form`, `Dialog`, `Feedback`, `Navigation`, `Typography`). Cada archivo es `Namespace.Componente.tsx` y se agrega al barrel `index.ts` del namespace.
- **`lowercase/`** = **tier estructural** (`tokens`, `primitives`, `layouts`, `views`, `widgets`, `icons`, `utils`, `theme`).

## Tiers (de fundamento a producto)

| Carpeta       | Responsabilidad                                           | Qué vive acá                                                                                                                                                                              | Qué NO va acá                              |
| ------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `tokens/`     | Valores de diseño en TS que `className` no puede expresar | `motion` (duration/easing/spring). zIndex/opacity → **clases** del preset, no acá                                                                                                         | colores/spacing/radius (→ preset/CSS-vars) |
| `theme/`      | Runtime del tema                                          | `active`, `useTheme`, `define/extend/merge`, `css-vars`, `tw` (cn/tv), `dark`/`default`                                                                                                   | componentes                                |
| `primitives/` | Átomos estructurales sin semántica de dominio             | `Box`, `Row`, `Stack`, `BaseButton`, `Pressable`, `Spacer`, `AspectRatio`                                                                                                                 | nada con estado de negocio                 |
| `Typography/` | Texto                                                     | `Text`, `Heading`                                                                                                                                                                         |                                            |
| `Display/`    | **Mostrar datos** (presentacional puro)                   | `Badge`, `Avatar`, `Card`, `Chip`, `Accordion`, `ListItem`, `Icon`, `Monetary`, `Date`, `Divider`, `CopyableText`                                                                         | estado de app, inputs                      |
| `Form/`       | **Entrada de datos**                                      | `Input`, `Switch`, `Checkbox`, `RadioButton`, `Dropdown`, `Select`, `DatePicker`, `Slider`, `KeyboardForm`, `KeyboardToolbar`, `Monetary/QuantityInput`, `Controlled*`                              | acciones (→ `Actions`)                     |
| `Feedback/`   | **Comunicar estado de la app**                            | `Loading`, `Spinner`, `Skeleton`, `Progress`, `Banner`, `Empty`, `Error`, `Toast` (Provider+hook), `ErrorBoundary`                                                                        | datos del dominio                          |
| `Dialog/`     | Overlays modales                                          | `Sheet` sobre `@expo/ui/community/bottom-sheet`, `ActionSheet`, `EditValue`, confirmación nativa                                                                                            | otro motor de sheets                       |
| `Navigation/` | Navegación intra-pantalla / barras                        | `AppBar`, `BottomNav`, `TabItem`, `RowItem`, `SegmentedControl`, `Tabs`, `FloatingBar`, `CollapsingHeader`, `Steps`, `Menu`, `SearchBar`                                                  | layouts de ruta (van en el core)           |
| `layouts/`    | Contenedores presentacionales                             | `Container`, `ScrollContainer`, `GradientContainer`, `AuthContainer`, `PlainLayout`                                                                                                        | layouts router-aware (host)                |
| `views/`      | Templates compuestos (patrones de pantalla)               | `FormViewV2`, `ListViewV2`, `AuthFormView`, `AppSplashView`, `Wizard`                                                                                                                     |                                            |
| `widgets/`    | Composiciones genéricas listas                            | `CollectionOptions`, `FilterBar`, `FilterBuilder`, `PromoBanner`, `PromoModal`, `QuickActions`, `TimeZoneSelector`, `JSONViewer`                                                             | alias de `Display`/`Navigation`, negocio    |
| `icons/`      | Iconos SVG                                                | componentes de icono                                                                                                                                                                      | lógica de dominio                          |
| `utils/`      | Helpers genéricos                                         | `date`, `monetary`, `quantity`, `serializer`, `timezone`                                                                                                                                  | fábricas de familias de iconos             |

`Display.Icon` acepta `IconName`; el mapa `ICON_MAP` exportado desde `Display` contiene
los nombres SF/Material compartidos con los tabs del host. Los logos son branding,
no una segunda familia de iconos. No hay aliases ni cabeceras legacy por retrocompat.

## Cómo decidir la categoría (árbol rápido)

1. ¿Es un valor de diseño (tiempo/animación)? → `tokens/`. (Color/medida → preset, como clase.)
2. ¿Es un átomo sin semántica (caja, fila, pressable)? → `primitives/`.
3. ¿El usuario **ingresa** datos? → `Form/`.
4. ¿Comunica **estado** (cargando, vacío, error, progreso, aviso)? → `Feedback/`.
5. ¿**Muestra** datos (badge, card, fila, chip)? → `Display/`.
6. ¿Es overlay modal? → `Dialog/`. ¿Navegación intra-pantalla? → `Navigation/`.
7. ¿Es una pantalla-template? → `views/`. ¿Composición lista de varios? → `widgets/`.

## Taxonomía de Storybook

Raíces del catálogo vigente: `Foundations`, `Components`, `Patterns`.
UX es un criterio transversal, no una carpeta para ejemplos heterogéneos.

- Estados, jerarquía y fallos de una pieza van con esa pieza: `Components/Actions/Button`,
  `Components/Data Display/CopyableText`, `Components/Inputs/Select`, `Components/Feedback`.
- Recetas con varias piezas se clasifican por tarea: `Patterns/Forms`, `Patterns/Records`,
  `Patterns/Collections`, `Patterns/Profiles`; templates existentes en `Patterns/Views`.
- Una receta no es automáticamente un componente público. El builder y las opciones de
  colección son widgets genéricos; evaluar/paginar/persistir datos pertenece al host.
- `widgets/ReorderableList` es una composición opcional por subpath: usa un motor mantenido,
  no otro sistema de gestos. No agregarlo al barrel general, para no hacer obligatorio
  `react-native-sortables` a quienes solo usan los otros widgets. Orden/persistencia
  pertenecen al host; contenido y controles se reemplazan por API pública.
- Formularios que poseen scroll usan `parameters.ownsScroll = true` para no anidar otro
  scroll del canvas. El resto del canvas es keyboard-aware.
- Un test revisa todas las stories para impedir raíces nuevas o el catch-all `UX`.

## Reglas transversales (todo componente)

- **NativeWind-first**: estilá con `className`. JS (`theme.x`, `tokens`) **solo** para lo que className no puede (props nativas, animaciones, gradientes).
- **No cambiar `className` por estado en táctiles** (NativeWind entra en loop): className estático + estado por `style` inline (tokens). Touchable = `primitives/Pressable` (sobre `TouchableOpacity`).
- **a11y**: `accessibilityRole`/`accessibilityState`/`accessibilityLabel`/`hitSlop` + `testID`.
- **`className` passthrough**: aceptar y mergear `className` para override puntual.
- **Variantes con `tv()`** (estáticas) en vez de condicionales dinámicos cuando se pueda.
- **Sin hex hardcodeado** fuera de tokens.

## Empaque (cómo se expone algo nuevo)

- Archivo nuevo en su carpeta → importable ya por catch-all `@sincpro/mobile-ui/<carpeta>/<archivo>`.
- Subpath limpio (`@sincpro/mobile-ui/<carpeta>`) → barrel `index.ts` + entrada en `exports` de `package.json`.
- Dep nativa **opcional/pesada** → `peerDependenciesMeta.optional` + exponer **solo por subpath** (fuera de barrels root), para no inflar el build de apps que no la usan.
- `expo-image` es obligatorio desde v2: toda imagen de catálogo usa el renderer común
  `Display.ExpoImage`, directamente o mediante `Display.Image`. Las texturas SVG son otra
  responsabilidad y conservan `react-native-svg`; `resolveAssetSource` de RN no es un renderer.
- `@expo/ui`, `expo-symbols`, FlashList v2 y keyboard-controller son peers obligatorios
  del stack SDK 58. El barrel puede componerlos sin implementar otra alternativa.
- Las dependencias realmente opcionales conservan subpath y peer opcional; ningún peer
  usa `*` o mínimos sin límite superior.
- No hay controlador de barras en el design system. El host usa un solo
  `expo-status-bar` y `expo-system-ui`; Storybook hace de host independiente.
