# Estructura & clasificación — `@sincpro/mobile-ui`

> Cómo está organizado el design system y **dónde va cada cosa**. Regla de oro: la carpeta indica
> el _tier de composición_ y la _responsabilidad_. Si dudás dónde poner un componente nuevo, esta
> tabla decide.

## Convención de nombres

- **`PascalCase/`** = namespace de componentes exportado como **compound** (`Display`, `Form`, `Dialog`, `Feedback`, `Navigation`, `Typography`). Cada archivo es `Namespace.Componente.tsx` y se agrega al barrel `index.ts` del namespace.
- **`lowercase/`** = **tier estructural** (`tokens`, `primitives`, `layouts`, `views`, `widgets`, `icons`, `utils`, `theme`).

## Tiers (de fundamento a producto)

| Carpeta       | Responsabilidad                                           | Qué vive acá                                                                                                             | Qué NO va acá                              |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `tokens/`     | Valores de diseño en TS que `className` no puede expresar | `motion` (duration/easing/spring). zIndex/opacity → **clases** del preset, no acá                                        | colores/spacing/radius (→ preset/CSS-vars) |
| `theme/`      | Runtime del tema                                          | `active`, `useTheme`, `define/extend/merge`, `css-vars`, `tw` (cn/tv), `dark`/`default`                                  | componentes                                |
| `primitives/` | Átomos estructurales sin semántica de dominio             | `Box`, `Row`, `Stack`, `BaseButton`, `Pressable`, `GlassSurface`                                                         | nada con estado de negocio                 |
| `Typography/` | Texto                                                     | `Text`, `Heading`                                                                                                        |                                            |
| `Display/`    | **Mostrar datos** (presentacional puro)                   | `Badge`, `Avatar`, `Card`, `Chip`, `Accordion`, `ListItem`, `Icon`, `Monetary`, `Date`, `Divider`, `CopyableText`        | estado de app, inputs                      |
| `Form/`       | **Entrada de datos**                                      | `Input`, `Button`, `Switch`, `Checkbox`, `RadioButton`, `Dropdown`, `SearchBar`, `Monetary/QuantityInput`, `Controlled*` | display puro                               |
| `Feedback/`   | **Comunicar estado de la app**                            | `Loading`, `Spinner`, `Skeleton`, `Progress`, `Banner`, `Empty`, `Error`, `Toast` (Provider+hook), `ErrorBoundary`       | datos del dominio                          |
| `Dialog/`     | Overlays modales                                          | `Confirmation`, `EditValue`, `BottomSheet`                                                                               |                                            |
| `Navigation/` | Navegación intra-pantalla / barras                        | `Header`_, `HeaderToolbar`_, `TabBar`, `TabItem`, `RowItem`, `SegmentedControl`, `Tabs`                                  | layouts de ruta (van en el core)           |
| `layouts/`    | Contenedores presentacionales                             | `Container`, `ScrollContainer`, `GradientContainer`, `AuthContainer`, `PlainLayout`, `TabNavigatorLayout`                | layouts router-aware (core)                |
| `views/`      | Templates compuestos (patrones de pantalla)               | `FormViewV2`, `ListViewV2`, `AuthFormView`, `Wizard`                                                                     |                                            |
| `widgets/`    | Composiciones genéricas listas                            | `HomeHeader`\*, `MenuGrid`, `MenuCard`, `CircleButton`, `GeoPermissionCard`, `TimeZoneSelector`                          |                                            |
| `icons/`      | Iconos SVG                                                | componentes de icono                                                                                                     | lógica de dominio (sacar `icon_getters`)   |
| `utils/`      | Helpers genéricos                                         | `date`, `monetary`, `quantity`, `serializer`, `timezone`, `icon`                                                         |                                            |

`*` = piezas con estética vieja, mantenidas por **retrocompat**; el rumbo es un Header de estilo propio (ver plan UD6).

## Cómo decidir la categoría (árbol rápido)

1. ¿Es un valor de diseño (tiempo/animación)? → `tokens/`. (Color/medida → preset, como clase.)
2. ¿Es un átomo sin semántica (caja, fila, pressable)? → `primitives/`.
3. ¿El usuario **ingresa** datos? → `Form/`.
4. ¿Comunica **estado** (cargando, vacío, error, progreso, aviso)? → `Feedback/`.
5. ¿**Muestra** datos (badge, card, fila, chip)? → `Display/`.
6. ¿Es overlay modal? → `Dialog/`. ¿Navegación intra-pantalla? → `Navigation/`.
7. ¿Es una pantalla-template? → `views/`. ¿Composición lista de varios? → `widgets/`.

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
