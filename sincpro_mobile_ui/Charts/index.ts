import BarChart from "@sincpro/mobile-ui/Charts/Charts.Bar";
import DonutChart from "@sincpro/mobile-ui/Charts/Charts.Donut";
import LineChart from "@sincpro/mobile-ui/Charts/Charts.Line";

/**
 * Charts for business dashboards. Import them from `@sincpro/mobile-ui/Charts`: they are
 * outside the root barrel, so an app that shows no chart never bundles them.
 */
export const Charts = {
  Bar: BarChart,
  Line: LineChart,
  Donut: DonutChart,
};

export {
  CHART_SERIES_DARK,
  CHART_SERIES_LIGHT,
  type ChartColors,
} from "@sincpro/mobile-ui/Charts/chart-colors";
export type {
  AxisTick,
  BarMark,
  CartesianFrame,
  CategoryLabel,
  DonutArc,
  DonutFrame,
  LineMark,
  Point,
  Rect,
} from "@sincpro/mobile-ui/Charts/chart-geometry";
export {
  type BarRendererProps,
  type ChartFont,
  type ChartRenderers,
  type DonutRendererProps,
  type LineRendererProps,
  registerChartRenderers,
  resetChartRenderers,
} from "@sincpro/mobile-ui/Charts/chart-renderer";
export type {
  ChartPoint,
  ChartSeries,
  ChartValueFormatter,
} from "@sincpro/mobile-ui/Charts/chart-types";
export type { BarChartProps } from "@sincpro/mobile-ui/Charts/Charts.Bar";
export type { DonutChartProps } from "@sincpro/mobile-ui/Charts/Charts.Donut";
export type { LineChartProps } from "@sincpro/mobile-ui/Charts/Charts.Line";
