# Rebranding the design system

> Use `@sincpro/mobile-ui` as the visual base for a different brand (Acme, ClientX, …). The
> framework is brand-agnostic by design: colors live in tokens, the brand symbol is a
> swappable asset, the logo is a singleton.

There are **three things** to change. Most apps only need (1) and (2).

---

## 1. Palette → `setActiveTheme(tokens)`

Define your brand theme and install it once at app boot. Components re-skin
automatically via CSS vars.

```tsx
// app entrypoint, before rendering any component
import {
  setActiveTheme,
  buildThemeFromBrand,
  extendTheme,
  resolveOnColor,
} from "@sincpro/mobile-ui/theme";

// Fast path — derive a full M3-style theme from a brand seed
const acmeLight = buildThemeFromBrand({
  name: "acme-light",
  brand: "#0066FF",
  mode: "light",
});

// Or hand-tune from defaults
const brand = "#0066FF";
const acmeHandTuned = extendTheme({
  name: "acme-light",
  primary: brand,
  accent: "#FF6B35",
  text: {
    accent: "#003D99",
    onPrimary: resolveOnColor(brand),
    onAccent: resolveOnColor("#FF6B35"),
  },
  border: { focus: "#003D99" },
  ring: "#003D99",
});

setActiveTheme(acmeLight);
```

**Color contract:** `primary` = fills/borders; brand text = `text.accent`; ink on
fills = `text.onPrimary` via `resolveOnColor`; badges/chips = `container.*` /
`container.on*`. Do not use `primary` as a text color.

For the **dark** counterpart: `buildThemeFromBrand({ ..., mode: "dark" })`. Toggle with
`useTheme()` or `setActiveTheme` again. Run `validateTheme(tokens)` in CI/dev if you
generate palettes dynamically.

> Don't know what to override? Open `theme/default.ts` (or `theme/dark.ts`) and copy the
> whole shape, then tweak. The type system (`ThemeTokens`) flags any missing key.

---

## 2. Brand symbol → `setBranding({ mesh })`

The brand mesh (`Display.Pattern kind="mesh"`) shows a tiled symbol from
`assets/brand-mesh.png` by default. Swap it once at boot:

```tsx
import { setBranding } from "@sincpro/mobile-ui/branding";

setBranding({
  logo: require("./assets/acme-logo.png"),
  mesh: require("./assets/acme-symbol.png"),
  meshSize: 56, // optional, px
});
```

That's it. Every `<Display.Pattern kind="mesh" />` (and `AppBar`, `AuthContainer`,
etc. that compose it) now renders the new symbol at the right size. No per-component
work.

Override hierarchy (highest to lowest):
1. `<Display.Pattern meshSrc={...} />` prop — per-call
2. `theme.pattern.source` — per-theme
3. `setBranding({ mesh })` — global, set at boot
4. Bundled `assets/brand-mesh.png` — final fallback

You only need (4) → (1) rarely; (3) covers 99% of rebrand cases.

---

## 3. Fonts (optional) → `tailwind.config.js` + `theme/typography.ts`

The default font is Inter / Satoshi. To rebrand, swap in your typeface in two places:

```ts
// theme/typography.ts
export const fontFamilies = {
  regular:  ["AcmeSans-Regular"],
  semibold: ["AcmeSans-SemiBold"],
  // ...
};
```

```js
// tailwind.config.js (your app's config)
module.exports = {
  presets: [require("@sincpro/mobile-ui/tailwind.preset")],
  // ... your overrides
};
```

---

## Checklist

- [ ] Define `BRAND_LIGHT_THEME` + `BRAND_DARK_THEME` from `defineTheme(...)`
- [ ] Call `setActiveTheme(BRAND_LIGHT_THEME)` at app boot
- [ ] Call `setBranding({ logo, mesh, meshSize? })` at app boot
- [ ] (Optional) Swap font families in `theme/typography.ts` if your brand uses a different typeface
- [ ] Run Storybook (`make storybook`) and check the `Foundations/Theme → Custom` story to see your new palette live
- [ ] If you forked the repo (vs consuming from npm), bump to a new version and publish

---

## Common gotchas

- **Some old brand asset names are still bundled?** The only asset bundled in
  `@sincpro/mobile-ui` is `brand-mesh.png`. Logo + brand symbol are passed by the consumer.
  Update your own app's `assets/` folder, not the DS package.
- **Components still render in old colors?** Confirm you called `setActiveTheme` BEFORE
  the first component mounts. Wrap it in your `createAppShell({...})` or top of `App.tsx`.
- **Brand mesh looks weird / inverted?** The asset should be a black symbol on transparent
  bg. The component flips it (`<feColorMatrix>`) on dark variants for contrast. If your
  asset is white-on-transparent, pre-invert it.
- **Status colors weird?** `success`/`warning`/`danger` are semantic — leave them as
  green/orange/red, even if your brand colors are different. Users expect those.
- **Component library still has "Sincpro" text?** Audit `Surfaces.stories.tsx` etc. — those
  are display examples you control; the *framework* is brand-agnostic. For a fork/rename,
  fork the repo; for consumption, leave them.

---

## Where things live

| Concept | File | Public API |
|---|---|---|
| Active theme singleton | `theme/active.ts` | `setActiveTheme`, `useTheme`, `getActiveTheme` |
| Theme tokens shape | `theme/types.ts` | `ThemeTokens`, `PatternMode` |
| Default themes | `theme/default.ts` + `theme/dark.ts` | `DEFAULT_THEME`, `DEFAULT_DARK_THEME` |
| Theme builders | `theme/define.ts` | `defineTheme`, `extendTheme`, `mergeTheme` |
| Theme validation | `theme/validate.ts` | `validateTheme` |
| Brand assets | `branding.ts` | `setBranding`, `getBrandingLogo`, `getBrandingMesh`, `getBrandingMeshSize` |
| CSS-var bridge | `theme/css-vars.ts` | `themeToVars` |
| Tailwind preset | `tailwind.preset.js` (root) | `@sincpro/mobile-ui/tailwind.preset` |
