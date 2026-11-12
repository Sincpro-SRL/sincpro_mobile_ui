import type { ChartColors } from "@sincpro/mobile-ui/Charts/chart-colors";
import type {
  BarMark,
  CartesianFrame,
  DonutArc,
  DonutFrame,
  LineMark,
} from "@sincpro/mobile-ui/Charts/chart-geometry";
import { svgChartRenderers } from "@sincpro/mobile-ui/Charts/svg-renderers";
import type { ComponentType } from "react";

/**
 * A renderer only paints. The chart components decide the data, colors, layout, selection
 * and accessibility; a renderer receives finished geometry (SVG path strings) and draws it.
 * The built-in renderers use react-native-svg, which the design system already requires.
 *
 * Replace one at startup, for example with a Skia renderer for very long series:
 *
 *   registerChartRenderers({ line: SkiaLineRenderer });
 *
 * `null` restores the built-in renderer. Every chart reads the registry when it renders.
 */

export interface ChartFont {
  /** Category labels. */
  family: string;
  /** Axis numbers: a monospaced family keeps the ticks aligned. */
  numeric: string;
  size: number;
}

interface CartesianRendererProps {
  frame: CartesianFrame;
  /** The selected category, or `null`. */
  selected: number | null;
  colors: ChartColors;
  font: ChartFont;
}

export interface BarRendererProps extends CartesianRendererProps {
  bars: readonly (BarMark & { color: string })[];
}

export interface LineRendererProps extends CartesianRendererProps {
  lines: readonly (LineMark & { color: string })[];
}

export interface DonutRendererProps {
  frame: DonutFrame;
  arcs: readonly (DonutArc & { color: string })[];
  selected: number | null;
  colors: ChartColors;
}

export interface ChartRenderers {
  bar: ComponentType<BarRendererProps>;
  line: ComponentType<LineRendererProps>;
  donut: ComponentType<DonutRendererProps>;
}

const renderers: ChartRenderers = { ...svgChartRenderers };

/**
 * The renderers in use, read by the charts as JSX members (`<activeChartRenderers.bar />`):
 * a module-level reference is a static component for React, unlike one returned by a call.
 */
export const activeChartRenderers: Readonly<ChartRenderers> = renderers;

export function registerChartRenderers(entries: {
  [Kind in keyof ChartRenderers]?: ChartRenderers[Kind] | null;
}): void {
  if ("bar" in entries) renderers.bar = entries.bar ?? svgChartRenderers.bar;
  if ("line" in entries) renderers.line = entries.line ?? svgChartRenderers.line;
  if ("donut" in entries) renderers.donut = entries.donut ?? svgChartRenderers.donut;
}

export function resetChartRenderers(): void {
  Object.assign(renderers, svgChartRenderers);
}
