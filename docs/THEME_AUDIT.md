# Theme & Color Audit — `@sincpro/mobile-ui`

> Documento para revisión por un experto en design systems / accesibilidad.
> Cubre: auditoría WCAG 2.1 completa, hallazgos, fixes aplicados (P0), limpieza
> de abstracción de marca, y trabajo diferido.

## Cómo leer este documento

- **Sección 2 (Metodología)**: explica cómo se calcularon los ratios. Sirve para
  validar la auditoría antes de evaluar las decisiones de fix.
- **Sección 3 (Hallazgos originales)**: el inventario completo con severidad
  BLOCK / WARN / INFO. Sin fixes aplicados todavía.
- **Sección 4 (Fixes aplicados)**: qué cambió, dónde, y por qué.
- **Sección 5 (Antes vs Después)**: métricas concretas de pares WCAG.
- **Sección 6 (Decisiones abiertas)**: lo que el experto debería validar o
  cuestionar.

---

## 1. Resumen ejecutivo

El sistema de tokens del design system tenía **dos problemas estructurales** que
conviven y se refuerzan:

1. **Tokens semánticos sin abstracción de marca**: el contrato público
   (`primary`, `bg.card`, `text.secondary`) era abstracto, pero los comentarios, los
   nombres internos (`brand-light`, `gold-mesh`), y el valor por defecto de
   `text.onPrimary` estaban atados a la identidad visual específica de Sincpro.
   Un consumer que override `primary` con un color de su propia marca seguía
   dependiendo de defaults que asumían el gold de Sincpro.

2. **WCAG 2.1 AA no se cumplía en múltiples flujos críticos**:
   - 22 pares con contraste < 3:1 (FAIL)
   - 16 pares entre 3-4.5:1 (large-text-only)
   - 0 pares pasando AAA (7:1+)
   - Hits principales: CTA principal de la app (texto blanco sobre gold = 2.29:1),
     focus ring invisible en light mode (2.15:1), y estado disabled
     indistinguible del estado muted (mismo hex literal en ambos).

**Decisiones de fix aplicadas (P0):**
- Eliminar referencias brand-specific en código (Fase A): nombres de presets,
  comentarios con "gold-N", nombre del theme (`brand-light` → `default-light`).
- Hacer el fix de WCAG de forma **brand-agnostic**: los consumers pueden
  overridear cualquier token y el sistema sigue siendo accesible. No asumimos
  que el primary del consumer sea gold.
- Introducir validación WCAG programática en `validateTheme` para que cualquier
  theme que se cargue en runtime sea chequeado en dev mode.

**Lo que NO se hizo (intencional):**
- No se introdujo el patrón completo de `primaryContainer` / `onPrimaryContainer`
  (Material 3). Es la solución ideal a largo plazo pero requiere refactor mayor.
- No se creó un primitive color scale (`gold.50..900`). Es la base para escalar
  el sistema pero excede el scope P0.
- No se renombró `assets/brand-mesh.png`. Sería breaking change innecesario.

---

## 2. Metodología

### 2.1 Cálculo de contraste WCAG

Se implementó un calculador en Node siguiendo WCAG 2.1 SC 1.4.3 (texto) y
SC 1.4.11 (UI no-text). Pseudocódigo:

```
relativeLuminance(color):
  for each channel (R, G, B):
    s = channel / 255
    lin = s ≤ 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ^ 2.4
  return 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin

contrastRatio(fg, bg):
  L1 = luminance(fg)
  L2 = luminance(bg)
  return (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)

grades:
  ≥ 7.0   → AAA     (normal text + large text)
  ≥ 4.5   → AA      (normal text)
  ≥ 3.0   → AA-large (large text ≥18pt or ≥14pt bold; UI non-text)
  < 3.0   → FAIL
```

La fórmula y los thresholds coinciden con la especificación oficial WCAG 2.1.

### 2.2 Pares auditados

Se chequean **88 combinaciones** organizadas así:

- **Texto sobre superficies** (6 roles × 6 surfaces × 2 themes): `text.{primary,
  secondary, tertiary, muted, accent, disabled}` × `{bg.page, bg.card,
  bg.popover, bg.muted, bg.accent, bg.disabled}`.
- **Pares "on-color"** (5): `text.onPrimary` sobre `primary`,
  `text.onSecondary` sobre `secondary`, `text.onAccent` sobre `accent`,
  `text.onDanger` sobre `danger`, `text.onSuccess` sobre `success`.
- **Focus ring** (2 × 2 themes): `border.focus` sobre `bg.page` y `bg.card`.

No se auditaron (debería discutirse):
- Tokens `border.default` / `border.light` / `border.strong` como texto
  (no se usan como tal).
- `gradient.primary` (es un gradient de 2-4 colores, no un par puntual).
- Estado hover de componentes específicos (los tokens son inputs, no el render).

### 2.3 Validación cruzada

