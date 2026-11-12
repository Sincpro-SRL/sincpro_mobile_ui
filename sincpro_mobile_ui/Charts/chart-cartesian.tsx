import { chartColors, seriesColor } from "@sincpro/mobile-ui/Charts/chart-colors";
import {
  cartesianReadout,
  describeSeries,
  readoutText,
} from "@sincpro/mobile-ui/Charts/chart-describe";
import { formatChartValue } from "@sincpro/mobile-ui/Charts/chart-format";
import {
  ChartFrame,
  ChartLegend,
  ChartReadoutView,
  EMPTY_LABEL,
} from "@sincpro/mobile-ui/Charts/chart-frame";
import {
  barMarks,
  cartesianFrame,
  categoryAt,
  chartKeys,
  lineMarks,
  seriesValues,
  valueDomain,
} from "@sincpro/mobile-ui/Charts/chart-geometry";
import { activeChartRenderers } from "@sincpro/mobile-ui/Charts/chart-renderer";
import type { ChartSeries, ChartValueFormatter } from "@sincpro/mobile-ui/Charts/chart-types";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { fontFamilies } from "@sincpro/mobile-ui/theme/typography";
import { useState } from "react";

const AXIS_FONT_SIZE = 11;

export interface CartesianChartProps {
  /** What the chart shows ("Ventas por mes"): its accessible name. */
  label: string;
  /** Up to eight series; past the palette they are drawn in a neutral gray. */
  series: readonly ChartSeries[];
  /** Height of the plot, axes included. */
  height?: number;
  /** Values in the readout and the screen-reader summary (`v => \`Bs ${…}\``). */
  formatValue?: ChartValueFormatter;
  /** Axis ticks; by default in full under 10.000 and compact above. */
  formatAxis?: ChartValueFormatter;
  /** The category the person selected, or `null` when they clear it. */
  onSelect?: (key: string | null) => void;
  /** New data is on its way: the current chart stays, dimmed. */
  loading?: boolean;
  emptyLabel?: string;
  testID?: string;
}

function lastFilled(values: readonly (readonly (number | null)[])[]): number | null {
  for (let index = (values[0]?.length ?? 0) - 1; index >= 0; index--) {
    if (values.some((row) => row[index] !== null)) return index;
  }
  return null;
}

/** Bars and lines share data, axes, selection and accessibility; they differ in the marks. */
export function CartesianChart({
  kind,
  stacked = false,
  area = false,
  label,
  series,
  height = 200,
  formatValue = formatChartValue,
  formatAxis,
  onSelect,
  loading = false,
  emptyLabel = EMPTY_LABEL,
  testID,
}: CartesianChartProps & { kind: "bar" | "line"; stacked?: boolean; area?: boolean }) {
  const colors = chartColors(useTheme());
  const [width, setWidth] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const keys = chartKeys(series);
  const values = seriesValues(series, keys);
  const described = series.map((item, index) => ({
    name: item.name,
    color: seriesColor(colors, index, item.color),
    values: values[index],
  }));
  const empty = values.every((row) => row.every((value) => value === null));
  const selected = picked !== null && picked < keys.length ? picked : null;
  const focus = selected ?? lastFilled(values);
  const readout =
    focus === null ? null : cartesianReadout(keys, described, focus, formatValue);
  const frame =
    width > 0 && !empty
      ? cartesianFrame({
          width,
          height,
          keys,
          domain: valueDomain(values, stacked),
          formatAxis,
        })
      : null;
  const font = {
    family: fontFamilies.regular,
    numeric: fontFamilies.mono,
    size: AXIS_FONT_SIZE,
  };

  const select = (index: number | null) => {
    if (index === selected) return;
    setPicked(index);
    onSelect?.(index === null ? null : keys[index]);
  };

  return (
    <ChartFrame
      count={keys.length}
      empty={empty}
      emptyLabel={emptyLabel}
      footer={described.length > 1 ? <ChartLegend items={described} mark={kind} /> : null}
      header={readout ? <ChartReadoutView mark={kind} readout={readout} /> : null}
      height={height}
      indexAt={(x) => (frame ? categoryAt(frame, x) : null)}
      label={label}
      loading={loading}
      onSelect={select}
      onWidth={setWidth}
      selected={selected}
      summary={describeSeries(keys, described, formatValue)}
      testID={testID}
      valueText={readoutText(readout)}
    >
      {!frame ? null : kind === "bar" ? (
        <activeChartRenderers.bar
          bars={barMarks(frame, values, stacked).map((bar) => ({
            ...bar,
            color: described[bar.series].color,
          }))}
          colors={colors}
          font={font}
          frame={frame}
          selected={selected}
        />
      ) : (
        <activeChartRenderers.line
          colors={colors}
          font={font}
          frame={frame}
          lines={lineMarks(frame, values, area).map((line) => ({
            ...line,
            color: described[line.series].color,
          }))}
          selected={selected}
        />
      )}
    </ChartFrame>
  );
}
