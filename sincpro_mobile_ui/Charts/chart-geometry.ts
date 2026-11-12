import { axisFormatter } from "@sincpro/mobile-ui/Charts/chart-format";
import type {
  ChartPoint,
  ChartSeries,
  ChartValueFormatter,
} from "@sincpro/mobile-ui/Charts/chart-types";

/**
 * Chart geometry, independent of what draws it: every renderer receives these shapes as
 * SVG path strings (react-native-svg draws them as is; Skia reads them with
 * `Skia.Path.MakeFromSVGString`). Hit testing lives here too, so any renderer selects the
 * same category under the finger.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

/** Surface gap between touching marks: the space separates them, never a stroke. */
const GAP = 2;
/** Bars never fill their slot. */
const MAX_BAR_WIDTH = 24;
/** Rounded data end; the baseline end stays square. */
const BAR_RADIUS = 4;
/** Estimated width of one glyph of an axis label. */
const CHAR_WIDTH = 6.5;
const MAX_LABEL_WIDTH = 72;
const INSET = { top: 8, right: 8, bottom: 22, axisGap: 8 };

const round = (value: number) => Math.round(value * 100) / 100;

/** The keys of every series, in the order they first appear. */
export function chartKeys(series: readonly ChartSeries[]): string[] {
  const keys = new Set<string>();
  for (const item of series) for (const point of item.data) keys.add(point.key);
  return [...keys];
}

/** Each series' value per key; `null` where it has none or it is not a finite number. */
export function seriesValues(
  series: readonly ChartSeries[],
  keys: readonly string[],
): (number | null)[][] {
  return series.map((item) => {
    const byKey = new Map(item.data.map((point) => [point.key, point.value]));
    return keys.map((key) => {
      const value = byKey.get(key);
      return typeof value === "number" && Number.isFinite(value) ? value : null;
    });
  });
}

/** The extent the axis must cover; stacked charts add each category's values per sign. */
export function valueDomain(
  values: readonly (readonly (number | null)[])[],
  stacked: boolean,
): [number, number] {
  let min = 0;
  let max = 0;
  const count = values[0]?.length ?? 0;
  for (let index = 0; index < count; index++) {
    let up = 0;
    let down = 0;
    for (const row of values) {
      const value = row[index];
      if (value === null) continue;
      if (stacked) {
        if (value > 0) up += value;
        else down += value;
      } else {
        max = Math.max(max, value);
        min = Math.min(min, value);
      }
    }
    max = Math.max(max, up);
    min = Math.min(min, down);
  }
  return [min, max];
}

/** Round ticks (1, 2, 2.5 or 5 × 10ⁿ apart) that include 0 and cover `[min, max]`. */
export function niceTicks(min: number, max: number, count = 4): number[] {
  const low = Math.min(0, min);
  const high = Math.max(0, max) === low ? low + 1 : Math.max(0, max);
  const raw = (high - low) / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((factor) => factor * magnitude).find((value) => value >= raw) ??
    10 * magnitude;
  const start = Math.floor(low / step) * step;
  const end = Math.ceil(high / step) * step;
  const ticks: number[] = [];
  for (let index = 0; start + index * step <= end + step / 2; index++) {
    ticks.push(Number((start + index * step).toPrecision(12)));
  }
  return ticks;
}

export interface AxisTick {
  value: number;
  y: number;
  label: string;
}

export interface CategoryLabel {
  key: string;
  text: string;
  x: number;
}

export interface CartesianFrame {
  width: number;
  height: number;
  plot: Rect;
  ticks: readonly AxisTick[];
  /** The category labels that fit, truncated to their room. */
  labels: readonly CategoryLabel[];
  /** x of each category's center. */
  centers: readonly number[];
  /** Width of one category. */
  slot: number;
  y: (value: number) => number;
}

function truncate(text: string, room: number): string {
  if (text.length <= room) return text;
  return room <= 1 ? "…" : `${text.slice(0, room - 1)}…`;
}