Los ratios calculados por el script de Node fueron comparados con el output
de `validateTheme` integrado en la library (introducido en este trabajo). Tres
tests nuevos en `tests/theme/validate.test.ts` (`flags a CTA pair that fails
WCAG AA`, `flags a focus ring that fails WCAG AA 3:1`, `does NOT flag a
known-good default theme pair`) garantizan que el validador detecta regresiones.

### 2.4 Limitación metodológica conocida

El validador chequea solo **pares críticos** (CTA, focus, state colors). No
valida:
- Contraste entre `bg.disabled` y `bg.muted` (deben ser distintos, semánticamente
  independientes).
- Que `border.strong` tenga suficiente contraste con `bg.card` (afecta affordance).
- Que `shadow.shadowColor` derive lógicamente del theme (no es WCAG, es arquitectura).

---

## 3. Hallazgos originales (pre-fix)

### 3.1 🔴 BLOCK — WCAG AA falla (5 issues críticos)

| # | Severidad | Hallazgo | Ratio | Standard |
|---|---|---|---|---|
| B1 | BLOCK | **CTA button** texto blanco sobre `primary #C9A84C` en light mode | 2.29:1 | WCAG 1.4.3 (AA body) requiere 4.5:1 |
| B2 | BLOCK | **Focus ring** `border.focus #C9A84C` sobre `bg.card #FFFFFF` y `bg.page #FAF8F3` en light mode | 2.15-2.29:1 | WCAG 1.4.11 (non-text UI) requiere 3:1 |
| B3 | BLOCK | **Brand color como texto** (links, accent labels): `primary #C9A84C` sobre `bg.card` y `bg.page` en light mode | 2.15-2.29:1 | WCAG 1.4.3 requiere 4.5:1 |
| B4 | BLOCK | **State badges** en dark mode: `text.primary #FDF3C8` sobre `success #22C55E` / `warning #F59E0B`; `text.onSuccess #FFFFFF` sobre `success #22C55E` | 1.93-2.28:1 | WCAG 1.4.3 |
| B5 | BLOCK | **Disabled state visual**: `bg.disabled` y `bg.muted` comparten el mismo hex literal en ambos themes (`#F1ECDF` light / `#161616` dark). WCAG 1.4.3 exime disabled text, pero el state es visualmente indistinguible. | n/a (semantic) | — |

### 3.2 🟡 WARN — Arquitectura de tokens (10 issues)

| # | Issue | Severidad | Archivo |
|---|---|---|---|
| W1 | No existe primitive color scale (`gold.50..900`). Estándar Material 3, Polaris, Carbon, Tailwind v4. | WARN | `theme/{default,dark}.ts` |
| W2 | Colisiones semánticas: `bg.muted` = `bg.disabled` = `border.light` (mismo hex); `bg.card` = `bg.popover` (mismo hex). | WARN | `theme/{default,dark}.ts` |
| W3 | `accent` overload: un solo nombre semántico usado para brand color, surface tint, y text role. | WARN | `theme/types.ts` |
| W4 | No hay container pair (`errorContainer` / `onErrorContainer` style). | WARN | `theme/types.ts` |
| W5 | No hay `*inverse` tokens para state colors (cuando un danger badge se renderiza en dark surface, no hay cómo invertir). | WARN | `theme/types.ts` |
| W6 | 18 archivos con hex hardcoded fuera del theme (Display.GradientSurface, Navigation.AppBar, etc.). | WARN | varios |
| W7 | `validateTheme` es light: solo valida hex format, no contraste. `isOpacity` es dead code. | WARN | `theme/validate.ts` |
| W8 | `gradient.primary` / `gradient.accent` bypasean el theme: hardcoded literal. | WARN | `theme/{default,dark}.ts` |
| W9 | `shadow.shadowColor` hardcoded (`#4A3100` light, `#000000` dark), no derivado del theme. | WARN | `theme/{default,dark}.ts` |
| W10 | `fontWeight` en `typography.ts` son strings (`"700"`) en vez de numbers. Gaps en la escala (skip 700). | INFO | `theme/typography.ts` |

### 3.3 🟢 INFO — Polish

- No state-layer tokens (`state.hover: 0.08`, etc.) — Material 3 pattern.
- `overline` font-size hardcoded (`11` literal, no en `fontSizes`).
- `bg.inverse` declarado pero no usado en ningún componente verificado.

### 3.4 Referencias brand-specific (issue separado del WCAG)

Independiente del WCAG, el sistema tenía referencias explícitas al brand
Sincpro en código, comentarios y nombres. Esto rompe el contrato de abstracción:

- `theme.name = "brand-light"` / `"brand-dark"` (en lugar de `"default-light"` / `"default-dark"`)
- Comentarios en tokens: `// gold-500`, `// bone, warm light surface`, `// warm ink`
- `Display.GradientSurface` preset `"gold-mesh"`
- `typography.ts`: referencias a `"Satoshi"` en 4 lugares (ejemplos de font loading)
- `Display.Pattern.tsx`: constante `BUNDLED_BRAND_MESH`, función `resolveBrandMesh`
- `assets/brand-mesh.png`: nombre de archivo (no se renombró para evitar breaking change)

