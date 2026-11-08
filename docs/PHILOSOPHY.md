# Filosofía — `@sincpro/mobile-ui`

> Por qué existe este design system y cómo decidimos. Si vas a agregar o cambiar algo, esto explica
> el _criterio_; `STRUCTURE.md` explica el _dónde_; `CATALOG.md` lista los componentes.

## Qué es (y qué no)

El [manifiesto de composición y personalización](./MANIFESTO.md) define el objetivo
permanente del sistema. Los defaults visuales son un punto de partida, no una restricción:
la prioridad actual es comportamiento reutilizable y extensión mediante APIs públicas,
no un rediseño general ni una escala visual obligatoria.

- **Es** un set de componentes **presentacionales puros**, mobile-first (React Native / Expo), que varias apps consumen vía npm.
- **No es** un framework de dominio: no tiene lógica de negocio, red, navegación de rutas ni stores. Recibe datos por props y emite eventos por callbacks.
- **No es** una UI de escritorio adaptada: cada componente se diseña para **el pulgar, la pantalla chica y el gesto táctil**, no para mouse/hover.

## Los 6 principios

1. **Mobile-first de verdad.** Targets táctiles ≥44px, `hitSlop`, gestos (swipe), bottom-sheets en vez de dropdowns, safe-area en todo lo que flota, pensado para una mano. Si un patrón solo tiene sentido con mouse/teclado, no va.
2. **NativeWind-first.** El estilo se expresa con `className` (Tailwind). El objeto JS (`theme.x`) es un _escape hatch_ solo para lo que className no puede: props nativas (`placeholderColor`), gradientes, sombras, y **superficies dentro de `<Modal>`** (las CSS-vars no cruzan el portal nativo → ahí va color inline).
3. **Tokens como defaults compartidos.** Color/spacing/radio salen del theme (CSS-vars); animación de `tokens/motion`; layering de las clases `z-*`. Identidad global vía tokens; ajustes locales vía `className`, `style` y slots, sin editar componentes.
   - **Capas (2026):** fills semánticos (`primary`) → **containers** (`container.success` + `onSuccess`) → superficies tonales (`bg.containerLowest|container|containerHigh`) → **state layers** (`state.press`) → **material** chrome (`material.blur` para nav/glass). Badges/chips usan containers, no fill saturado + blanco.
   - **Contrato de color:** `primary` / `accent` = superficies y chrome (fills, borders, tracks). Texto/links/labels con color de marca = `text.accent` (AA sobre `bg.page`/`bg.card`). Tinta sobre un fill de marca = `text.onPrimary` / `text.onAccent` vía `resolveOnColor(fill)`. Rebrand rápido: `buildThemeFromBrand({ brand, mode })`.
4. **Extensible sin forkear.** `className`, `style`, `children`, slots y render props permiten modificar presentación y composición sin copiar el componente. Las variantes son conveniencias, no el límite de personalización. Rediseños que rompen API requieren una adopción explícita.
5. **Versionado explícito.** Minor/patch preservan contratos. Una mejora incompatible autorizada se publica como major con guía de migración; no se conserva una implementación inferior solo por compatibilidad. v2 hace obligatorios Expo Image y los tamaños accesibles antes opt-in.
6. **Liviano para el build.** Subpath exports + barrels finos → tree-shaking real. Deps nativas pesadas/opcionales (`expo-glass-effect`, etc.) como peer opcional expuesto solo por subpath, para que una app que no las usa no las cargue.

## Accesibilidad y calidad (no negociable)

Todo componente nuevo trae: `accessibilityRole`/`accessibilityLabel`/`accessibilityState`, `hitSlop` en táctiles, `testID`, soporte dark (vía tokens), estados (loading/empty/error/disabled donde aplique) y una story que lo muestra en light/dark.

### Contratos de interacción

- **Jerarquía:** título de pantalla, sección, etiqueta, valor y ayuda deben distinguirse sin
  depender exclusivamente del color. Títulos con semántica de header.
- **Agrupación Sincpro:** filas relacionadas comparten una superficie o proximidad,
  con separadores hairline y distancia entre grupos mayor que entre filas. No convertir
  cada fila en una card ni usar sombras para todo. `ListGroup` y el modo móvil de
  `ListItem` preservan fondos cálidos, acentos existentes y familias tipográficas configurables.
- **Personalización:** tema/fuentes para identidad global; `className`, superficies y slots
  para composición local. Extender el sistema existente, no crear otra paleta.
  El nuevo `bodyReadable` de 17 puntos es opt-in; no cambia el `body` legacy.
