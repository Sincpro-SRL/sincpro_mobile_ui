# Migración a v2

v2 es una major intencional: los contratos mejorados pasan a ser estándar, sin un modo
legacy que permita desactivar el tamaño accesible o elegir el renderer RN anterior.
Composición, fuentes, estilos, slots, contenido y política de datos siguen perteneciendo
a la app; no se introduce una segunda identidad visual.

## 1. Dependencia de imágenes requerida

En cada app host:

```sh
npx expo install expo-image
```

Actualizar `@sincpro/mobile-ui` desde el registry a la major 2. En apps Yarn, actualizar
también `resolutions`. Recompilar development builds/binarios nativos después de instalar
el peer; el DS no instala módulos en runtime ni oculta su ausencia.

Todos los logos, imágenes de catálogo, stories y estados ilustrados usan Expo Image.
`Display.Image` añade skeleton/fallback/retry; `Display.ExpoImage` ofrece acceso directo
al renderer común, también importable desde `@sincpro/mobile-ui/Display/ExpoImage`.
Las texturas e iconos SVG siguen en `react-native-svg`, no son otra ruta de fotos.

## 2. API de imágenes

| Antes                                      | v2                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `resizeMode="cover"`                       | `contentFit="cover"`                                               |
| `resizeMode="contain"`                     | `contentFit="contain"`                                             |
| `resizeMode="stretch"`                     | `contentFit="fill"`                                                |
| `resizeMode="center"`                      | `contentFit="none"`                                                |
| `resizeMode="repeat"`                      | Componer una textura SVG; no hay conversión equivalente para fotos |
| `defaultSource` / `loadingIndicatorSource` | `placeholder`                                                      |
| `onError(event.nativeEvent.error)`         | `onError(event.error)`                                             |
| `onLoad(event.nativeEvent.source)`         | `onLoad(event.source)`; disponible `cacheType`                     |

Fuentes: assets `require()`, URLs, arrays, metadata Expo y referencias de imágenes nativas.
El tipo compartido es `ImageSource` de `@sincpro/mobile-ui/utils/image`.
Las referencias nativas conservan identidad sin serialización; cambiar fuente/metadata
reinicia el estado del frame. Retry remonta el intento y los eventos de un intento anterior
no pueden completar el nuevo.

El renderer usa caché en disco y sin transición por defecto. `cachePolicy="none"` permanece
disponible para tareas donde persistir es inapropiado; usar memoria es una decisión de
consumo, no una obligación del DS. No prefetchear toda una colección.
`recyclingKey` deriva de la fuente si no se suministra. Se puede dar una identidad del host.
Transición, autoplay y efectos SF respetan Reducir movimiento en vivo.

```tsx
<Display.Image
  source={{ uri: photoUrl }}
  contentFit="contain"
  accessibilityLabel="Foto del producto"
  onError={({ error }) => reportImageError(error)}
/>
```

`style` de Display.Image sigue aplicándose a la imagen; `containerStyle` al frame.
`placeholderContentFit` coincide con `contentFit` si no se configura, evitando cambios
de escala entre placeholder e imagen final.

## 3. Accesibilidad sin opt-in

Eliminar `accessibleSizing` de componentes, wrappers, prop spreading y recetas.
No reemplazarlo por `false`: el prop ya no existe.

Los controles que antes exponían ese flag usan siempre su camino accesible de 48 puntos:
acciones/íconos/FAB, BaseButton, controles de formulario, AppBar/BottomNav/SearchBar/
SegmentedControl, acciones de ListItem, recuperación EmptyState/Error y cierre de Sheet.
Labels de botones/segmentos se amplían y envuelven por defecto.
Conservar nombres explícitos en acciones solo-icono y no desactivar system font scaling.
Al cambiar estilos, la app sigue siendo responsable de no degradar targets, contraste
o lectura; quitar un flag no certifica personalizaciones arbitrarias.

Revisar padding de pantallas, barras y footers con las nuevas alturas; no reducir targets
para evitar ajustar el layout. Probar contenido largo, pantalla estrecha y fuente al 200%.

## 4. Lo que no cambia

ListView continúa con FlatList y conserva sus APIs de virtualización, selección y
paginación. Una autorización para breaking changes no demuestra que FlashList sea más
rápido en las apps; se mantiene como evaluación condicionada a benchmarks release.
No se incorpora router, red, caché de negocio ni persistencia a los componentes.

## 5. Validación antes de adoptar

Tipos/build/tests y bundling cubren cableado y contratos. En cada host: validar carga/
fallo/retry/cambio de fuente, imágenes animadas bajo Reducir movimiento, targets efectivos,
layout con texto ampliado y navegación con VoiceOver/TalkBack. Comparar FPS/memoria en
release antes de atribuir mejoras de velocidad al cambio de renderer.
