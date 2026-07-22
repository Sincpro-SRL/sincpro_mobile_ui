/**
 * WCAG 2.1 contrast helpers for theme authors.
 * Used by `validateTheme` and by consumers building brand palettes.
 */

export function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.trim().replace(/^#/, "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const norm = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * norm(r) + 0.7152 * norm(g) + 0.0722 * norm(b);
}

/** Contrast ratio between two sRGB hex colors (WCAG 2.1). */
export function contrastRatio(fg: string, bg: string): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

const DEFAULT_ON_LIGHT = "#FFFFFF";
const DEFAULT_ON_DARK = "#0A0A0A";

export type ResolveOnColorOptions = {
  /** Ink for light fills. Default `#FFFFFF`. */
  light?: string;
  /** Ink for dark/saturated fills. Default `#0A0A0A`. */
  dark?: string;
  /** Minimum contrast (AA body = 4.5). */
  minRatio?: number;
};

/**
 * Picks light or dark ink for text/icons on a filled surface so WCAG AA holds
 * for any brand `primary` / `accent` / state color — not a hardcoded ink.
 *
 * @example
 * text: { onPrimary: resolveOnColor("#C9A84C") } // → #0A0A0A
 * text: { onPrimary: resolveOnColor("#0B1F4A") } // → #FFFFFF
 */
export function resolveOnColor(fill: string, options: ResolveOnColorOptions = {}): string {
  const light = options.light ?? DEFAULT_ON_LIGHT;
  const dark = options.dark ?? DEFAULT_ON_DARK;
  const min = options.minRatio ?? 4.5;
  const withLight = contrastRatio(light, fill);
  const withDark = contrastRatio(dark, fill);
  if (withLight >= min && withDark >= min) {
    return withLight >= withDark ? light : dark;
  }
  if (withLight >= min) return light;
  if (withDark >= min) return dark;
  return withLight >= withDark ? light : dark;
}
