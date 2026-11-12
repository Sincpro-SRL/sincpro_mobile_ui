import {
  CartesianChart,
  type CartesianChartProps,
} from "@sincpro/mobile-ui/Charts/chart-cartesian";

export interface BarChartProps extends CartesianChartProps {
  /** One bar per category with the series stacked, instead of side by side. */
  stacked?: boolean;
}

/** Magnitudes per category: sales per month, per seller, per product. */
function BarChart({ stacked = false, ...props }: BarChartProps) {
  return <CartesianChart {...props} kind="bar" stacked={stacked} />;
}

export default BarChart;