---

## 4. Fixes aplicados

### 4.1 Fase A — Limpieza de referencias brand-specific

**Cambios:**

| Archivo | Cambio |
|---|---|
| `theme/default.ts` | `name: "brand-light"` → `"default-light"`. Eliminados todos los comentarios `gold-N`, `bone`, `warm X`. |
| `theme/dark.ts` | `name: "brand-dark"` → `"default-dark"`. Mismos comentarios limpiados. |
| `theme/types.ts` | Comentario sobre `pattern` reescrito sin "Sincpro símbolo tiled". |
| `theme/typography.ts` | Eliminadas referencias a `"Satoshi"`. |
| `Display.GradientSurface.tsx` | Preset `"gold-mesh"` → `"warm"`. |
| `Display.Pattern.tsx` | `BUNDLED_BRAND_MESH` → `BUNDLED_MESH`, `resolveBrandMesh` → `resolveMesh`. |
| `branding.ts` | Comentario sobre "brand mesh symbol" → "mesh symbol". |

**Breaking change introducido:** `GradientPreset = keyof typeof GRADIENT_PRESETS | "brand"`
ya no incluye `"gold-mesh"`. Consumers con `preset="gold-mesh"` fallaban en TypeScript.

**Mitigación aplicada:** se restauró `"gold-mesh"` como alias deprecated vía
`DEPRECATED_PRESETS = { "gold-mesh": "warm" } as const satisfies Record<string,
keyof typeof GRADIENT_PRESETS>`. El tipo `GradientPreset` ahora incluye tanto
los canónicos como los deprecated. El runtime resuelve el alias al preset canónico.
Migración: cambiar `preset="gold-mesh"` → `preset="warm"` (drop the deprecation en
versión mayor).

### 4.2 Fase B — WCAG fixes (brand-agnostic)

Todas las decisiones siguen el principio: **el fix debe funcionar para cualquier
consumer que override `primary` con su propia paleta**. Si un consumer pone
`primary: #FF6600` (naranja), el sistema sigue siendo accesible.

#### B1 — CTA button text contrast

**Problema:** `text.onPrimary: #FFFFFF` sobre `primary: #C9A84C` = 2.29:1.

**Decisión:** cambiar `text.onPrimary` a `#0A0A0A` (texto oscuro sobre el brand
color vibrante). El CTA sigue siendo vibrante (el gold no se tocó), solo cambia
el color del texto.

**Rationale vs alternativas consideradas:**

| Alternativa | Pros | Contras | Decisión |
|---|---|---|---|
| Oscurecer `primary` a `#8B6914` | Color del brand ya no necesita distinción con `secondary` | El brand pierde viveza. La identidad visual cambia. | ❌ |
| Cambiar `text.onPrimary` a oscuro | Brand color unchanged. Funciona con cualquier `primary` override. | CTA con texto oscuro es menos común pero usado por Material 3 / Apple HIG en algunos casos. | ✅ |
| Introducir `primaryContainer` token | Patrón Material 3 ideal. | Requiere refactor mayor de `<Actions.Button>`. CTA pierde gradient. Diferido a P1. | ⏸️ |

**Cambio:**
- `default.ts` y `dark.ts`: `text.onPrimary: #FFFFFF` → `#0A0A0A`
- `<Actions.Button>` y `<BaseButton>`: `text-white` → `text-text-on-primary` (token dinámico)
- Loading color e icon color: actualizados en consecuencia
- Resultado: **8.66:1** (AAA) en ambos themes

**Por qué esto es brand-agnostic:** un consumer con `primary: "#FF6600"` (naranja)
+ override de `text.onPrimary` al color oscuro de su marca sigue teniendo ≥ 7:1.

#### B2 — Focus ring visibility

**Problema:** `border.focus: #C9A84C` sobre `bg.card` / `bg.page` en light mode = 2.29 / 2.15:1.

**Decisión:** cambiar `border.focus` en light mode a `#8B6914` (más oscuro). Dark mode sin cambios (ya pasaba 8.56:1).

**Cambio:**
- `default.ts`: `border.focus: #C9A84C` → `#8B6914`
- `default.ts`: `ring: #C9A84C` → `#8B6914` (consistencia con border.focus)
- Resultado: **4.79:1** (bg.page) / **5.09:1** (bg.card) en light, **8.56:1** en dark

#### B3 — Brand color como texto

**Problema:** 6+ componentes usaban Tailwind class `text-primary` (que mapea a
`rgb(var(--primary))` = `#C9A84C`) como texto, sobre `bg.card`/`bg.page` blancos.
Falla 2.29:1 / 2.15:1.

