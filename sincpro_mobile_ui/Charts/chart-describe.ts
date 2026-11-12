import type { DonutSlice } from "@sincpro/mobile-ui/Charts/chart-geometry";
import type { ChartValueFormatter } from "@sincpro/mobile-ui/Charts/chart-types";

/**
 * What a chart says in words. A screen reader reads the summary, steps through the
 * categories with the adjustable actions, and hears the readout of each one. Sighted users
 * read the same values in the readout and the legend, so no value lives only in a color.
 */

const PERCENT = new Intl.NumberFormat("de-DE", {
  style: "percent",
  maximumFractionDigits: 1,
});

/** Above this many points, a series is summarized (first, last, extremes) instead of listed. */
const LISTED_POINTS = 12;

export interface ReadoutRow {
  name: string;
  value: string;
  color: string;
}

export interface ChartReadout {
  title: string;
  rows: readonly ReadoutRow[];
}

export interface DescribedSeries {
  name: string;
  color: string;
  values: readonly (number | null)[];
}

export function formatShare(share: number): string {
  return PERCENT.format(share);
}

export function readoutText(readout: ChartReadout | null): string {
  if (!readout) return "";
  return `${readout.title}: ${readout.rows.map((row) => `${row.name} ${row.value}`).join(", ")}`;
}

export function cartesianReadout(
  keys: readonly string[],
  series: readonly DescribedSeries[],
  index: number,
  format: ChartValueFormatter,
): ChartReadout {
  return {
    title: keys[index],
    rows: series.map((item) => {
      const value = item.values[index];
      return {
        name: item.name,
        color: item.color,
        value: value === null ? "—" : format(value),
      };
    }),
  };
}

export function describeSeries(
  keys: readonly string[],
  series: readonly DescribedSeries[],
  format: ChartValueFormatter,
): string {
  return series
    .map(({ name, values }) => {
      const points = keys.flatMap((key, index) => {
        const value = values[index];
        return value === null ? [] : [{ key, value }];
      });
      if (!points.length) return `${name}: sin datos`;
      if (points.length <= LISTED_POINTS) {
        return `${name}: ${points.map((point) => `${point.key} ${format(point.value)}`).join(", ")}`;
      }
      const lowest = points.reduce((low, point) => (point.value < low.value ? point : low));
      const highest = points.reduce((high, point) =>
        point.value > high.value ? point : high,
      );
      const first = points[0];
      const last = points[points.length - 1];
      return (
        `${name}: de ${first.key} a ${last.key}; ` +
        `mínimo ${format(lowest.value)} (${lowest.key}), ` +
        `máximo ${format(highest.value)} (${highest.key}), ` +
        `último ${format(last.value)}`
      );
    })
    .join(". ");
}

export function describeSlices(
  slices: readonly DonutSlice[],
  format: ChartValueFormatter,
  totalLabel: string,
): string {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const parts = slices.map(
    (slice) => `${slice.key} ${format(slice.value)}, ${formatShare(slice.value / total)}`,
  );
  return `${totalLabel} ${format(total)}. ${parts.join("; ")}`;
}
