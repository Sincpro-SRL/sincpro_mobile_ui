# Calidad móvil: investigación, plan y siguiente iteración

Fecha: 2026-11-06. Investigación pública, seguida de inspección de código, implementación
y ciclos de pruebas. No es una certificación de todo el catálogo ni un benchmark nativo.

## Decisión v2: un único camino estándar

La migración breaking está autorizada. Expo Image pasa a ser requerido y todos los
renderers de fotos/logos/ilustraciones lo usan. Los tamaños accesibles dejan de ser opt-in:
se elimina `accessibleSizing` y su rama legacy. Estilos, contenido y composición siguen
abiertos, sin permitir que una implementación antigua sea el camino predeterminado.
La guía para apps consumidoras es [MIGRATION-V2](./MIGRATION-V2.md).

## Lo aprendido de referentes

| Referente oficial                                                                                                                       | Evidencia                                                                           | Aplicación al sistema                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)                                                                          | Caché disco/memoria, placeholders, reciclado y downscaling                          | Renderer común requerido; elegir política por tarea, no cachear todo en memoria      |
| [FlashList v2](https://shopify.github.io/flash-list/docs/v2-migration/)                                                                 | Requiere New Architecture; cambia refs/layout y exige cuidado con props/memoización | Evaluar con datos reales, no cambiar FlatList automáticamente                        |
| [Apple Design Awards 2026](https://developer.apple.com/design/awards/)                                                                  | Guitar Wiz: Inclusivity, VoiceOver y ajustes de lectura/percepción                  | Nombres/hints, texto escalable y pruebas combinando ajustes; no copiar su estética   |
| [Apple Design Awards 2025](https://www.apple.com/newsroom/2025/06/apple-unveils-winners-and-finalists-of-the-2025-apple-design-awards/) | Speechify y Art of Fauna premiados en Inclusivity                                   | Accesibilidad como parte de la tarea, no solo roles aislados                         |
| [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)                                                                      | Feedback de selección/resultado, sujeto a disponibilidad del sistema                | Refuerzo opcional; nunca sustituir señal visual/VoiceOver ni vibrar cada interacción |
| [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)                                                        | Preferencias del sistema y eventos de cambio                                        | Reutilizar useReducedMotion para transiciones/playback, no solo spinners             |
| [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/)                                                  | Resumen ordenado, mensajes inline iguales y retorno al campo                        | Adaptar con refs nativos `.focus()` y KeyboardForm, conservando borradores           |

Expo Image es first-party, pero **no se asume instalado por usar Expo**: el host debe
instalarlo. Es un peer requerido y devDependency de este repo para build/stories.
Las capacidades documentadas no prueban una mejora de FPS, consumo o latencia en nuestras
apps. Ese resultado necesita medición en release y dispositivos reales.

## Plan ejecutado

1. **Media fiable:** corregir estado atascado tras error/cambio de fuente en Display.Image,
   propagar eventos y ofrecer recuperación por composición.
2. **Media optimizable:** ExpoImage común para fotos, logos, stories e ilustraciones,
   cache/recycling automático, NativeWind y respeto de movimiento reducido; migración
   explícita en major 2, incluyendo contratos de fuente y eventos.
3. **Listas grandes:** mantener FlatList, abrir controles de ventana/batching/layout/
   viewability/refs, selección externa y fin de paginación; reducir invalidaciones de contexto.
4. **Controles móviles:** tamaños de 48 y texto escalable como estándar, sin flag legacy,
   conservando fuentes/paleta configurables y estados disabled accesibles.
5. **Testing e iteración:** comprobar contratos reales, corregir fallos encontrados,
   validar tipos/stories/build y gate; separar mocks de validación nativa pendiente.

## Segunda iteración: APIs abiertas con comportamiento compartido

1. **Movimiento vivo:** un store compartido sustituye queries/listeners por hook. Una prueba
   con 100 consumidores exige exactamente una consulta y una suscripción nativa. Eventos
   nuevos ganan a consultas tardías; un árbol desmontado no modifica un nuevo ciclo.
   Sheets reutilizan un helper de animación/cancelación. Modals RN, toast, accordion,
   dropdown, dock y overlays relacionados respetan cambios en vivo.
2. **Carga honesta:** DomainSplashScreen solo termina con `isLoading=false`, respeta
   `minDuration`, conserva hijos/borradores y limpia callbacks/timers/animación.
3. **Navegación sin gestos obligatorios:** Carousel añade controles/estado controlado,
   labels y slots. Las pruebas cubren rechazo repetido de swipes, geometría al reducir
   datos y espacio final medido para cards menores que el viewport.
4. **Recuperación de formulario:** ErrorSummary adapta el patrón GOV.UK con refs nativos,
   selección ordenada, anuncio oportuno y drafts conservados dentro de KeyboardForm.
5. **Customización sin forks de lógica:** slots de header/error/loading/controls, estilos y
   props nativas. La app conserva tipografía y contenido; callbacks, ciclo, selección y
   validación viven fuera de los renderers. Controles completamente custom mantienen sus
   responsabilidades de nombres, disabled y accesibilidad.

También se corrigió el backdrop ancestro de Dropdown/Confirmation: taps interiores,
especialmente en opciones disabled, no deben provocar un cierre exterior accidental.
No se añadió ningún peer ni se cambió el motor de listas.

## Contrato de listas

`ListViewV2.Content listProps` expone un conjunto deliberado de props de FlatList:
`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `updateCellsBatchingPeriod`,
`removeClippedSubviews`, `extraData`, `getItemLayout`, `onViewableItemsChanged`,
`viewabilityConfig`, `onEndReachedThreshold` y `maintainVisibleContentPosition`.
No permite reemplazar data/renderItem/keys/refresh por accidente.
`listRef` permite scroll imperativo; `contentContainerStyle` permite personalizar contenido.

- Los renderers de `Content` y los callbacks de Root reciben el item original, sin clonarlo
  ni agregarle campos. Esto preserva getters, campos privados `#` y objetos congelados.
  El segundo argumento del renderer contiene `{ item, id, index, rowTitle, rowSubtitle,
readonly }`; `toRowItem` / `toRowItems` devuelven esos wrappers, no entidades extendidas.
  Para metadatos usar `(item, row) => ...`, no `item.index` ni `item.rowTitle`.
- Defaults de virtualización de RN preservados; threshold sigue siendo 0.5.
- `getItemLayout` solo cuando altura y separadores son realmente conocidos. Revisar
  font scaling; una estimación incorrecta causa errores de scroll, no una optimización.
- Mantener estables `viewabilityConfig` y la presencia de `onViewableItemsChanged`
  durante el montaje: son restricciones de FlatList, no un wrapper que las oculta.
- `extraData` invalida filas para selección/estado externo; conservar IDs estables.
- `hasMore` en Root es true por defecto; false detiene solicitudes terminales.
  `loadingMore` y refresh pausan onLoadMore. El host controla carga, errores, reintentos
  y coalescing de requests; el DS no es un fetcher ni elimina llamadas por heurísticas.
- El valor de contexto está memoizado: consumidores memoizados no se invalidan por un
  render padre sin cambios de datos/props. No evita renders cuando realmente cambia estado.
- El padding de safe-area existente se conserva por defecto. Si se sobrescribe
  paddingBottom, el host debe reservar el espacio requerido.

`ListViewV2.Header` y `FormViewV2.Header` reservan el inset superior por defecto.
Usar `safeArea={false}` cuando una cabecera nativa o un contenedor padre ya lo reserva.
El `HomeHeader` legacy sigue el mismo contrato y conserva sus 40px de padding interno
dentro del degradado, además del inset superior.
`AuthContainer` usa el degradado `brand` por defecto (un `background` explícito lo
sobrescribe): su encabezado ocupa 30% del espacio disponible después del safe-area y
la tarjeta flexible recibe el resto, sin un `minHeight` basado en toda la ventana.

### Barra de estado y edge-to-edge

`Container` reserva los cuatro bordes por defecto y elige iconos blancos o negros
según `theme.bg.page`; `ScrollContainer` usa `theme.bg.card`. Cambiar el tema actualiza
los iconos sin remontar. No se fija un estilo blanco/oscuro independientemente del fondo.

Una cabecera que reserva su propio inset (`AppBar`, `CollapsingHeader`, `HomeHeader`)
controla también la barra de estado. `AuthContainer` / `AuthFormView` usan el color
inicial del degradado, resuelto desde el mismo preset que dibuja el fondo.
`ListViewV2.Header` y `FormViewV2.Header` propagan `barStyle` a AppBar.

Cuando la cabecera dibuja detrás de la barra, usar `Container edges={["bottom", "left",
"right"]}`: el contenedor no añade una franja superior ni monta otro StatusBar. Si el
padre ya reserva el borde, usar `safeArea={false}` en la cabecera embebida.
No se cambia el default de bordes de Container porque también sirve a pantallas sin header.

`barStyle` explícito conserva precedencia, también sin inset superior.
`statusBarHidden` conserva el control explícito de visibilidad de Container.
Para fondos personalizados por `className` / `style`, degradados diagonales o varios
colores con distinto contraste en el borde superior, indicar `barStyle` apropiado:
la selección automática no puede resolver un CSS arbitrario ni garantizar contraste
en cada píxel de un degradado. El host sigue siendo responsable del foco de las rutas
que mantienen pantallas montadas y de la configuración de barras de su navegador.
No se usan `backgroundColor` ni `translucent` de StatusBar, ignorados bajo edge-to-edge.

La story Large List usa 2000 registros locales, selección externa y altura exacta ajustada
al fontScale. Es un fixture de validación, no evidencia de fluidez ni datos de producción.

## Qué falta para un buen sistema móvil

### Stack de estilos y APIs obsoletas

El DS usa `Display.ExpoImage` sobre `expo-image`; no importa ni accede a
`ReactNative.ImageBackground`. El contrato de imágenes verifica ambas restricciones.
Para fondos con imágenes, componer un `View` con una imagen de Expo posicionada
absolutamente, no reintroducir el componente nativo deprecado.

NativeWind **4.2.7** y `react-native-css-interop` **0.2.7** son las versiones estables
actuales. Su registro automático de `ImageBackground` accede al getter de React Native
0.88 y genera una advertencia al importar el runtime, aunque no se renderice ese
componente. `LogBox.ignoreLogs` solo filtra LogBox: no elimina la causa ni garantiza
que el mensaje desaparezca de Metro. No atribuir esa advertencia a un uso del DS ni
considerar su ocultación una corrección.

NativeWind **5.0.0-rc.1** sigue siendo una RC y requiere `react-native-css`
**3.1.0-rc.1** y Tailwind 4. Migrar exige revisar Metro/Babel, CSS/tokens y reemplazar
`cssInterop` por la API nueva; no es un bump aislado. La documentación del RC describe
un target probado en Expo 57, no una certificación completa del SDK 58.
Ver [estado de v5](https://www.nativewind.dev/v5) y
[migración desde v4](https://www.nativewind.dev/v5/guides/migrate-from-v4).

Las exportaciones legacy se conservan por compatibilidad; no son la API recomendada
para consumidores nuevos. Usar `Navigation.AppBar` y `Display.MenuGrid` en lugar de
`widgets/HomeHeader` y `widgets/MenuGrid`.

| Prioridad | Próximo trabajo                            | Criterio para aceptarlo                                                                                                                               |
| --------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1        | Perfilado en apps release                  | 1000/5000 registros reales, memoria pico/estable, frames JS/UI y arranque; mismo dispositivo/dataset/cache antes/después                              |
| P1        | TalkBack/VoiceOver + lectura al 200%       | Abrir, seleccionar, cargar, fallar, reintentar y cancelar sin gestos obligatorios ni truncar información esencial                                     |
| P1        | Auditoría de movimiento restante           | Validar motor nativo opcional y renderers propios; rutas RN/toast/carousel implementadas, sin afirmar cobertura exhaustiva                            |
| P2        | FlashList opcional                         | Adoptar solo si mediciones muestran cuello de botella que FlatList configurable no resuelve; contrato de reciclado y alternativa accesible            |
| P2        | Multi-selección recuperable                | Estado controlado, seleccionar/limpiar visibles, resumen, conservar selección tras error; primero receta, componente solo si varias apps lo necesitan |
| P2        | Política háptica                           | Opt-in y señal redundante; probar sin motor disponible y errores, sin nuevas vibraciones por defecto                                                  |
| P2        | Regression visual y contratos de extensión | Light/dark, texto largo, narrow y fonts locales en superficies prioritarias                                                                           |
| P3        | Nuevas piezas por tendencia                | No agregar sin tarea concreta ni duplicar búsqueda, sheets, filtros o builders existentes                                                             |

## Validación y límites

La primera iteración pasó 64 pruebas de lógica y 175 de componentes (239).
La major pasa 67 pruebas de lógica y 200 de componentes (267), incluyendo contratos de
renderer obligatorio, referencias nativas, media del catálogo, aislamiento de eventos
tardíos e indicadores/sizing accesibles por defecto.
Lint/formato, tipos de fuente/build/tests, tipos de stories y doctor pasan.
Build y dry-run de empaquetado comprueban JS/tipos del renderer común.
Export Android con Hermes valida el bundling de Storybook y la integración NativeWind.
El gate comprueba también que el formateador no deje cambios unstaged.

Pruebas cubren reset/retry/eventos tardíos de imágenes, propagación de cache/recycling,
movimiento vivo, renderizaciones de contexto, paginación y opciones accesibles.
Los tests de ExpoImage instrumentan el módulo nativo y NativeWind; no prueban lectura de
caché real, decodificación ni mapeo visual de clases. Build/bundling verifican integración,
no certifican comportamiento de plataforma. Revisar stories en iOS/Android release antes
de adoptar masivamente. No se declara ningún porcentaje de mejora de velocidad.

Para adoptar ExpoImage en un development build existente, instalar `expo-image` y
recompilar el binario nativo. El componente no instala módulos en runtime ni hace fallback
silencioso si falta el peer.

### Resultado de la segunda iteración

- Gate completo: **67 pruebas de lógica + 255 de componentes = 322**, sin fallos.
  Lint/formato, tipos de source/build/tests/stories, doctor y compatibilidad Expo pasan.
- Build/dry-run de paquete: JS y tipos nuevos incluidos; **466 entradas**.
- Exports finales **Android e iOS con Hermes** pasan en Expo **58.0.23** / RN **0.88.1**.
- **3/3 flows Maestro pasan en Expo Go 58.0.7**, en un simulador iOS 26 dedicado:
  resumen devuelve foco al input real con teclado y conserva drafts; controles default/
  custom alcanzan la última card; carga real oculta campos, conserva borrador entre ciclos
  y admite renderer custom. Flows persistidos en `.maestro/`.
- El ciclo nativo detectó problemas que los mocks no ven: íconos de otra familia,
  contenido de gradient sin altura y un scope modal global que ocultaba controles ajenos
  a una carga local. Se corrigieron y se repitieron las pruebas, sin debilitar assertions.

Esto comprueba interacciones reales en iOS, no ejecución nativa Android, VoiceOver/TalkBack,
fuente al 200%, caché/decodificación real de imágenes ni FPS/memoria/arranque en release.
Esos criterios siguen pendientes antes de certificar hosts. No se publica ningún porcentaje
de mejora de rendimiento; la reducción de consultas/listeners sí tiene una assertion exacta.