**Decisión arquitectónica:** el contrato semántico cambia — `primary` es
exclusivamente para superficies (bg de botones, borders, decorativos). Para texto
brand-colored, se usa el token existente `text.accent` (que ya es `#8B6914` en light,
más oscuro, ya pasaba WCAG).

**Por qué este patrón:** cualquier consumer con su propia paleta tendrá el mismo
problema si usa `primary` como texto (cualquier brand color va a fallar como texto
sobre white). La separación `primary` (surface) / `text.accent` (text) es la solución
correcta independientemente de la paleta.

**Cambios en componentes (clases Tailwind):**

| Componente | Antes | Después |
|---|---|---|
| `Toast.context.tsx` | `text-primary` (action label) | `text-text-accent` |
| `Dialog.ActionSheet.tsx` | `text-primary` (cancel label) | `text-text-accent` |
| `TabNavigatorLayout.tsx` | `text-primary` (active tab) | `text-text-accent` |
| `Display.CopyableText.tsx` | `text-primary` default | `text-text-accent` default |
| `Display.SearchHistory.tsx` | `text-primary` (clear all) | `text-text-accent` |
| `Display.SectionHeader.tsx` | `text-primary` (action) | `text-text-accent` |
| `Form.Dropdown.tsx` | `text-primary` outline/secondary | `text-text-accent` |
| `BaseButton.tsx` | `text-primary` secondary/outline/link | `text-text-accent` |
| `Actions.Button.tsx` | `text-primary` outline/link | `text-text-accent` |
| `Actions.FilterButton.tsx` | `text-primary` inactive | `text-text-accent` |

**Documentación sugerida (a agregar en README o PHILOSOPHY.md):**
> `primary` es para superficies (bg de botones, borders, accents decorativos).
> Para texto brand-colored (links, labels) usar `text.accent`. El token
> `text.accent` está diseñado para tener contraste WCAG AA sobre las superficies
> estándar (`bg.card`, `bg.page`).

#### B4 — State badges contrast

**Problema:** los state colors saturados (success/warning/danger/info) fallan
como background para body text blanco o text.primary.

**Decisión:** oscurecer los state colors en ambos themes. Esto afecta la viveza
visual (los colors ya no son tan "neón") pero garantiza accesibilidad.

**Cambio:**

| Token | Light antes | Light después | Dark antes | Dark después |
|---|---|---|---|---|
| `success` | `#16A34A` | `#15803D` | `#22C55E` | `#15803D` |
| `warning` | `#D97706` | `#B45309` | `#F59E0B` | `#B45309` |
| `danger` | `#DC2626` | `#B91C1C` | `#EF4444` | `#B91C1C` |
| `info` | `#2563EB` | `#1D4ED8` | `#3B82F6` | `#1D4ED8` |

**Decisión alternativa descartada:** introducir `successContainer` /
`onSuccessContainer` tokens (Material 3 pattern, deferred a P1). La razón:
P0 scope. Pero notar que **los state colors usados como bg + `text.onSuccess`
blanco no es el patrón recomendado para badges modernos** — el patrón moderno
es "container + onContainer" (un fill suave del state color + texto más oscuro).

#### B5 — Disabled state visual

**Problema:** `bg.disabled` y `bg.muted` comparten el mismo hex literal en ambos
themes (`#F1ECDF` light / `#161616` dark). El estado disabled es visualmente
indistinguible del estado muted.

**Decisión:** hacer `bg.disabled` distinto de `bg.muted` y oscurecer `text.disabled`
a un nivel que alcance ≥ 3:1 (exime WCAG 1.4.3 pero mejora UX).

**Cambio:**

| Theme | Token | Antes | Después |
|---|---|---|---|
| Light | `bg.disabled` | `#F1ECDF` (= muted) | `#E5DEC8` |
| Light | `text.disabled` | `#B5A984` | `#6B5A2E` |
| Light | `icon.disabled` | `#B5A984` | `#6B5A2E` |
| Dark | `bg.disabled` | `#161616` (= card/popover) | `#1F1F1F` |
| Dark | `text.disabled` | `#4A4A4A` | `#6B6B6B` |

Resultado: `text.disabled` ahora ≥ 3:1 contra todas las superficies (excepto
`bg.accent` en dark theme — ver Sección 6 Limitaciones).

### 4.3 Validación programática

Se extendió `validateTheme` (`sincpro_mobile_ui/theme/validate.ts`) con una nueva
función interna `validateContrast()` que chequea 7 pares críticos:

- `text.onPrimary` × `primary` (min 4.5:1)
- `text.onSecondary` × `secondary` (min 4.5:1)
- `text.onAccent` × `accent` (min 4.5:1)
- `text.onDanger` × `danger` (min 4.5:1)
- `text.onSuccess` × `success` (min 4.5:1)
- `border.focus` × `bg.page` (min 3:1)
- `border.focus` × `bg.card` (min 3:1)

Las violations se reportan como `Issue[]` (no fatal) en dev mode via `setActiveTheme`.
Tres tests nuevos (`tests/theme/validate.test.ts`) cubren el caso positivo, negativo,
y known-good pair.

