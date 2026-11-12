/**
 * One value of a series at a category (a month, a product). `null` is a missing value: a
 * line breaks there and no bar is drawn.
 */
export interface ChartPoint {
  key: string;
  value: number | null;
}

/**
 * A named sequence of points. Without `color` a series takes the palette slot of its
 * position; pass `color` when series come and go, so each keeps its color.
 */
export interface ChartSeries {
  name: string;
  data: readonly ChartPoint[];
  color?: string;
}

export type ChartValueFormatter = (value: number) => string;
