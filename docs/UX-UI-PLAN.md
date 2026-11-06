# Plan de evolución UX/UI móvil

Estado: contratos, refactor priorizado, stories, pruebas y E2E iOS implementados.
La certificación completa de dispositivos/accesibilidad y la adopción en apps quedan fuera de
lo comprobado en esta ejecución.
Fecha: 2026-11-06.

## Implementación inicial

- Contratos de interacción incorporados a `PHILOSOPHY.md`; README actualizado a Expo 58.
- Copia con affordance, confirmación, fallo visible y reintento; `KeyValue copyable`.
- Semántica de títulos y estados accesibles de acciones; sizing de 48 opt-in y texto ampliable.
- Inputs con nombre accesible, anuncio de error y sizing opt-in.
- Piloto en `Patterns/UX/Record detail`: lista, detalle, copiar, editar, cancelar y error recuperable.
  Usa estado local de demostración, no simula persistencia real ni acceso a un servidor.
- Jest Expo 58 + React Native Testing Library: 33 pruebas nativas, además de las 53 existentes.
- Checkbox/Select con nombre y estado; navegación con jerarquía y sizing opt-in.
- Sheet con cierre visible opt-in/escape; confirmaciones explícitas; alternativa visible al swipe.
- Refresh recuperable en Form/List, con reset garantizado, logging y callback de error.
- Banners con semántica de estado; Empty/Error y BaseButton con acciones accesibles.
- Tres flujos Maestro pasaron en iOS: lista/copiar/editar/cancelar, fallo/retry y contenido largo/dark.
- El flujo largo/dark también pasó con categoría de texto `accessibility-large`.
- Export Android de Expo 58 pasó como smoke de bundling; no equivale a runtime Android.
- `make verify-format` incorpora tests y `expo install --check`; el gate sigue exigiendo
  un worktree sin diferencias. Al preparar el PR se registraron los cambios y el gate pasó.

El [informe de auditoría](./UX-AUDIT.md) registra los patrones revisados y sus límites.

### Segundo lote implementado

- Copia compacta con icono/check sin desplazamiento del layout; dato corto tappable.
- `Typography.SelectableText`, `CopyableText selectable` y `KeyValue selectable` para
  selección real de fragmentos, sin teclado, y acción separada de copia completa.
  Se comprobó en iOS que `Text selectable` solo copiaba el párrafo completo y se corrigió.
- ActionSheet/Select/Sheet con tokens reactivos dentro del portal nativo y cierre explícito.
- `Dialog/NativeSheet` opcional por subpath sobre Expo 58, sin cambiar los barrels legacy.
- Stories de tareas móviles: acciones de fila visibles, archivar/deshacer,
  filtros con borrador/confirmación, resumen nativo y selección/cancelación.
- 100 pruebas pasando (53 de lógica/tokens + 47 nativas). Suite Maestro ampliada a siete
  flujos; ver el informe para resultados y límites por dispositivo.

### Tercer lote implementado: estilo Sincpro y personalización

- `ListGroup`: agrupación limpia en superficie común o plana, sin cards por fila,
  separadores hairline y título; descripción/footer opcionales.
- `ListItem variant="mobile"`: lectura de 17 puntos, accesorios adaptables, estado/valor
  accesible y feedback tonal por fila. Default legacy conservado.
- `bodyReadable` opt-in para Text/SelectableText; conserva fuentes configuradas y scaling.
- Personalización con los tokens y helpers existentes, `className`, `contentClassName`,
  superficies, separadores y slots; sin segunda paleta ni nuevas dependencias.
- Story completa de preferencias en Sincpro default, texto largo y variante personalizada.
- 111 tests (53 + 58) y nueve flujos iOS pasando; agrupación largo/dark también con
  texto ampliado. Build/export Android pasan; continúa pendiente runtime Android.

No se eliminan variantes legacy ni se cambian automáticamente apps consumidoras.
Android runtime, VoiceOver/TalkBack y pruebas con usuarios no se pudieron verificar en esta
ejecución: no había dispositivo/emulador Android configurado ni usuarios de prueba.

## Objetivo

Convertir la filosofía del design system en contratos de componentes y patrones de pantalla
verificables: jerarquía clara, tareas comprensibles, interacción táctil, feedback y accesibilidad.
No se trata de sumar piezas al catálogo ni copiar la interfaz web.

