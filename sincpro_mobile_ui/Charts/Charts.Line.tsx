import {
  CartesianChart,
  type CartesianChartProps,
} from "@sincpro/mobile-ui/Charts/chart-cartesian";

export interface LineChartProps extends CartesianChartProps {
  /** A light wash under each line, for a total over time. */
  area?: boolean;
}

/** Change over time: daily collections, a month against the previous one. */
function LineChart({ area = false, ...props }: LineChartProps) {
  return <CartesianChart {...props} area={area} kind="line" />;
}

export default LineChart;