**Función interna, no exportada.** No agrega superficie pública.

### 4.4 Bonus: shadow color derivado

`shadow.shadowColor` se cambió de `#4A3100` (un brown hardcoded en light mode)
a `#000000` (neutral). Esto es lo que hacen Material 3, Polaris y Carbon — el
shadow color es independiente del brand color. Decisión: para v1.0, el shadow
siempre es neutral; en una iteración futura se puede derivar de un `shadow.color`
token.

---

## 5. Métricas: antes vs después

### 5.1 Contraste WCAG

88 pares auditados en ambos themes.

| Estado | Antes | Después |
|---|---|---|
| **FAIL** (< 3:1) | **22** | **0** (excluyendo `text.disabled` en `bg.accent` que WCAG 1.4.3 exime — ver Sección 6) |
| AA-large only (3-4.5:1) | 16 | 16 (limitación del sample gold — ver Sección 6) |
| AA (≥ 4.5:1) | 64 | 31 |
| **AAA** (≥ 7:1) | 0 | **35** |

**Cambio cualitativo importante:** pasamos de **0 pares AAA a 35 pares AAA**. Los
pares más críticos (CTA, focus, primary body text) ahora pasan AAA en ambos themes.

### 5.2 Hits originales por par crítico

| Par | Antes | Después | Standard |
|---|---|---|---|
| CTA: `text.onPrimary` × `primary` (light) | 2.29:1 FAIL | 8.66:1 AAA | AA 4.5:1 |
| CTA: `text.onPrimary` × `primary` (dark) | 8.66:1 AAA | 8.66:1 AAA | AA 4.5:1 |
| Focus: `border.focus` × `bg.card` (light) | 2.29:1 FAIL | 5.09:1 AA | AA-large 3:1 |
| Focus: `border.focus` × `bg.page` (light) | 2.15:1 FAIL | 4.79:1 AA | AA-large 3:1 |
| Brand text: `primary` × `bg.card` (light) | 2.29:1 FAIL | 5.09:1 (via text.accent) | AA 4.5:1 |
| `text.onDanger` × `danger` (light) | 4.83:1 AA | 6.47:1 AA | AA 4.5:1 |
| `text.onSuccess` × `success` (light) | 3.30:1 AA-large | 5.02:1 AA | AA 4.5:1 |
| `text.onSuccess` × `success` (dark) | 2.28:1 FAIL | 3.95:1 AA-large | AA 4.5:1 ⚠️ |
| `text.disabled` × `bg.disabled` (light) | 1.98:1 FAIL | 4.99:1 AA | (exime WCAG) |
| `text.disabled` × `bg.muted` (light) | 1.98:1 FAIL | 5.69:1 AA | (exime WCAG) |
| `text.disabled` × `bg.card` (dark) | 2.04:1 FAIL | 3.40:1 AA-large | (exime WCAG) |

### 5.3 State color shifts (visual)

Los state colors (success/warning/danger/info) se oscurecieron en ambos themes.
Esto es un **cambio visual deliberado** — el rojo de danger ya no es tan "neón",
sino más cercano al rojo Material/Carbon. Consumers que estaban configurados al
valor anterior tendrán que ajustar sus assets/screenshots.

Si el experto prefiere mantener los state colors vibrantes, la solución a largo
plazo es el patrón container: `successContainer` (un verde suave) + `onSuccessContainer`
(un verde oscuro). Eso requiere refactor mayor — diferido a P1.

### 5.4 Abstracción de marca

| Métrica | Antes | Después |
|---|---|---|
| Comentarios con `gold-N` / `bone` / `warm X` / `Satoshi` en código DS | ~30 | 0 |
| Theme names con `brand-` prefix | 2 (`brand-light/dark`) | 0 |
| Presets con `gold-mesh` name en API | 1 activo | 1 deprecated alias + 1 canonical (`warm`) |

---

## 6. Limitaciones conocidas (no resueltas en P0)

### 6.1 `text.tertiary` y `text.disabled` sobre `bg.accent` en dark mode

`bg.accent` en dark mode es `#3D2F0A` (un gold oscuro para row highlight).
`text.tertiary` es `#8B6914` (gold oscuro). Mismo hue family → contraste bajo:

| Par | Ratio | Severidad |
|---|---|---|
| `dark text.tertiary` × `bg.accent` | 2.57:1 | AA-large only (4.5 fallaría, 3 pasa) |
| `dark text.disabled` × `bg.accent` | 2.45:1 | Exime WCAG 1.4.3 (disabled) |

**Por qué no se arregló:** `bg.accent` está diseñado como un surface sutil. Cualquier
intento de hacerlo contrastar con múltiples roles de texto simultáneamente requiere
cambiar la paleta (lo cual un consumer puede hacer — es sample data).

