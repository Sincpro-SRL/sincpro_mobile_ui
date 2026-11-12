import { relativeLuminance } from "@sincpro/mobile-ui/theme/contrast";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/**
 * Categorical palette, light surfaces. The order is part of the palette: each adjacent pair
 * stays apart under color blindness (CVD ΔE ≥ 8.4) and for normal vision (ΔE ≥ 19), checked
 * against `bg.card` and `bg.page` of both default themes. Slots 3–5 are under 3:1 on white,
 * so a chart never relies on color alone: values are always written (readout, legend,
 * screen-reader summary).
 */
export const CHART_SERIES_LIGHT = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#6250d6",
  "#e34948",
] as const;

/** The same eight hues, stepped for dark surfaces (every slot ≥ 3:1). */
export const CHART_SERIES_DARK = [
  "#3987e5",
  "#d95926",
  "#199e70",
  "#c98500",
  "#d55181",
  "#008300",
  "#9085e9",
  "#e66767",
] as const;

export interface ChartColors {
  series: readonly string[];
  /** Series past the palette: never a generated hue. */
  overflow: string;
  surface: string;
  grid: string;
  baseline: string;
  label: string;
  /** Opacity of the marks that are not selected. */
  dimmed: number;
}

/** A theme is dark when its card surface is; the palette follows it unless the theme sets one. */
export function chartColors(theme: ThemeTokens): ChartColors {
  const dark = relativeLuminance(theme.bg.card) < 0.2;
  return {
    series: theme.chart?.series ?? (dark ? CHART_SERIES_DARK : CHART_SERIES_LIGHT),
    overflow: theme.text.tertiary,
    surface: theme.bg.card,
    grid: theme.border.default,
    baseline: theme.border.strong,
    label: theme.text.secondary,
    dimmed: 0.35,
  };
}

export function seriesColor(colors: ChartColors, index: number, pinned?: string): string {
  return pinned ?? colors.series[index] ?? colors.overflow;
}
