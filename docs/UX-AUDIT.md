# Auditoría UX/UI y contrato de evolución

Fecha: 2026-11-06. Alcance: componentes representativos y patrones del catálogo móvil,
contrastados con la metodología aplicada en web y con fundamentos nativos.
No es una certificación de accesibilidad ni una auditoría exhaustiva de cada variante.

## Método

Principio → contrato de interacción → componente → story → prueba → evidencia.
Prioridad primero en tareas bloqueadas o inaccesibles, después en inconsistencias frecuentes.
No adoptar una tendencia visual ni una nueva dependencia sin justificar su beneficio móvil.

| Categoría     | Decisión                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------- |
| Tokens y tema | Conservar la arquitectura; comprobar contraste sobre las superficies reales              |
| Tipografía    | Conservar tamaños legacy; semántica de títulos y texto ampliable en el modo accesible    |
| Acciones      | Conservar variantes públicas; documentar énfasis y añadir sizing accesible opt-in        |
| Datos y copia | Reutilizar `KeyValue` y `CopyableText`, en vez de filas manuales por pantalla            |
| Formularios   | Etiqueta persistente, nombre/valor/estado accesibles y errores recuperables              |
| Feedback      | Resultado explícito, sin éxito anticipado, y reintento sin perder el trabajo             |
| Navegación    | Mantener roles, selección y targets; verificar cada variante nativamente                 |
| Overlays      | Acción visible de cierre y escape accesible; revisar foco en dispositivos                |
| Gestos        | Conservar swipe, pero exigir una alternativa visible para acciones esenciales            |
| Views         | Mantener contenido durante refresh y cerrar el estado busy incluso ante un fallo         |
| Legacy        | Mantener exports; migrar por lotes, no reemplazar silenciosamente el aspecto de las apps |

## Hallazgos que motivan los cambios

| Prioridad | Patrón            | Problema observado                                      | Criterio                                                                          |
| --------- | ----------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| P1        | Copiar            | La acción no indicaba éxito/fallo ni recuperación       | Texto/affordance, nombre accesible, resultado real, bloqueo durante copia y retry |
| P1        | Acciones          | Labels desaparecían del árbol accesible durante loading | Nombre estable y estado busy/disabled                                             |
| P1        | Checkbox          | El contenedor interactivo no exponía checked/disabled   | Rol y estado en el control que recibe la interacción                              |
| P1        | Refresh           | Una promesa rechazada podía dejar refreshing activo     | Reset garantizado, error explícito y contenido conservado                         |
| P1        | Select            | Nombre del campo sin valor actual ni expanded           | Campo, selección y estado comunicados                                             |
| P1        | Sheet             | Cierre dependiente del gesto según configuración        | Cierre visible opcional y acción de escape accesible                              |
| P2        | Jerarquía         | Títulos de pantalla/sección eran texto sin semántica    | Header nativo y jerarquía visual diferenciada                                     |
| P2        | Datos largos      | Filas manuales o estrechas en fuente ampliada           | Modo auto/stacked sin truncar contenido esencial                                  |
| P2        | Confirmación      | Etiquetas genéricas en la elección destructiva          | Verbo explícito y alternativa que conserva el trabajo                             |
| P2        | Estados           | Banners y fallos sin contrato consistente de anuncio    | Estado perceptible, cierre nombrado y recuperación                                |
| P2        | Navegación/gestos | Targets variables y acciones exclusivamente por swipe   | Sizing opt-in y alternativa visible                                               |

Los hallazgos estáticos no demuestran por sí solos un fallo en VoiceOver/TalkBack.
Las pruebas de interacción validan callbacks/estado; las de dispositivos validan alcance,
teclado, scroll y representación nativa.

## Evidencia reproducible

Resultado inicial: 53 pruebas de lógica/tokens y 33 nativas pasando; tipos, stories,
lint/formato y build de librería correctos. Los tres flujos iniciales Maestro pasaron en iOS.
Contenido largo/dark pasó también en categoría `accessibility-large`; la categoría normal
`large` se restauró después. Android exportó correctamente, sin un dispositivo para probar runtime.

En la jerarquía nativa del piloto iOS a tamaño normal se midieron:

| Acción                    | Ancho × alto (puntos) |
| ------------------------- | --------------------- |
| Copiar referencia         | 79 × 48               |
| Copiar correo electrónico | 336 × 48              |
| Editar cliente            | 370 × 48              |

Los tres targets originales cumplen el umbral de 48×48; estas medidas pertenecen al
piloto anterior al rediseño compacto y no se extrapolan a la versión nueva ni a Android.

## Segundo lote: interacciones realmente móviles

- Copia compacta: dato corto + icono conocido, check transitorio de tres segundos,
  anuncio accesible y fallo/reintento visibles, sin agregar un bloque de éxito.
  Un valor cambiado no aparece falsamente como ya copiado.
- Texto largo: `Typography.SelectableText` es un control nativo multiline de solo lectura,
  sin teclado, con selección de fragmentos. `CopyableText selectable` separa la selección
  de la acción de copiar todo; `KeyValue selectable` reutiliza el mismo mecanismo.
  No se deduce el tipo de campo a partir de su longitud.
- La comprobación en iOS detectó que `Text selectable` solo copia el párrafo entero.
  Se verificaron después handles nativos de rango; el portapapeles contenía `parte`,
  no la descripción completa. El E2E inicial de “Copy visible” era insuficiente.
- `ActionSheet`: pocas decisiones, targets de 48, opciones desplazables y cancelación
  persistente. `Select`: cierre visible, escape y etiquetas largas.