- **Libertad de composición:** las stories enseñan posibilidades, no imponen una pantalla.
  Combinar icono, texto, imagen de apoyo y acciones con roles distintos; una miniatura
  no debe competir con el contenido principal. Abrir y guardar son targets hermanos.
- **Filtros móviles:** búsqueda y filtros son estados independientes. Chips rápidos aplican
  al tocar; decisiones avanzadas usan borrador y confirmación. Mostrar selección, resultado
  y recuperación. `FilterBar` compone controles, pero no conoce datos ni reglas de negocio.
  Auto usa scroll horizontal y pasa a wrap con fuente ampliada; el consumidor puede elegir.
- **Consulta estructurada:** no confundir chips con un builder. Campos/operadores vienen
  de la configuración; grupos expresan todas/cualquiera/ninguna. Ordenar y agrupar tienen
  prioridades visibles y acciones de mover sin depender de drag. Guardados conservan
  búsqueda, filtros, orden y niveles; cargar no equivale a aplicar. El host ejecuta/persiste.
- **Teclado y formularios:** un único scroll consciente del teclado mantiene visible el
  campo activo; anterior/siguiente/ocultar siguen disponibles en teclados sin Return.
  Agrupar los campos navegables, omitir solo lectura y conservar newline en multiline.
  No confundir ocultar teclado con guardar. No anidar un scroll de canvas con el del form.
- **Catálogo por responsabilidad:** estados con su componente y recetas por tarea.
  UX es transversal; no justifica otra categoría de stories con piezas sin relación.
- **Énfasis:** una acción de máximo énfasis por contexto de tarea. Un modal es otro contexto;
  las excepciones se justifican. Las acciones secundarias no compiten con la principal.
- **Tacto:** los controles migrados usan targets de al menos 48 puntos en ambas plataformas.
  `accessibleSizing` fue eliminado en v2: accesibilidad no es un modo opt-in.
  `hitSlop` no sustituye verificar límites del padre y solapamiento con otros controles.
- **Lectura:** probar texto al 200%, contenido largo y pantalla estrecha. El contenido
  esencial debe seguir disponible; no resolver problemas ocultándolo o desactivando scaling.
- **Feedback:** copiar o guardar comunica resultado solo después de completar la operación.
  Un fallo conserva el trabajo y ofrece recuperación, sin éxito ficticio.
- **Movimiento de carga:** respetar Reducir movimiento del sistema y conservar un indicador
  estático con nombre/estado accesible, sin inventar porcentajes. `animated={false}` permite
  desactivar animación localmente; `true` no fuerza movimiento contra la preferencia.
  El contrato está implementado en Skeleton/Progress/Spinner/Loading; otras animaciones
  requieren revisión propia, no quedan certificadas por compartir tokens.
- **Texto y datos:** un valor corto usa el icono conocido de copia y tap sobre el dato;
  el check confirma sin agregar bloques ni mover el layout. Texto largo conserva selección
  nativa con una acción separada para copiar todo. El consumidor elige `selectable`
  según la tarea, no por una heurística de longitud o supuestos de dominio.
  `Typography.SelectableText` usa texto nativo de solo lectura sin teclado: en iOS
  `Text selectable` solo copia el párrafo completo y no permite seleccionar un fragmento.
- **Tareas acotadas:** action sheet para pocas decisiones; sheet para una tarea relacionada
  con la pantalla, sin apilar hojas. Filtros tienen borrador/confirmación; archivar reversible
  ofrece Deshacer en vez de confirmaciones rutinarias que el usuario aprende a ignorar.
- **Gestos:** acciones esenciales tienen alternativa visible al swipe o pulsación larga.
- **Validación:** pruebas de props y capturas no certifican VoiceOver/TalkBack ni usabilidad.
  Se complementan con revisión nativa y pruebas de tareas.

El [plan UX/UI](./UX-UI-PLAN.md) separa implementación, validación pendiente y adopción.

`Dialog/NativeSheet` adopta el bottom sheet nativo de Expo 58 por subpath opcional:
presentación SwiftUI/Material3 y contenido de marca con tokens. El tema se reinyecta dentro
del portal nativo; no se reemplaza todo el catálogo por controles visualmente ajenos.

## Lenguaje visual (opciones, no una migración automática)

Los tratamientos siguientes son posibilidades de composición. No invalidan los gradientes,
radios, fuentes ni tamaños originales, ni autorizan a sustituirlos en componentes existentes.
El consumidor decide cuándo y cómo adoptarlos:

- **Flat / minimal**: superficies tokenizadas (`bg-bg-card`/`bg-bg-page`) + **hairline** (`border-border-light`) + sombra sutil como una opción, sin eliminar defaults con gradiente.
- **Color con intención**: `primary` para fills/CTAs; `text.accent` para texto brand; el resto en neutros. El consumidor puede elegir gradientes o superficies planas.
- **Aire y jerarquía** por tipografía/spacing, no por bloques de color.
- **Modernización SDK 58**: la adopción breaking está autorizada; se borran las APIs
  legacy ya marcadas y sus exports. La personalización visual sigue disponible mediante
  tokens, estilos y slots públicos, sin conservar otro motor por compatibilidad.

## Padding & safe-area: ¿interno o externo?

> Duda recurrente: ¿el padding lo pone el componente o la app? Regla:

- **Padding interno (default del DS, personalizable)**: el espaciado _dentro_ del componente (entre icono y texto, alto de la barra, gutters de las filas) tiene un default consistente. Se puede ajustar mediante tokens, `className`, `style` o estilos de slots públicos; no es una restricción de identidad. Si una región no lo permite todavía, es una limitación por resolver.
- **Contexto externo (lo controla quien lo usa)**: márgenes de pantalla, posición, y la **safe-area**. Las barras que viven al borde (`AppBar`, `CollapsingHeader`, `BottomNav`) reservan la safe-area por defecto (`safeArea={true}`) porque ese es el caso real (arriba/abajo de pantalla), **pero es un prop**: `safeArea={false}` al embeber (dentro de un `FloatingBar`, en demos, o en layouts anidados) para no duplicar el espacio del status/nav bar. Síntoma de no respetarlo: padding-top/bottom "de más" al apilar barras o anidarlas.

## Estrategia `@expo/ui` + NativeWind (SDK 58)

`@expo/ui` es el motor oficial de controles y sheets. NativeWind conserva la
presentación de marca; los controles nativos reciben tintes y modifiers públicos.

- **Nativo (`@expo/ui`)** — date/time picker, slider, selección, menú, segmented control
  y una sola Sheet sobre `community/bottom-sheet`. No se conserva gorhom, otra Sheet
  propia ni el picker/slider de react-native-community.
- **Marca (NativeWind+tokens)** — para la _capa visual de identidad_, que DEBE verse igual en iOS/Android: `Button`, `Card`/`ProductCard`/`MediaCard`, `Badge`/`Chip`/`Tag`, `Typography`, `AppBar`/headers, listas, feedback. Acá lo nativo fragmentaría el look y tiraría los tokens.
- **Empaque**: `@expo/ui` es obligatorio. El host lo instala explícitamente con Expo;
  un peer opcional no puede ocultar una dependencia usada por el catálogo habitual.
- **Iconos y listas**: `Display.Icon` usa SF Symbols/Material mediante `ICON_MAP`.
  ListViewV2, timezone y opciones de edición usan FlashList v2, sin clones de entidades.
- **Barras y teclado**: el host controla las barras con Expo, cada borde tiene un dueño
  y keyboard-controller coordina campo, toolbar y CTA. No hay StatusBar/KeyboardAvoidingView
  de RN dentro de layouts.
- **Por qué híbrido y no 100% nativo**: un design system existe para dar **look de marca consistente**; 100% `@expo/ui` deja de serlo (se ve como cada OS) y descarta la arquitectura de tokens. El híbrido toma lo nativo donde suma sin perder la identidad.

## Decisiones técnicas aprendidas (gotchas)

- **No RN `Pressable` con `className`**: el interop de NativeWind entra en loop de re-render al tocar → freeze. Usar `primitives/Pressable` (sobre `TouchableOpacity`).
- **No `className` que cambia por estado en táctiles**: className estático + estado por `style` inline (tokens).
- **Animación de pulse/loops**: `Animated` nativo (`useNativeDriver`), no reanimated strict-mode, para evitar el warning "reading value during render" en listas.
- **Superficies en `<Modal>`**: color/elevación por `style` inline (las CSS-vars no cruzan el portal; la elevación Android necesita bg en la misma view).

## Norte de producto (para qué tipo de apps)

Pensamos el DS para construir, sin reinventar, pantallas tipo **marketplace / delivery / social / fintech** (Rappi, PedidosYa, Uber, Airbnb, Instagram): listas e imágenes performantes, tarjetas de producto, métricas/KPIs, datos tabulados, carruseles de promos, flujos por pasos, feedback en cola. Los _building blocks_ (Image, Card, StatCard, DataTable, Carousel, PriceTag, Rating…) se componen en esas pantallas; el DS no trae la pantalla de negocio, trae las piezas.