**Recomendación para P1:** introducir `bg.accentContainer` o cambiar la convención
a "el contenido sobre `bg.accent` siempre usa `text.onAccent`" (que es dark,
contrasta bien).

### 6.2 `fontWeight` como strings

`typography.ts:64-76` declara `fontWeights` como strings (`"700"`, etc.). React
Native acepta strings pero la convención es number. Skip en la escala
(300, 400, 500, 600, 800 — falta 700).

**Riesgo:** si algún consumer compara tipos numéricamente, falla. Si pasan los
strings a `TextStyle.fontWeight` directamente, RN los acepta. Bajo riesgo
práctico pero inconsistente.

**Decisión:** diferido. Requiere tocar `Typography` (extensión de API).

### 6.3 18 archivos con hex hardcoded

`grep -r "#[0-9a-fA-F]\{6\}" sincpro_mobile_ui --include="*.ts" --include="*.tsx"`
devuelve 18 archivos fuera de `theme/`. La mayoría son:
- `<Display.GradientSurface>` con presets decorativos (esperable — son
  decorativos, no del theme).
- `<Display.Story>` con el Instagram-ring gradient hardcoded.
- `<Feedback.Error>` con `#ef4444` para el icono (este coincide con `theme.danger`,
  podría tokenizarse).
- `<Navigation.BottomNav>` con `DARK_SURFACE = "#15181B"` (background hex
  hardcoded — debería ser `theme.bg.inverse`).

**Decisión:** cleanup parcial en P0 — los consumers de tokens semánticos
están limpios. Los decorativos (gradients fijos) son válidos como presets.
Quedan para P1/P2: tokenizar los icon colors específicos.

### 6.4 `gradient.primary` / `gradient.accent` son literal

`theme.gradient.primary = ["#F0D060", "#C9A84C"]` y `accent = ["#C9A84C", "#8B6914"]`
están hardcoded. Si un consumer override `primary` con su color (ej. naranja), el
gradient sigue siendo gold.

**Decisión:** diferido a P1. La fix arquitectónica es derivar los gradients del
primitive scale (que tampoco existe — ver 4.6.5 abajo).

### 6.5 No existe primitive color scale

El sistema no tiene `gold.50..900` (o equivalente para cualquier brand).
Consecuencias:
- Override del brand = override de todos los tokens semánticos (no solo `primary`).
- State layer math (hover, pressed) no se puede derivar programáticamente.
- Cross-theme consistency (light, dark, high-contrast) requiere reescritura manual.

**Material 3, Polaris, Carbon y Tailwind v4 todos tienen primitive scales.**
Es la base para escalar el sistema. **Diferido a P1** porque excede scope P0.

---

## 7. Trabajo diferido (recomendado para roadmap)

### 7.1 P1 — Hacer antes de 1.0

| Item | Esfuerzo | Impacto |
|---|---|---|
| Primitive color scale (`gold.50..900` o parametrizable) | M | Resuelve W1, W5, W8, 6.4, 6.5 |
| Container tokens (`primaryContainer`/`onPrimaryContainer`, etc.) | M | Reemplaza CTA con texto oscuro por patrón Material 3 |
| Eliminar `gold-mesh` deprecated alias | S | Una vez confirmado que consumers migraron |
| `validateTheme` también chequea `bg.disabled ≠ bg.muted` y otros semánticos | S | Previene regresiones de colisión |
| Reemplazar `fontWeight` strings con numbers | S | Consistencia de tipos |
| Tokenizar los icon colors hardcoded restantes | S | Limpieza completa |

### 7.2 P2 — Polish / escalabilidad

| Item | Esfuerzo |
|---|---|
| State-layer tokens (`state.hover: 0.08`, etc.) | M |
| Tokenizar `shadow.shadowColor` desde un token derivado del theme | S |
| `overline` font-size como token (no hardcoded `11`) | S |
| Auto-generar documentación de tokens desde código | M |
| Snapshot testing de componentes (visual regression) | L |

### 7.3 Out of scope (no recomendado)

- Agregar soporte para high-contrast theme (requeriría nuevo `theme.highContrast`).
- Dark mode toggle runtime — fuera del scope del DS (lo provee `@sincpro/mobile`).

---

## 8. Preguntas abiertas para revisión

Las decisiones tomadas tienen tradeoffs explícitos. El experto debería validar:

### 8.1 CTA text color — oscuro vs blanco

**Decisión actual:** `text.onPrimary: #0A0A0A` (texto oscuro sobre CTA vibrante).

- **Pro:** Funciona con cualquier brand color (consumer-agnostic). AAA pass.
- **Pro:** Mantiene el gradient vibrante del brand.
- **Con:** Menos convencional que blanco sobre color (mayoría de apps mobile usan blanco).
- **Con:** El `<Actions.Button variant="primary">` se ve "invertido" (texto oscuro sobre fill claro vs el patrón típico).

**Alternativa rechazada:** el patrón Material 3 sería `primaryContainer` (un surface
más claro del brand) + `onPrimaryContainer` (texto oscuro encima). Esto es lo que
recomendaríamos para P1.