export function cartesianFrame({
  width,
  height,
  keys,
  domain,
  formatAxis,
}: {
  width: number;
  height: number;
  keys: readonly string[];
  domain: [number, number];
  formatAxis?: ChartValueFormatter;
}): CartesianFrame {
  const values = niceTicks(domain[0], domain[1]);
  const format = formatAxis ?? axisFormatter(values);
  const tickLabels = values.map(format);
  const left =
    Math.max(...tickLabels.map((label) => label.length)) * CHAR_WIDTH + INSET.axisGap;
  const plot = {
    x: round(left),
    y: INSET.top,
    width: Math.max(0, width - left - INSET.right),
    height: Math.max(0, height - INSET.top - INSET.bottom),
  };
  const low = values[0];
  const high = values[values.length - 1];
  const y = (value: number) =>
    round(plot.y + plot.height * (1 - (value - low) / (high - low)));
  const slot = keys.length ? plot.width / keys.length : 0;
  const centers = keys.map((_, index) => round(plot.x + slot * (index + 0.5)));
  const widest = Math.max(0, ...keys.map((key) => key.length)) * CHAR_WIDTH + INSET.axisGap;
  const stride =
    slot > 0 ? Math.max(1, Math.ceil(Math.min(widest, MAX_LABEL_WIDTH) / slot)) : 1;
  const room = Math.max(1, Math.floor((slot * stride - 4) / CHAR_WIDTH));
  const labels = keys.flatMap((key, index) => {
    if (index % stride) return [];
    const text = truncate(key, room);
    const half = (text.length * CHAR_WIDTH) / 2;
    return [{ key, text, x: round(Math.min(width - half, Math.max(half, centers[index]))) }];
  });
  return {
    width,
    height,
    plot,
    ticks: values.map((value, index) => ({ value, y: y(value), label: tickLabels[index] })),
    labels,
    centers,
    slot,
    y,
  };
}

/** The category under `x`: the nearest one, so the finger never has to land on a mark. */
export function categoryAt(frame: CartesianFrame, x: number): number | null {
  if (!frame.centers.length || frame.slot <= 0) return null;
  const index = Math.floor((x - frame.plot.x) / frame.slot);
  return Math.min(frame.centers.length - 1, Math.max(0, index));
}

/** A bar from `base` to its data `end`: the data end is rounded, the base stays square. */
export function barPath(
  x: number,
  width: number,
  base: number,
  end: number,
  radius: number,
): string {
  const r = round(Math.min(radius, width / 2, Math.abs(base - end)));
  const inward = end < base ? 1 : -1;
  const sweep = inward === 1 ? 1 : 0;
  const left = round(x);
  const right = round(x + width);
  const corner = round(end + inward * r);
  return (
    `M${left} ${round(base)}L${left} ${corner}` +
    `A${r} ${r} 0 0 ${sweep} ${round(x + r)} ${round(end)}` +
    `L${round(x + width - r)} ${round(end)}` +
    `A${r} ${r} 0 0 ${sweep} ${right} ${corner}` +
    `L${right} ${round(base)}Z`
  );
}

export interface BarMark {
  series: number;
  index: number;
  path: string;
}

function outermost(
  values: readonly (readonly (number | null)[])[],
  index: number,
  positive: boolean,
): number {
  for (let series = values.length - 1; series >= 0; series--) {
    const value = values[series][index];
    if (value !== null && value !== 0 && value > 0 === positive) return series;
  }
  return -1;
}

/**
 * Grouped bars sit side by side with a surface gap; stacked segments are split by the same
 * gap and only the outermost segment of each sign gets the rounded end. A zero draws nothing.
 */
export function barMarks(
  frame: CartesianFrame,
  values: readonly (readonly (number | null)[])[],
  stacked: boolean,
): BarMark[] {
  const marks: BarMark[] = [];
  if (stacked) {
    const width = Math.min(MAX_BAR_WIDTH, frame.slot * 0.6);
    frame.centers.forEach((center, index) => {
      const top = outermost(values, index, true);
      const bottom = outermost(values, index, false);
      let up = 0;
      let down = 0;
      values.forEach((row, series) => {
        const value = row[index];
        if (value === null || value === 0) return;
        const positive = value > 0;
        const base = positive ? up : down;
        if (positive) up += value;
        else down += value;
        const end = frame.y(base + value);
        const start = frame.y(base) + (base === 0 ? 0 : positive ? -GAP : GAP);
        if (positive ? end >= start : end <= start) return;
        const rounded = series === (positive ? top : bottom);
        marks.push({
          series,
          index,
          path: barPath(center - width / 2, width, start, end, rounded ? BAR_RADIUS : 0),
        });
      });
    });
    return marks;
  }
  const count = values.length;
  const width = Math.max(
    1,
    Math.min(MAX_BAR_WIDTH, (frame.slot * 0.72 - GAP * (count - 1)) / count),
  );
  const group = width * count + GAP * (count - 1);
  const zero = frame.y(0);
  frame.centers.forEach((center, index) => {
    values.forEach((row, series) => {
      const value = row[index];
      if (value === null || value === 0) return;
      const x = center - group / 2 + series * (width + GAP);
      marks.push({
        series,
        index,
        path: barPath(x, width, zero, frame.y(value), BAR_RADIUS),
      });
    });
  });
  return marks;
}

export interface LineMark {
  series: number;
  path: string;
  /** The wash under the line, when the chart asks for an area. */
  area: string | null;
  points: readonly (Point | null)[];
  /** Points with no neighbor: a line cannot show them, so they are drawn as dots. */
  isolated: readonly Point[];
  /** The last point, which carries the end dot. */
  end: Point | null;
}

