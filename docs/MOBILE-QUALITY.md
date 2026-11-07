# Calidad móvil: investigación, plan y siguiente iteración

Fecha: 2026-11-06. Investigación pública, seguida de inspección de código, implementación
y ciclos de pruebas. No es una certificación de todo el catálogo ni un benchmark nativo.

## Lo aprendido de referentes

| Referente oficial                                                                                                                       | Evidencia                                                                           | Aplicación al sistema                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)                                                                          | Caché disco/memoria, placeholders, reciclado y downscaling                          | Subpath opcional; elegir política por tarea, no cachear todo en memoria              |
| [FlashList v2](https://shopify.github.io/flash-list/docs/v2-migration/)                                                                 | Requiere New Architecture; cambia refs/layout y exige cuidado con props/memoización | Evaluar con datos reales, no cambiar FlatList automáticamente                        |
| [Apple Design Awards 2026](https://developer.apple.com/design/awards/)                                                                  | Guitar Wiz: Inclusivity, VoiceOver y ajustes de lectura/percepción                  | Nombres/hints, texto escalable y pruebas combinando ajustes; no copiar su estética   |
| [Apple Design Awards 2025](https://www.apple.com/newsroom/2025/06/apple-unveils-winners-and-finalists-of-the-2025-apple-design-awards/) | Speechify y Art of Fauna premiados en Inclusivity                                   | Accesibilidad como parte de la tarea, no solo roles aislados                         |
| [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)                                                                      | Feedback de selección/resultado, sujeto a disponibilidad del sistema                | Refuerzo opcional; nunca sustituir señal visual/VoiceOver ni vibrar cada interacción |
| [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)                                                        | Preferencias del sistema y eventos de cambio                                        | Reutilizar useReducedMotion para transiciones/playback, no solo spinners             |

Expo Image es first-party, pero **no se asume instalado por usar Expo**: el host debe
instalarlo. Se mantiene como peer opcional y devDependency de este repo para build/stories.
Las capacidades documentadas no prueban una mejora de FPS, consumo o latencia en nuestras
apps. Ese resultado necesita medición en release y dispositivos reales.

## Plan ejecutado

1. **Media fiable:** corregir estado atascado tras error/cambio de fuente en Display.Image,
   propagar eventos y ofrecer recuperación por composición.
2. **Media optimizable:** ExpoImage sin import obligatorio en barrels, cache/recycling,
   NativeWind y respeto de movimiento reducido; no migrar ProductCard/Avatar por sorpresa.
3. **Listas grandes:** mantener FlatList, abrir controles de ventana/batching/layout/
   viewability/refs, selección externa y fin de paginación; reducir invalidaciones de contexto.
4. **Controles móviles:** segmentación con texto largo y disabled accesible, sin cambiar
   el default legacy ni imponer fuentes/paleta nueva.
5. **Testing e iteración:** comprobar contratos reales, corregir fallos encontrados,
   validar tipos/stories/build y gate; separar mocks de validación nativa pendiente.

## Contrato de listas

`ListViewV2.Content listProps` expone un conjunto deliberado de props de FlatList:
`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `updateCellsBatchingPeriod`,
`removeClippedSubviews`, `extraData`, `getItemLayout`, `onViewableItemsChanged`,
`viewabilityConfig`, `onEndReachedThreshold` y `maintainVisibleContentPosition`.
No permite reemplazar data/renderItem/keys/refresh por accidente.
`listRef` permite scroll imperativo; `contentContainerStyle` permite personalizar contenido.

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

La story Large List usa 2000 registros locales, selección externa y altura exacta ajustada
al fontScale. Es un fixture de validación, no evidencia de fluidez ni datos de producción.

## Qué falta para un buen sistema móvil

| Prioridad | Próximo trabajo                            | Criterio para aceptarlo                                                                                                                               |
| --------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1        | Perfilado en apps release                  | 1000/5000 registros reales, memoria pico/estable, frames JS/UI y arranque; mismo dispositivo/dataset/cache antes/después                              |
| P1        | TalkBack/VoiceOver + lectura al 200%       | Abrir, seleccionar, cargar, fallar, reintentar y cancelar sin gestos obligatorios ni truncar información esencial                                     |
| P1        | Movimiento en overlays, toast y carousel   | Inventario completo y preferencia viva; distinguir gestos esenciales de animación decorativa                                                          |
| P2        | FlashList opcional                         | Adoptar solo si mediciones muestran cuello de botella que FlatList configurable no resuelve; contrato de reciclado y alternativa accesible            |
| P2        | Multi-selección recuperable                | Estado controlado, seleccionar/limpiar visibles, resumen, conservar selección tras error; primero receta, componente solo si varias apps lo necesitan |
| P2        | Resumen de errores de formulario           | Lista enlazada al foco real, orden de campos y anuncio sin perder borrador; reutilizar KeyboardForm                                                   |
| P2        | Política háptica                           | Opt-in y señal redundante; probar sin motor disponible y errores, sin nuevas vibraciones por defecto                                                  |
| P2        | Regression visual y contratos de extensión | Light/dark, texto largo, narrow y fonts locales en superficies prioritarias                                                                           |
| P3        | Nuevas piezas por tendencia                | No agregar sin tarea concreta ni duplicar búsqueda, sheets, filtros o builders existentes                                                             |

## Validación y límites

Suite completa: 64 pruebas de lógica y 175 de componentes (239), con 22 nuevas.
Lint/formato, tipos de fuente/build/tests, tipos de stories y doctor pasan.
Build y dry-run de empaquetado comprueban JS/tipos del subpath opcional.
Export Android con Hermes valida el bundling de Storybook y la integración NativeWind.
El gate requiere además el commit; se ejecuta nuevamente sobre el worktree commiteado.

Pruebas cubren reset/retry/eventos tardíos de imágenes, propagación de cache/recycling,
movimiento vivo, renderizaciones de contexto, paginación y opciones accesibles.
Los tests de ExpoImage instrumentan el módulo nativo y NativeWind; no prueban lectura de
caché real, decodificación ni mapeo visual de clases. Build/bundling verifican integración,
no certifican comportamiento de plataforma. Revisar stories en iOS/Android release antes
de adoptar masivamente. No se declara ningún porcentaje de mejora de velocidad.

Para adoptar ExpoImage en un development build existente, instalar `expo-image` y
recompilar el binario nativo. El componente no instala módulos en runtime ni hace fallback
silencioso si falta el peer.
