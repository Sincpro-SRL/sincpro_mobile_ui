import type { ChartValueFormatter } from "@sincpro/mobile-ui/Charts/chart-types";

// The same grouping as the DS amounts (`1.234,5`). Formatters are built once: building
// one is the slow part of Intl.
const FULL = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
const COMPACT = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

export function formatChartValue(value: number): string {
  return FULL.format(value);
}

/**
 * The axis style, chosen once for the whole axis by its largest tick: in full under 10.000,
 * then thousands (`25 k`), then millions (`1,5 M`).
 */
export function axisFormatter(ticks: readonly number[]): ChartValueFormatter {
  const largest = Math.max(0, ...ticks.map(Math.abs));
  if (largest < 10_000) return formatChartValue;
  const [divisor, unit] = largest < 1_000_000 ? [1_000, "k"] : [1_000_000, "M"];
  return (value) => (value === 0 ? "0" : `${COMPACT.format(value / divisor)} ${unit}`);
}