Mantener Expo SDK 58 como plataforma objetivo, APIs públicas estables e identidad de marca.
Los cambios de apariencia y comportamiento también cuentan como cambios de compatibilidad.

## Base de diseño revisada en noviembre de 2026

Las pruebas técnicas anteriores no constituyen aprobación visual del design system.
Se consultaron las skills oficiales de Expo y sus referencias; no se instalaron ni se
declara que estuvieron activas durante los lotes anteriores:

- [expo-design-system](https://skills.sh/expo/skills/expo-design-system):
  extender los tokens existentes, contratos de componentes y auditoría de inconsistencias.
- [expo-native-ui](https://skills.sh/expo/skills/expo-native-ui):
  comportamiento y composición nativos, diferenciando iOS y Android.
- [Native Slop de Expo](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/native-slop.md):
  revisar exceso de cards, sombras, padding uniforme, feedback de pulsación indiscriminado
  y composición de escritorio. Son candidatos de revisión, no defectos por sí solos.
- [Apple HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography):
  tamaño predeterminado recomendado de 17 pt en iOS, jerarquía conservada al ampliar texto
  y pesos legibles. El mínimo no es un objetivo para el texto principal.
- [Android Design](https://developer.android.com/design/ui/mobile) y
  [Material 3 Expressive](https://m3.material.io/blog/building-with-m3-expressive):
  prioridad de acciones, agrupación, formas, movimiento e identidad con intención,
  no decoración indiscriminada.

Estas skills son referencias para apps: sus recomendaciones de Expo Router, navegación
y carpetas no se trasladan literalmente a esta librería sin router. Se conserva NativeWind,
la identidad de marca y los exports; no se introduce un segundo tema ni dependencia de rutas.
La disponibilidad de un efecto o control se valida contra Expo 58 antes de incorporarlo.
Una recomendación de skill tampoco reemplaza probar el comportamiento real: la selección
de fragmentos en iOS ya demostró esa diferencia.

### Próxima aprobación visual: criterios y pendientes

1. Revisar la escala de lectura: `body` de 14 y `bodyLarge` de 16 no equivalen al
   default recomendado de 17 pt de Apple. Se añadió `bodyReadable` de 17 opt-in para
   el piloto de agrupación; falta aprobar su adopción visual antes de cambiar consumidores.
2. Comparar pantallas completas a escala normal, no solo controles aislados o capturas de
   texto ampliado. Distinguir distancia entre filas, grupos y secciones.
3. Evaluar agrupación por proximidad/superficies/separadores antes de envolver todo en cards.
4. Revisar énfasis, iconografía y feedback por rol: filas, acciones principales y acciones
   contextuales no deben reaccionar idénticamente por conveniencia de implementación.
5. Evaluar las propuestas por plataforma y justificar tratamientos de marca compartidos.
   Material Expressive o Liquid Glass no son requisitos universales ni motivos para
   sustituir componentes que funcionan.
6. Aprobar primero una dirección visual del piloto y registrar antes/después; solo después
   extenderla al catálogo. Las 100 pruebas y los E2E siguen siendo regresión técnica,
   no evidencia suficiente de que esta dirección visual ya esté aprobada.

## Base comprobada

- El paquete declara Expo `~58.0.23`, React `19.3.0` y React Native `0.88.1`.
  La consulta al registry devuelve `58.0.23` como último patch de Expo 58.
- `CI=1 ./node_modules/.bin/expo install --check` pasó sin modificar dependencias.
  Esto verifica la matriz conocida por Expo, no todos los peers ni el comportamiento nativo.
- Los 53 tests actuales de lógica y tokens pasaron en la investigación inicial.
  No constituyen pruebas de componentes, gestos, teclado o accesibilidad nativa.
- Storybook funciona en el simulador iOS; hay stories aisladas y recetas de pantalla.
- Web aplica una metodología transferible: principio → contrato → story → prueba → evidencia.
  Sus comprobaciones DOM, Playwright y axe no se trasladan directamente al runtime nativo.
- Se corrigieron divergencias documentales del baseline: SDK 57 y ejemplos de API incorrectos
  (`Button` con children). `KeyValue copyable` ahora está implementado y tipado.

Referencias locales: [filosofía](./PHILOSOPHY.md), [estructura](./STRUCTURE.md),
[catálogo](./CATALOG.md), [tests](../tests/README.md) y [README](../README.md).

## Política de dependencias

“Última versión” significa última versión estable compatible y probada con Expo 58.
No significa adoptar un nuevo SDK, una major de NativeWind o una librería nativa automáticamente.

1. Paquetes gestionados por Expo: validar con `expo install --check`; actualizar mediante
   `expo install` a su versión recomendada, en un cambio separado y revisable.
2. Resto de dependencias: revisar registry, peers, changelog y necesidades reales antes de actualizar.
3. Nuevas dependencias nativas: verificar Expo Go frente a development build, iOS y Android,
   configuración de plugins, arquitectura nativa y coste para las apps consumidoras.
4. Verificar manifests y lockfile, build, tipos, arranque y el flujo afectado después de actualizar.
5. Mantener peers de la librería y dependencias de desarrollo coherentes, evitando copias duplicadas.
6. Incorporar la comprobación de versiones al workflow existente del Makefile/CI.
   `make doctor` es un chequeo propio de gotchas, no sustituye Expo Doctor.

El tooling implementado es Jest Expo de la línea 58, Jest y React Native Testing Library,
validado mediante tipos y pruebas; Maestro ejecuta E2E local. Storybook web sigue siendo
opcional: no reemplaza verificar teclado, gestos y controles nativos.

## Principios y criterios propuestos

Separar en la documentación: recomendaciones oficiales, decisiones de producto y heurísticas.
Cada excepción debe tener un motivo y una prueba; no convertir preferencias estéticas en estándares.

| Eje           | Contrato propuesto                                                                                  | Verificación                                                     |
| ------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Jerarquía     | Título, sección, etiqueta, valor y ayuda distinguibles; no depender solo del color                  | Stories completas y revisión de lectura                          |
| Acciones      | Una acción de máximo énfasis por contexto de tarea; secundarias y destructivas diferenciadas        | Contrato de variantes y escenarios con overlays                  |
| Tacto         | Área efectiva propuesta ≥44×44 puntos en iOS y ≥48×48 dp en Android                                 | Medición en runtime; comprobar límites y solapamiento de hitSlop |
| Lectura       | Contenido esencial accesible con texto al 200%, textos largos y pantalla estrecha                   | Pruebas nativas de layout, scroll y foco                         |
| Contraste     | Texto normal ≥4.5:1; texto grande ≥3:1 según clasificación aplicable                                | Tests de tokens y contraste sobre superficies reales             |
| Feedback      | Copiar/guardar muestra resultado; errores ofrecen recuperación; no anunciar éxito antes de terminar | Tests de éxito, fallo y activaciones repetidas                   |
| Formularios   | Etiqueta persistente, ayuda/error claro, teclado pertinente y foco recuperable                      | Interacción y navegación con teclado nativo                      |
| Gestos        | Una acción esencial no depende exclusivamente de swipe o pulsación larga                            | Alternativa visible y prueba funcional                           |
| Accesibilidad | Nombre, rol, estado y orden de lectura correctos                                                    | Tests semánticos y VoiceOver/TalkBack                            |
| Composición   | Safe areas, teclado y overlays no ocultan contenido o acciones esenciales                           | Escenarios iOS/Android, no solo capturas                         |

La regla de una acción de máximo énfasis es una decisión del sistema, no una exigencia universal
de accesibilidad. Un modal es un contexto independiente; las excepciones se justifican.

## Fases y dependencias

### 0. Baseline reproducible

- Inventariar componentes públicos, aliases, deprecaciones y consumidores relevantes.
- Registrar versiones instaladas, peers y resultado de validación Expo.
- Capturar los mismos escenarios antes/después, identificando dispositivo, tema y escala de texto.
- Actualizar únicamente documentación directamente divergente y comprobada.

Salida: baseline y matriz de compatibilidad. No declarar Android validado con evidencia solo de iOS.

### 1. Contrato UX/UI

- Consolidar la filosofía existente con reglas de jerarquía, énfasis, copy, feedback y composición.
- Definir el significado de cada variante y estado, no solo su estilo.
- Vincular cada regla a una pieza existente, una story y una estrategia de verificación.
- Usar Apple HIG y Android como referencias nativas; WCAG como referencia de contraste.
- Revisar el enfoque de web para trasladar método e identidad, no tablas densas, hover o rutas.

Salida: criterios acordados. Depende de la fase 0.

### 2. Auditoría y priorización

- Recorrer el catálogo y agrupar hallazgos por patrón, no por archivo.
- Clasificar: conservar, corregir, unificar, crear o deprecar.
- Por hallazgo: evidencia, tarea afectada, severidad, alcance, compatibilidad y criterio de aceptación.
- Priorizar bloqueos de tarea/accesibilidad, luego inconsistencias frecuentes y finalmente estética.

Primeros candidatos, todavía no decisiones de implementación:

- `CopyableText`: affordance, confirmación, fallo, nombre accesible y target táctil.
- `KeyValue`: contenido largo, disposición adaptable y acciones contextuales.
- `Button` / `IconButton`: contrato de énfasis, tamaño efectivo, loading y disabled.
- `Typography` / `SectionHeader`: escala legible, agrupación y jerarquía semántica.
- Formularios y feedback: error, reintento y prevención de operaciones duplicadas.

Salida: backlog priorizado y elección del piloto. Depende de la fase 1.

### 3. Piloto de extremo a extremo

Propuesta: lista → detalle con datos copiables → edición → resultado o error.
Usar datos ficticios y callbacks; no introducir dominio, router o red en mobile-ui.

- Componer con API pública y reutilizar helpers existentes.
- Refactorizar primero las piezas que necesita ese flujo.
- Cubrir light/dark, texto largo, vacío, loading, error, disabled y overlay.
- Validar el layout de pantalla sin depender del ScrollView centrado del decorador general.
- Mantener legacy o variantes opt-in para cambios visuales incompatibles.

Salida: un flujo demostrable con tests y evidencia antes/después. Depende de la fase 2.

### 4. Automatización del piloto

Puede comenzar en paralelo con la fase 3, una vez definidos sus contratos.

- Conservar los tests puros actuales; añadir pruebas nativas para interacción y semántica.
- Integrar el preset Expo y los peers del runner mediante un smoke test antes de extenderlo.
- Abrir stories concretas mediante deep links para E2E, con UI de Storybook fuera de las capturas.
- Automatizar copiar, editar, validar, confirmar y recuperarse de un fallo.
- Revisar VoiceOver/TalkBack manualmente: una prueba de props no equivale a una lectura correcta.
- Incorporar suites al Makefile/CI sin reemplazar `make verify-format` ni ocultar fallos.

Salida: gates reproducibles. Una captura verifica apariencia, no por sí sola usabilidad.

### 5. Extensión por lotes y adopción

- Extender el contrato validado a acciones, datos, formularios, navegación y overlays por lotes.
- Cada lote incluye stories, pruebas, documentación y guía de migración cuando corresponda.
- Probar en una app consumidora desde un paquete construido antes de recomendar su adopción.
- Publicar o modificar apps consumidoras solo con autorización explícita.

Depende de las fases 3 y 4; no comenzar un refactor masivo antes de cerrar el piloto.

## Definición de terminado por lote

- API y cambios de comportamiento documentados; compatibilidad prevista comprobada.
- `make verify-format`, `make build` y suites afectadas ejecutados; informar por separado el
  resultado técnico y el gate que exige un worktree sin diferencias.
- Validación Expo/peers y arranque en ambas plataformas cuando el cambio tenga alcance nativo.
- Cero bloqueos de tarea, clipping de contenido esencial o fallos críticos de accesibilidad
  introducidos en los escenarios del lote.
- Evidencia light/dark y texto ampliado; las acciones esenciales siguen alcanzables.
- Pruebas de tareas con usuarios representativos: éxito, tiempo y errores antes/después.
  Acordar tamaño de muestra y objetivos antes de medir; no afirmar mejora por una captura.

## Referencias externas

- [Apple HIG: accesibilidad](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android: accesibilidad y targets táctiles](https://developer.android.com/guide/topics/ui/accessibility/apps)
- [WCAG: contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Expo: actualización del SDK](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- [Storybook React Native: testing](https://github.com/storybookjs/react-native/blob/next/docs/docs/intro/testing.md)