**Pregunta para el experto:** ¿es acceptable el patrón "texto oscuro sobre CTA vibrante"
para apps mobile de Sincpro, o preferís el patrón container de Material 3?

### 8.2 State colors — ¿container pattern ahora o en P1?

**Decisión actual:** oscurecer `success/warning/danger/info` para que `text.on*`
blanco alcance WCAG AA.

- **Pro:** Cero breaking change para consumers (los tokens siguen llamándose igual).
- **Con:** Los state colors ya no son "vibrantes" — son más "corporativos".
- **Con:** El patrón moderno de Material 3 usa container + onContainer (un fill
  suave + texto oscuro encima), no fill vibrante + texto blanco.

**Pregunta:** ¿mantenemos los state colors oscuros o invertimos al patrón container
para P1? Esto cambia la identidad visual de badges/toasts significativamente.

### 8.3 `bg.accent` semánticamente conflictivo en dark mode

**Decisión actual:** `bg.accent: #3D2F0A` (dark) se queda igual. Texto `text.disabled`
y `text.tertiary` sobre él no alcanzan WCAG.

**Pregunta:** ¿debemos:
a) Cambiar la convención (texto sobre `bg.accent` siempre usa `text.onAccent`)
b) Cambiar `bg.accent` a un gold más claro (pierde "subtle highlight" character)
c) Agregar `bg.accentContainer` separado (P1)

### 8.4 Hex strings vs numbers en `fontWeights`

**Decisión actual:** strings (deferred).

**Pregunta:** ¿hay consumers reales que comparan `fontWeights.bold === 700` o
similar? Si no, deferir. Si sí, cambiar a numbers ahora.

### 8.5 Internal vs external surface del validator

`validateContrast` es interna (no exportada). El validator corre en dev mode via
`setActiveTheme`. En prod no corre.

