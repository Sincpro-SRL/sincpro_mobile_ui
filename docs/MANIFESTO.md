# Manifiesto — libertad para construir

## Propósito permanente

Sincpro Mobile UI proporciona componentes componibles, extensibles y personalizables
para construir aplicaciones móviles. No impone una pantalla, una escala tipográfica
ni una estética única.

El diseño Sincpro es un punto de partida utilizable, no un límite. Quien construye
debe poder adaptar las piezas mediante APIs públicas, sin copiar su implementación,
forkear el paquete ni perder su comportamiento.

## Compromisos

1. **Composición antes que pantallas cerradas.** Una persona puede combinar avatar o
   imagen, barra, nombre grande o pequeño, descripción, iconos, botones y contenido
   propio. Los widgets y templates son conveniencias opcionales sobre esas piezas.
2. **Personalización real, no solo variantes predefinidas.** Tema y fuentes para cambios
   globales; `className` y `style` para ajustes locales; slots, `children` o render props
   cuando una región necesita contenido arbitrario. Se pueden cambiar radio, fuente,
   tamaño, peso, color, espaciado, disposición e iconos donde corresponda.
   No se requiere añadir una nueva variante del paquete por cada combinación.
3. **Comportamiento reutilizable.** Teclado, foco, navegación entre campos, selección,
   estados, cancelación y recuperación deben seguir funcionando al cambiar la
   presentación. La app aporta datos, acciones y reglas de negocio.
4. **Defaults compatibles.** Conservar la presentación original de APIs existentes.
   Una nueva receta, tendencia o recomendación no autoriza a agrandar ni rediseñar
   automáticamente las pantallas consumidoras. Los cambios intencionales necesitan
   adopción explícita y una vía de migración.
5. **Templates abiertos.** Formulario, listado, encabezado y footer se pueden componer
   por partes. Deben exponer los controles nativos relevantes, incluidos refs y
   callbacks, sin exigir otro layout para acceder a ellos.
6. **Storybook demuestra APIs, no impone diseño.** Mostrar el default original y
   ejemplos de personalización funcional. Una composición de usuario o colección
   es una posibilidad, no la única manera correcta de construirla.

## Qué significa “100% personalizable”

Es el objetivo de diseño, no una certificación del estado actual del catálogo.
Si una personalización razonable exige copiar un componente, existe una limitación
de su API que debemos identificar y resolver. No afirmar soporte de una capacidad
sin demostrarla.

No significa desactivar el escalado del sistema, ocultar errores o perder nombres,
estados y acciones accesibles. La presentación es configurable; el contrato de
interacción debe seguir siendo explícito. Una personalización arbitraria tampoco
garantiza automáticamente contraste, alcance táctil o usabilidad.

## Criterio para aceptar cambios

- ¿Se conserva el default existente?
- ¿Puede el consumidor modificar las regiones y estilos relevantes por API pública?
- ¿Puede componer contenido no previsto, sin duplicar comportamiento?
- ¿Siguen funcionando teclado, foco, eventos y estados con esa personalización?
- ¿Hay ejemplos y pruebas de la capacidad concreta, además del caso por defecto?

Prioridad actual: consolidar estas capacidades funcionales y de extensión.
No iniciar un rediseño visual general como consecuencia de ese trabajo.

Ver [filosofía](./PHILOSOPHY.md), [estructura](./STRUCTURE.md) y
[catálogo](./CATALOG.md).
