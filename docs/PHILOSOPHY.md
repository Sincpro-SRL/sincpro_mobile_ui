# Filosofía — `@sincpro/mobile-ui`

> Por qué existe este design system y cómo decidimos. Si vas a agregar o cambiar algo, esto explica
> el _criterio_; `STRUCTURE.md` explica el _dónde_; `CATALOG.md` lista los componentes.

## Qué es (y qué no)

- **Es** un set de componentes **presentacionales puros**, mobile-first (React Native / Expo), que varias apps consumen vía npm.
- **No es** un framework de dominio: no tiene lógica de negocio, red, navegación de rutas ni stores. Recibe datos por props y emite eventos por callbacks.
- **No es** una UI de escritorio adaptada: cada componente se diseña para **el pulgar, la pantalla chica y el gesto táctil**, no para mouse/hover.

## Los 6 principios

1. **Mobile-first de verdad.** Targets táctiles ≥44px, `hitSlop`, gestos (swipe), bottom-sheets en vez de dropdowns, safe-area en todo lo que flota, pensado para una mano. Si un patrón solo tiene sentido con mouse/teclado, no va.
2. **NativeWind-first.** El estilo se expresa con `className` (Tailwind). El objeto JS (`theme.x`) es un _escape hatch_ solo para lo que className no puede: props nativas (`placeholderColor`), gradientes, sombras, y **superficies dentro de `<Modal>`** (las CSS-vars no cruzan el portal nativo → ahí va color inline).
3. **Tokens como fuente de verdad.** Color/spacing/radio salen del theme (CSS-vars); animación de `tokens/motion`; layering de las clases `z-*`. Nada de hex sueltos. Reestilizar = cambiar tokens, no editar componentes.
4. **Extensible sin forkear.** Se extiende agregando una `variant` (tailwind-variants), pasando `className`, o componiendo — nunca copiando un componente para tunearlo. Rediseños que rompen API van en `next/` y coexisten.
5. **Retrocompatible.** Hay apps en producción. Todo cambio es **aditivo** por defecto (minor); lo que rompe es opt-in y se deprecia con camino de migración. Nunca cambiamos cómo se ve una pantalla existente sin que la app lo adopte.
6. **Liviano para el build.** Subpath exports + barrels finos → tree-shaking real. Deps nativas pesadas/opcionales (`expo-glass-effect`, etc.) como peer opcional expuesto solo por subpath, para que una app que no las usa no las cargue.

## Accesibilidad y calidad (no negociable)

Todo componente nuevo trae: `accessibilityRole`/`accessibilityLabel`/`accessibilityState`, `hitSlop` en táctiles, `testID`, soporte dark (vía tokens), estados (loading/empty/error/disabled donde aplique) y una story que lo muestra en light/dark.

## Lenguaje visual (estilo objetivo 2026)

> El DS arrastra un look heredado de "app X" con **gradientes forzados** (botones `primary`/`accent` con `LinearGradient`, headers con `GradientContainer`). **No es el estilo objetivo.** El lenguaje moderno es:

- **Flat / minimal**: superficies tokenizadas (`bg-bg-card`/`bg-bg-page`) + **hairline** (`border-border-light`) + sombra sutil. Sin gradiente por defecto.
- **Color con intención**: `primary` para el estado activo y CTAs; el resto en neutros. El gradiente es **opt-in**, no la norma.
- **Aire y jerarquía** por tipografía/spacing, no por bloques de color.
- **Cómo se introduce sin romper v1**: los componentes con look viejo se **deprecan** (`@deprecated` JSDoc, siguen exportados) y se entregan equivalentes flat nuevos. Ej: `Navigation.Header`/`HeaderToolbar`/`ScreenHeader`/`HomeHeader` → **`Navigation.AppBar`**; `Navigation.TabBar` (glass) → **`Navigation.BottomNav`**. El rediseño de `Button` (gradiente→flat) es el próximo paso y, por ser core, irá vía `next/` o variante opt-in (no se cambia el default v1).

## Padding & safe-area: ¿interno o externo?

> Duda recurrente: ¿el padding lo pone el componente o la app? Regla:

- **Padding interno (lo pone el DS, principio fijo)**: el espaciado _dentro_ del componente (entre icono y texto, alto de la barra, gutters de las filas). Consistente, no configurable — es parte de la identidad.
- **Contexto externo (lo controla quien lo usa)**: márgenes de pantalla, posición, y la **safe-area**. Las barras que viven al borde (`AppBar`, `CollapsingHeader`, `BottomNav`) reservan la safe-area por defecto (`safeArea={true}`) porque ese es el caso real (arriba/abajo de pantalla), **pero es un prop**: `safeArea={false}` al embeber (dentro de un `FloatingBar`, en demos, o en layouts anidados) para no duplicar el espacio del status/nav bar. Síntoma de no respetarlo: padding-top/bottom "de más" al apilar barras o anidarlas.

## Estrategia híbrida `@expo/ui` + NativeWind (2026-06)

> `@expo/ui` (SDK 56) es **estable, en Expo Go, oficial de Expo** (60+ componentes nativos SwiftUI/Compose). Pero **no toma `className`/tokens** y se ve como el OS (Material/Cupertino). Decisión: **híbrido**.

- **Nativo (`@expo/ui` u otra lib nativa)** — para primitivos donde el _comportamiento/feel nativo_ vale más que la marca: **date/time pickers** (`Form.DatePicker` sobre `@react-native-community/datetimepicker` ✅), `Switch`, `BottomSheet`/`ContextMenu`. Tinte vía props/`modifiers`, no className.
- **Lección (no todo nativo gana)**: el `Slider` de `@expo/ui` se probó y **se descartó** — su estilo Material con ticks no respeta los tokens y se ve peor que un slider tokenizado. `Form.Slider` volvió a `@react-native-community/slider` (track en `primary`, limpio). Regla: nativo **solo** cuando mejora UX _sin_ romper la marca; si el control nativo se ve "ajeno", gana el tokenizado.
- **Marca (NativeWind+tokens)** — para la _capa visual de identidad_, que DEBE verse igual en iOS/Android: `Button`, `Card`/`ProductCard`/`MediaCard`, `Badge`/`Chip`/`Tag`, `Typography`, `AppBar`/headers, listas, feedback. Acá lo nativo fragmentaría el look y tiraría los tokens.
- **Empaque**: los componentes sobre `@expo/ui` (o gorhom) se exponen **solo por subpath** con la dep como **peer opcional** → el barrel de la categoría NO arrastra el módulo nativo. Verificado: `dist/Form/index.js` con 0 refs a `@expo/ui`; `Form/Form.Slider` lo importa externo.
- **Por qué híbrido y no 100% nativo**: un design system existe para dar **look de marca consistente**; 100% `@expo/ui` deja de serlo (se ve como cada OS) y descarta la arquitectura de tokens. El híbrido toma lo nativo donde suma sin perder la identidad.

## Decisiones técnicas aprendidas (gotchas)

- **No RN `Pressable` con `className`**: el interop de NativeWind entra en loop de re-render al tocar → freeze. Usar `primitives/Pressable` (sobre `TouchableOpacity`).
- **No `className` que cambia por estado en táctiles**: className estático + estado por `style` inline (tokens).
- **Animación de pulse/loops**: `Animated` nativo (`useNativeDriver`), no reanimated strict-mode, para evitar el warning "reading value during render" en listas.
- **Superficies en `<Modal>`**: color/elevación por `style` inline (las CSS-vars no cruzan el portal; la elevación Android necesita bg en la misma view).

## Norte de producto (para qué tipo de apps)

Pensamos el DS para construir, sin reinventar, pantallas tipo **marketplace / delivery / social / fintech** (Rappi, PedidosYa, Uber, Airbnb, Instagram): listas e imágenes performantes, tarjetas de producto, métricas/KPIs, datos tabulados, carruseles de promos, flujos por pasos, feedback en cola. Los _building blocks_ (Image, Card, StatCard, DataTable, Carousel, PriceTag, Rating…) se componen en esas pantallas; el DS no trae la pantalla de negocio, trae las piezas.