function runs(points: readonly (Point | null)[]): Point[][] {
  const result: Point[][] = [];
  let current: Point[] = [];
  for (const point of points) {
    if (point) current.push(point);
    else if (current.length) {
      result.push(current);
      current = [];
    }
  }
  if (current.length) result.push(current);
  return result;
}

/** A line breaks at a missing value instead of inventing one. */
export function lineMarks(
  frame: CartesianFrame,
  values: readonly (readonly (number | null)[])[],
  area: boolean,
): LineMark[] {
  const zero = frame.y(0);
  return values.map((row, series) => {
    const points = row.map((value, index) =>
      value === null ? null : { x: frame.centers[index], y: frame.y(value) },
    );
    const segments = runs(points);
    const path = segments
      .map((run) =>
        run.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(""),
      )
      .join("");
    const fill = segments
      .filter((run) => run.length > 1)
      .map(
        (run) =>
          `M${run[0].x} ${zero}${run.map((point) => `L${point.x} ${point.y}`).join("")}` +
          `L${run[run.length - 1].x} ${zero}Z`,
      )
      .join("");
    const last = segments[segments.length - 1];
    return {
      series,
      path,
      area: area && fill ? fill : null,
      points,
      isolated: segments.filter((run) => run.length === 1).map((run) => run[0]),
      end: last ? last[last.length - 1] : null,
    };
  });
}

export interface DonutSlice {
  key: string;
  value: number;
}

/**
 * The parts of a whole: positive values only (a zero draws nothing). Past `max`, the
 * smallest fold into one `otherKey` slice, so a donut never needs a ninth color.
 */
export function donutSlices(
  data: readonly ChartPoint[],
  max: number,
  otherKey: string,
): DonutSlice[] {
  const slices = data.flatMap((point) =>
    typeof point.value === "number" && Number.isFinite(point.value) && point.value > 0
      ? [{ key: point.key, value: point.value }]
      : [],
  );
  if (slices.length <= max) return slices;
  const kept = new Set([...slices].sort((a, b) => b.value - a.value).slice(0, max - 1));
  const rest = slices.filter((slice) => !kept.has(slice));
  return [
    ...slices.filter((slice) => kept.has(slice)),
    { key: otherKey, value: rest.reduce((total, slice) => total + slice.value, 0) },
  ];
}

export interface DonutArc {
  index: number;
  /** Angles in radians, clockwise from twelve o'clock. */
  start: number;
  end: number;
  path: string;
}

export interface DonutFrame {
  size: number;
  center: number;
  outer: number;
  inner: number;
  arcs: readonly DonutArc[];
}

function polar(center: number, radius: number, angle: number): string {
  return `${round(center + radius * Math.sin(angle))} ${round(center - radius * Math.cos(angle))}`;
}

function ringPath(center: number, outer: number, inner: number): string {
  const circle = (radius: number, sweep: number) =>
    `M${polar(center, radius, 0)}` +
    `A${radius} ${radius} 0 1 ${sweep} ${polar(center, radius, Math.PI)}` +
    `A${radius} ${radius} 0 1 ${sweep} ${polar(center, radius, 0)}Z`;
  return circle(outer, 1) + circle(inner, 0);
}

function arcPath(center: number, outer: number, inner: number, start: number, end: number) {
  if (end - start >= Math.PI * 2 - 1e-6) return ringPath(center, outer, inner);
  if (end <= start) return "";
  const large = end - start > Math.PI ? 1 : 0;
  return (
    `M${polar(center, outer, start)}` +
    `A${round(outer)} ${round(outer)} 0 ${large} 1 ${polar(center, outer, end)}` +
    `L${polar(center, inner, end)}` +
    `A${round(inner)} ${round(inner)} 0 ${large} 0 ${polar(center, inner, start)}Z`
  );
}

export function donutFrame(size: number, values: readonly number[]): DonutFrame {
  const center = size / 2;
  const outer = center - GAP;
  const inner = outer - Math.max(14, outer * 0.3);
  const total = values.reduce((sum, value) => sum + value, 0);
  const gap = values.length > 1 ? GAP / outer : 0;
  let angle = 0;
  const arcs = values.map((value, index) => {
    const start = angle;
    angle += total > 0 ? (value / total) * Math.PI * 2 : 0;
    return {
      index,
      start,
      end: angle,
      path: arcPath(center, outer, inner, start + gap / 2, angle - gap / 2),
    };
  });
  return { size, center, outer, inner, arcs };
}

/** The slice under the finger; the hole clears the selection. */
export function sliceAt(frame: DonutFrame, x: number, y: number): number | null {
  const dx = x - frame.center;
  const dy = y - frame.center;
  const distance = Math.hypot(dx, dy);
  if (distance < frame.inner * 0.6 || distance > frame.outer + 12) return null;
  const angle = (Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2);
  return frame.arcs.find((arc) => angle >= arc.start && angle < arc.end)?.index ?? null;
}
