# Design system: brechas y prioridades

Informe de la iteración v1. Para los contratos actuales, ver
[migración v2](./MIGRATION-V2.md) y [calidad móvil](./MOBILE-QUALITY.md).

Fecha: 2026-11-06. Alcance: revisión del catálogo, planes existentes y código de feedback;
no es una auditoría exhaustiva de todos los componentes ni una certificación nativa.

## Comparación útil, no una carrera por cantidad

| Referente                                                                                          | Capacidad de referencia                                              | Situación Sincpro                                                                                                                    | Decisión                                                                              |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [React Native Paper](https://oss.callstack.com/react-native-paper/docs/components/FAB/AnimatedFAB) | Acciones con nombre/estado accesible, estilos y control de animación | Ya existen acciones y sizing accesible opt-in; faltaba un contrato equivalente de estado y movimiento en Spinner                     | Completar feedback, no sustituir la identidad visual por Material                     |
| [Tamagui Progress](https://tamagui.dev/ui/progress)                                                | Track e indicador personalizables por separado, valor accesible      | Progress ya existía, pero solo exponía altura/className; ProgressCircle capturaba el tema inicial                                    | Agregar hooks de presentación y colores reactivos; conservar valores fraccionales 0–1 |
| [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)                   | Consulta inicial y evento de cambio de Reducir movimiento            | Skeleton/Progress usaban Animated sin consultar la preferencia; loaders personalizados no cancelaban explícitamente sus repeticiones | Compartir consulta/suscripción y detener animaciones; no agregar dependencias         |

Paper y Tamagui son referentes de APIs, no propuestas de migración ni afirmaciones de
que todos sus componentes cumplan todos los criterios de accesibilidad.

El [catálogo](./CATALOG.md) ya incluye formularios, overlays, listas, búsqueda,
consulta estructurada, reordenamiento y estados recuperables. Agregar breadcrumbs, otro
builder o una segunda biblioteca de botones no resuelve una ausencia demostrada.

## Implementado en este PR

- Preferencia de movimiento viva, lectura inicial conservadora, limpieza de suscripciones
  y protección contra resultados iniciales tardíos. Fallos visibles en logging.
- Skeleton estático si corresponde, oculto de lectores; loops de Animated no bloquean
  interacciones/listas virtualizadas.
- Progress indeterminado estático conserva señal y estado busy sin porcentaje ficticio.
- Spinner mantiene variantes spinner/dots/ripple, nombre accesible y estado busy.
  Repeticiones canceladas al cambiar preferencia, tamaño o desmontar.
- Loading propaga los controles de feedback sin cambiar su composición.
- Progress expone superficie/indicador; ProgressCircle y Spinner siguen el tema vivo.
- Valores finitos fuera de rango conservan clamping; NaN/infinito producen RangeError.
- Stories y pruebas de contratos, cambios en vivo, limpieza, tema y personalización.

Sin dependencias nuevas, sin cambios al formato 0–1 ni a los defaults visuales con movimiento
permitido. Cambios intencionales: estado accesible nuevo; arranque estático hasta conocer
la preferencia; feedback estático bajo Reducir movimiento; error explícito para valores no
finitos. La app conserva red, cálculo, persistencia y mensajes de negocio.

## Qué falta, por prioridad

| Prioridad | Brecha                                          | Próximo entregable y criterio                                                                                                                                              |
| --------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1        | Movimiento en el resto del catálogo             | Inventariar transiciones/gestos/loops de overlays, toast, carousel y navegación; conservar alternativas visibles y comprobar preferencia en vivo. Este PR no los certifica |
| P1        | Validación accesible en dispositivos            | VoiceOver y TalkBack: un único nombre/estado por loader, porcentaje correcto, texto al 200%, light/dark y tamaño estrecho; verificar representación estática y reanudación |
| P1        | Adopción real en apps consumidoras              | Piloto con cargas conocidas/desconocidas, fallo y reintento; medir si el usuario distingue carga de bloqueo. No incorporar red o stores al DS                              |
| P2        | Personalización inconsistente fuera de feedback | Matriz por componente de className/style/slots/refs/labels; abrir fixes solo cuando una composición real obligue a copiar código                                           |
| P2        | Evidencia visual de regresiones                 | Capturas reproducibles light/dark, texto largo y escalado en stories críticas; tests de props no prueban legibilidad ni contraste de cada composición                      |
| P2        | Contratos de formulario a escala                | Revisar error/resumen/foco con varios campos inválidos y lector de pantalla; reutilizar KeyboardForm e inputs antes de agregar otro wrapper                                |
| P3        | Nuevos componentes sin necesidad demostrada     | Exigir tarea móvil concreta, API controlada, personalización, alternativa accesible y prueba de error/cancelación antes de ampliar el catálogo                             |

## Validación

Build, lint/formato, tipos de fuente/build/tests, tipos de Storybook y doctor pasaron.
Suite completa: 63 pruebas de lógica y 154 pruebas de componentes (217 en total),
incluidas 26 nuevas de feedback. El gate `make verify-format` exige además cambios
commiteados; se vuelve a ejecutar después del commit para comprobar esa condición.

Las pruebas automatizadas verifican semántica/props, normalización, cambios de preferencia,
cancelación y temas; las animaciones nativas se instrumentan con mocks. Las stories
`Components/Feedback/ReducedMotion` y `CustomProgress` permiten revisar los estados.
Cambiar Reducir movimiento con la story abierta debe detener/reanudar los indicadores.

No se declara comprobada la experiencia VoiceOver/TalkBack ni el renderizado/temporizado
real de los drivers de animación sin ejecutar las pruebas nativas descritas arriba.
