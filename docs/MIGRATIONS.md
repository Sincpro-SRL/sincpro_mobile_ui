# Migration guide — `@sincpro/mobile-ui`

> Documenta migraciones **efectivamente publicadas** del package. Para planes de
> releases futuros, ver [`ROADMAP.md`](./ROADMAP.md).

El package sigue **semver**: minor versions son aditivos, majors pueden romper.
Para instrucciones de rebrand, ver [`REBRAND.md`](./REBRAND.md).

---

## 0.6.x → 0.7.x

Placeholder. Migraciones anteriores se agregan acá cuando este archivo se introdujo.

---

## 0.7.x → 0.8.x (planned — theme rebrand + a11y contract)

Breaking if your app relied on the previous **sample** defaults without calling
`setActiveTheme`:

| Before (0.7 sample) | After (0.8 sample) |
| --- | --- |
| Light `primary` `#2563EB` (blue) | `#C9A84C` (gold sample) |
| Dark `primary` `#00F58C` (neon) | `#C9A84C` (gold sample) |
| Theme names `default` / `dark` | `default-light` / `default-dark` |
| CTA ink often hardcoded white | `text.onPrimary` via `resolveOnColor` |
| Brand text via `text-primary` / `theme.primary` | `text-text-accent` / `theme.text.accent` |

**What to do**

1. Call `setActiveTheme(yourTheme)` at boot (see [`REBRAND.md`](./REBRAND.md)).
2. Replace brand-colored text classes: `text-primary` → `text-text-accent`.
3. Set on-colors with `resolveOnColor(fill)` — do not hardcode white/black for every brand.
4. Gradient preset `gold-mesh` → `warm` (deprecated alias still works until next major).
5. New token layers (additive): `container.*`, `bg.containerLowest|container|containerHigh`,
   `state.*`, `material.*`. Prefer `buildThemeFromBrand` for new apps.
6. Chips/badges: prefer `bg-container-success` + `text-container-on-success` over
   `bg-success-light` + `text-success` (legacy classes still work).

`validateTheme(tokens)` flags CTA contrast, focus ring, brand text on page/card,
container pairs, and muted/disabled collisions in `__DEV__`.

---

## Cómo leer la versión del package

- `0.x.y` — pre-estable (es el caso hoy). Minor bumps pueden incluir breaking changes.
- Después de `1.0.0`: `major` = breaking, `minor` = additive, `patch` = fixes only.

Pinear `^0.7.x` en tu app para recibir updates additive dentro de la línea 0.7.
Movel a `^1.0.0` solo después de leer las migration notes.