- `Dialog/NativeSheet`: presentación SwiftUI de Expo 58 comprobada en Expo Go iOS,
  con contenidos tokenizados, scroll y cierre visible. Import opcional por subpath;
  no arrastra `@expo/ui` a los barrels generales ni reemplaza el Sheet existente.
- Stories de tareas móviles: abrir resumen, menú explícito de fila sin swipe obligatorio,
  archivar/deshacer, filtros con borrador/confirmación y cancelar una selección sin cambiarla.
- Los portales Modal reinyectan tokens y actualizan el tema; no dependen de herencia de CSS
  que no cruza un portal nativo.

Resultado de contratos: 53 pruebas de lógica/tokens + 47 nativas (100 en total) pasando,
tipos/stories/lint y compatibilidad Expo correctos. El build de librería pasó.
Los siete flujos Maestro pasaron en el iPhone 17 Pro con Expo Go; los dos flujos de contenido
largo/dark (detalle y resumen nativo) también pasaron con `accessibility-large`.
Se restauró `large` al terminar. El export Android del código final pasó; no equivale a
comprobar selección/gestos/hojas en un dispositivo Android.
Antes de registrar el lote, `make verify-format` terminaba con error únicamente por
diferencias Git sin commit. Al preparar el PR, se registraron los cambios y el gate completo
pasó con worktree limpio; no se alteró el gate.

En la story de texto a tamaño normal, los targets medidos en la jerarquía iOS son
88×48 para la referencia corta y 48×48 para el icono independiente de la descripción.
El tamaño de una captura de pantalla no representa el tamaño físico de estos controles.

## Tercer lote: agrupación, lectura e identidad configurable

- `Display.ListGroup`: agrupa listas cortas de ajustes con título, descripción/footer
  opcionales, una superficie común o agrupación plana y hairlines entre filas.
  No agrega sombras ni una card por cada fila. No es una lista virtualizada.
- `ListItem variant="mobile"`: títulos/valores de 17 puntos, ayuda de 16, texto sin truncar,
  target mínimo 48×48 y press tonal en vez de escalar/desvanecer toda la fila.
  Valores/controles pasan debajo del texto al ampliar la fuente o estrechar la pantalla.
  La explicación de una acción deshabilitada sigue legible.
- El nombre y el valor accesible de una fila son independientes. La validación nativa
  detectó que un nombre explícito ocultaba el valor de idioma: ahora se expone
  `accessibilityValue`, además de mostrar el valor en pantalla.
- `bodyReadable` de 17 puntos es opt-in para Text/SelectableText y conserva los roles de
  fuentes existentes. `body` y las filas legacy no cambian.
- Se conserva la identidad actual: fondos cálidos, azul de acciones, oro tonal acotado y
  tipografía de marca, sin cambiar la paleta. `surface`, `contentClassName`, `className`,
  slots, `separators` y los helpers de tema/fuentes permiten extenderla sin un segundo tema.
- Stories `Patterns/UX/Grouped settings`: defaults Sincpro, contenido largo, superficies
  personalizadas y jerarquía de lectura. Los cambios de idioma/avisos son estado local
  de demostración, no preferencias persistentes ni traducción de toda la pantalla.

Validación del lote: 53 tests de lógica/tokens + 58 nativos (111), tipos, lint/stories,
build de librería y export Android pasando. Los nueve flujos Maestro pasaron en iOS,
incluyendo la variante personalizada. El flujo largo/dark de agrupación también pasó con
`accessibility-large` y se restauró `large`.
Los tests de personalización verifican que las clases de superficie/radio sustituyen
los defaults; la representación real se revisó además en el simulador.
Esto no aprueba automáticamente toda la dirección visual ni certifica Android runtime
o lectores de pantalla.

Además de acciones/copia/jerarquía, se implementaron los hallazgos del muestreo de
Checkbox, Select, Sheet, Confirmation, Banner, refresh, navegación y SwipeableRow.
El tamaño accesible y los controles visibles nuevos son opt-in cuando cambian el layout.

- `make test`: lógica/tokens y contratos nativos mediante Jest Expo 58.
- `make verify-format`: formato, tipos de librería/stories/tests, doctor, matriz Expo y tests.
  El último paso exige cambios registrados; no confundir un worktree modificado con un fallo de tipos.
- `make build`: build de la librería y resolución de aliases.
- `make storybook-e2e`: nueve flujos: lista/detalle/editar/cancelar, error/retry,
  contenido largo/dark, tareas/undo/filtros, selección/cancelación,
  resumen nativo largo/dark, texto con selección de fragmentos y dos flujos de
  agrupación/ajustes/personalización/contenido largo.
- Export Android de Expo 58: smoke de bundling, no validación de comportamiento en Android.

Los E2E usan estado local ficticio. No certifican persistencia, red, dominio ni integración
con una app consumidora. La fuente ampliada es una prueba de estrés, no el nuevo tamaño default.
El simulador debe volver a su categoría original al terminar.

## Adopción y límites

1. Usar las APIs accesibles en pantallas nuevas y adoptar las existentes por lotes.
2. Revisar las stories `Patterns/UX` y la receta de perfil para no volver a duplicar filas.
3. Probar cada cambio de apariencia en una app consumidora antes de publicarlo.
4. Separar aprobación visual de validación nativa y de una prueba de tareas con usuarios.

No se elimina ningún export legacy ni se publica una versión automáticamente.
Android runtime, VoiceOver/TalkBack y pruebas con usuarios requieren dispositivos/personas
que no están disponibles en esta ejecución; no se declaran aprobados por un bundle o una captura.

Referencias: [filosofía](./PHILOSOPHY.md), [plan](./UX-UI-PLAN.md),
[catálogo](./CATALOG.md), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility),
[Android](https://developer.android.com/guide/topics/ui/accessibility/apps) y
[WCAG contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