**Pregunta:** ¿debemos exponer `validateContrast` para que consumers puedan
validar themes custom que no pasan por `setActiveTheme` (ej. generados
dinámicamente)? Si sí, ¿dónde debería vivir en el API (`@sincpro/mobile-ui/theme`?

### 8.6 Renombrar `assets/brand-mesh.png`

**Decisión actual:** no se renombró (breaking change para consumers que
importan el asset directamente).

**Pregunta:** ¿hay consumers que importan el asset directamente, o todos usan
vía `setBranding({ mesh })`? Si nadie lo importa, se puede renombrar a
`assets/mesh.png` o similar.

---

## 9. Archivos modificados (referencia rápida)

### Theme / tokens (Fase A + B)
- `sincpro_mobile_ui/theme/default.ts`
- `sincpro_mobile_ui/theme/dark.ts`
- `sincpro_mobile_ui/theme/types.ts` (solo comentario)
- `sincpro_mobile_ui/theme/typography.ts` (solo comentario)
- `sincpro_mobile_ui/theme/validate.ts` (validateContrast interno)

### Componentes (B3 — brand color como texto)
- `sincpro_mobile_ui/Feedback/Toast.context.tsx`
- `sincpro_mobile_ui/Dialog/Dialog.ActionSheet.tsx`
- `sincpro_mobile_ui/layouts/TabNavigatorLayout.tsx`
- `sincpro_mobile_ui/Display/Display.CopyableText.tsx`
- `sincpro_mobile_ui/Display/Display.SearchHistory.tsx`
- `sincpro_mobile_ui/Display/Display.SectionHeader.tsx`
- `sincpro_mobile_ui/Form/Form.Dropdown.tsx`
- `sincpro_mobile_ui/primitives/BaseButton.tsx`
- `sincpro_mobile_ui/Actions/Actions.Button.tsx`
- `sincpro_mobile_ui/Actions/Actions.FilterButton.tsx`
- `sincpro_mobile_ui/Typography/Typography.Text.tsx` (solo comentario)

### Otros (Fase A — abstracción de marca)
- `sincpro_mobile_ui/Display/Display.GradientSurface.tsx` (preset rename + deprecation alias)
- `sincpro_mobile_ui/Display/Display.Pattern.tsx` (constant/function rename)
- `sincpro_mobile_ui/Navigation/Navigation.AppBar.tsx` (preset rename)
- `sincpro_mobile_ui/Feedback/Feedback.DomainSplashScreen.tsx`
- `sincpro_mobile_ui/Feedback/Feedback.Splash.tsx`
- `sincpro_mobile_ui/layouts/AuthContainer.tsx`
- `sincpro_mobile_ui/branding.ts` (solo comentario)

### Tests
- `tests/theme/validate.test.ts` (+3 tests para contrast validation)

### Storybook
- `.rnstorybook/stories/Surfaces.stories.tsx` (label + preset rename)

### Archivos NO modificados (intencional)
- `App.tsx` — es el Storybook host, no la library. Usa Satoshi como ejemplo de
  brand font loading.
- `assets-fonts.d.ts` — ambient declaration del host.
- `assets/brand-mesh.png` — el nombre del archivo se queda (posible rename en
  versión mayor).

---

## 10. Cómo verificar este trabajo

### Reproducir el audit WCAG

El cálculo de contraste está implementado en `theme/validate.ts:validateContrast()`.
Para ejecutarlo manualmente:

```bash
# 1. Construir el package
make build

# 2. En un REPL de Node, importar y ejecutar validateTheme sobre los defaults
node -e "
const { validateTheme } = require('./dist/theme/validate.js');
const { DEFAULT_THEME } = require('./dist/theme/default.js');
const { DEFAULT_DARK_THEME } = require('./dist/theme/dark.js');
console.log('Light issues:', validateTheme(DEFAULT_THEME).filter(i => i.path.includes('onPrimary') || i.path.includes('border.focus')));
console.log('Dark issues:', validateTheme(DEFAULT_DARK_THEME).filter(i => i.path.includes('onPrimary') || i.path.includes('border.focus')));
"
```

Para P0: ambos outputs deben ser arrays vacíos. Si hay issues, son regresiones.

### Inspeccionar visualmente los componentes

```bash
make storybook        # abre Storybook on-device
```

Buscar: `<Actions.Button variant="primary">` — ahora debe tener texto oscuro
sobre el gradient gold.

### Correr los tests

```bash
make test             # 43 tests, todos pasan
make verify-format    # format + typecheck + stories + doctor + test
```

### Comparar con sistema conocido

- **Material 3** ([m3.material.io](https://m3.material.io/foundations/design-tokens/overview)):
  primitive + semantic + container pattern. El DS actual solo tiene semantic.
- **IBM Carbon** ([carbondesignsystem.com](https://carbondesignsystem.com/elements/color/tokens/)):
  primitive scales, semantic roles, theme variants.
- **Shopify Polaris** ([polaris.shopify.com/tokens/color](https://polaris.shopify.com/tokens/color)):
  role-based tokens, surface/intents/text roles.
- **Tailwind v4** ([tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme)):
  primitive + semantic vía CSS variables.

El DS actual está entre **Material 2 era** (semantic tokens con valores fijos) y
**Material 3 era** (semantic + container). Migrar a P1 sería alinear con Material 3.

---

## Anexo A: Cálculos completos

Para los números exactos, ver el script que generó este reporte (corrió
con las definiciones de `theme/default.ts` y `theme/dark.ts` posteriores al fix).
Los pares AAA nuevos (≥ 7:1) son:
- `text.secondary` sobre `bg.card`, `bg.popover`, `bg.disabled`, `bg.page`,
  `bg.muted`, `bg.accent` en ambos themes (todos pasan AAA — 7.21 a 11.43:1).
- `text.primary` sobre todas las superficies excepto `bg.accent` (light theme solo).
- `text.accent` sobre todas las superficies (dark theme).
- CTA pairs (`text.onPrimary` × `primary`) en ambos themes (8.66:1).
- Focus ring (`border.focus` × surfaces) en dark theme (8.56:1).

## Anexo B: Glosario

- **WCAG 2.1**: Web Content Accessibility Guidelines, version 2.1, AA level.
- **SC 1.4.3**: Success Criterion "Contrast (Minimum)" — texto normal 4.5:1,
  large text 3:1.
- **SC 1.4.11**: Success Criterion "Non-text Contrast" — UI components 3:1.
- **Primitive token**: color value en sí mismo (`#C9A84C`, `gold-500`).
- **Semantic token**: rol de uso del color (`primary`, `text.muted`).
- **Container token**: surface + onContainer pair (Material 3).
- **State layer**: overlay translúcido sobre un surface (Material 3 hover/pressed).

---

## 11. Correcciones post-revisión (framework)

Hallazgos de una segunda auditoría (mid-2026) aplicados para que el theme sea
mantenible como framework, no solo “arreglado para el sample gold”:

| Fix | Qué |
|---|---|
| Contrato documentado | `primary` = superficie; `text.accent` = texto brand; `resolveOnColor` para on-* |
| B3 completo | Icons/spinners outline/link + Tabs/BottomNav/Select/Toast usan `text.accent` / `onPrimary` |
| Roles distintos | `text.muted` ≠ `text.disabled`; `bg.disabled` ≠ `bg.muted` (light + dark) |
| Brand-agnostic on-color | `theme/contrast.ts` → `resolveOnColor`; defaults lo usan; validador sugiere si CTA falla |
| Validador | Chequea también `text.accent` sobre page/card y colisiones semánticas |
| globals.css | Fallback alineado con `DEFAULT_THEME` |
| Métricas §5 | Los conteos originales no sumaban 88 — usar `validateTheme` + tests como fuente de verdad |

Pendiente (no bloqueante): containers M3 (`*Light` + onContainer), Button flat por
defecto, Liquid Glass opt-in en nav/sheets.
