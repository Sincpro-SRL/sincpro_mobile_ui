import { containerPair, mixHex, shiftLightness } from "@sincpro/mobile-ui/theme/color";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import { DEFAULT_DARK_THEME } from "@sincpro/mobile-ui/theme/dark";
import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import { mergeTheme } from "@sincpro/mobile-ui/theme/define";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

export type BrandThemeMode = "light" | "dark";

export type BuildThemeFromBrandOptions = {
  /** Theme name (e.g. `acme-light`). */
  name: string;
  /** Brand seed fill (CTA / primary). */
  brand: string;
  mode: BrandThemeMode;
  /**
   * Brand-colored text on page/card. If omitted, derived by darkening (light)
   * or lightening (dark) the seed until it is usable as text.
   */
  brandText?: string;
  /** Optional secondary seed; defaults to a shifted brand hue. */
  secondary?: string;
  /** Optional accent seed; defaults to brand. */
  accent?: string;
};

const STATE_LIGHT = { hover: 0.08, press: 0.12, focus: 0.12, drag: 0.16 } as const;
const STATE_DARK = { hover: 0.1, press: 0.16, focus: 0.14, drag: 0.2 } as const;

const MATERIAL_LIGHT = { blur: 24, opacity: 0.78, borderOpacity: 0.18 } as const;
const MATERIAL_DARK = { blur: 28, opacity: 0.62, borderOpacity: 0.22 } as const;

const SUCCESS = "#15803D";
const WARNING = "#B45309";
const DANGER = "#B91C1C";
const INFO = "#1D4ED8";

function deriveBrandText(brand: string, mode: BrandThemeMode): string {
  if (mode === "light") {
    return shiftLightness(brand, -0.28);
  }
  // Dark surfaces need a light brand text — mix toward white until AA-friendly.
  return mixHex(brand, "#FFFFFF", 0.62);
}

/**
 * Builds a complete `ThemeTokens` from a brand seed — Material-style derivation
 * for mobile apps that rebrand without hand-authoring every token.
 *
 * Starts from `DEFAULT_THEME` / `DEFAULT_DARK_THEME` and overlays derived roles
 * so consumers always get containers, state layers, and material chrome.
 *
 * @example
 * setActiveTheme(buildThemeFromBrand({
 *   name: "acme-light",
 *   brand: "#0066FF",
 *   mode: "light",
 * }));
 */
export function buildThemeFromBrand(opts: BuildThemeFromBrandOptions): ThemeTokens {
  const { name, brand, mode } = opts;
  const base = mode === "light" ? DEFAULT_THEME : DEFAULT_DARK_THEME;
  const secondary = opts.secondary ?? shiftLightness(brand, mode === "light" ? -0.18 : -0.08);
  const accent = opts.accent ?? brand;
  const brandText = opts.brandText ?? deriveBrandText(brand, mode);

  const primaryC = containerPair(brand, mode);
  const secondaryC = containerPair(secondary, mode);
  const accentC = containerPair(accent, mode);
  const successC = containerPair(SUCCESS, mode);
  const warningC = containerPair(WARNING, mode);
  const dangerC = containerPair(DANGER, mode);
  const infoC = containerPair(INFO, mode);

  const page = mode === "light" ? mixHex(brand, "#FFFFFF", 0.96) : "#0C0C0C";
  const card = mode === "light" ? "#FFFFFF" : "#161616";
  const muted =
    mode === "light" ? mixHex(brand, "#FFFFFF", 0.92) : mixHex(brand, "#000000", 0.88);
  const bgAccent = primaryC.container;
  const hover =
    mode === "light" ? mixHex(brand, "#FFFFFF", 0.9) : mixHex(brand, "#000000", 0.82);
  const disabled =
    mode === "light" ? mixHex(brand, "#FFFFFF", 0.86) : mixHex("#FFFFFF", "#000000", 0.85);

  return mergeTheme(base, {
    name,
    primary: brand,
    secondary,
    accent,
    bg: {
      page,
      card,
      popover: card,
      muted,
      accent: bgAccent,
      hover,
      disabled,
      inverse: mode === "light" ? "#0C0C0C" : mixHex(brand, "#FFFFFF", 0.94),
      containerLowest: mode === "light" ? page : "#0A0A0A",
      container: muted,
      containerHigh: mode === "light" ? mixHex(brand, "#FFFFFF", 0.84) : "#1E1E1E",
    },
    text: {
      accent: brandText,
      onPrimary: resolveOnColor(brand),
      onSecondary: resolveOnColor(secondary),
      onAccent: resolveOnColor(accent),
      onDanger: resolveOnColor(DANGER),
      onSuccess: resolveOnColor(SUCCESS),
    },
    border: {
      focus: brandText,
      default: mode === "light" ? mixHex(brand, "#FFFFFF", 0.82) : "#262626",
      light: muted,
      strong: mode === "light" ? mixHex(brand, "#000000", 0.25) : "#3A3A3A",
    },
    ring: brandText,
    success: SUCCESS,
    warning: WARNING,
    danger: DANGER,
    info: INFO,
    successLight: successC.container,
    warningLight: warningC.container,
    dangerLight: dangerC.container,
    infoLight: infoC.container,
    container: {
      primary: primaryC.container,
      onPrimary: primaryC.onContainer,
      secondary: secondaryC.container,
      onSecondary: secondaryC.onContainer,
      accent: accentC.container,
      onAccent: accentC.onContainer,
      success: successC.container,
      onSuccess: successC.onContainer,
      warning: warningC.container,
      onWarning: warningC.onContainer,
      danger: dangerC.container,
      onDanger: dangerC.onContainer,
      info: infoC.container,
      onInfo: infoC.onContainer,
    },
    state: mode === "light" ? { ...STATE_LIGHT } : { ...STATE_DARK },
    material: mode === "light" ? { ...MATERIAL_LIGHT } : { ...MATERIAL_DARK },
    gradient: {
      primary: [shiftLightness(brand, 0.12), brand],
      accent: [brand, secondary],
    },
  });
}
