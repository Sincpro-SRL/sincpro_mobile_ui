import {
  type ChartColors,
  chartColors,
  seriesColor,
} from "@sincpro/mobile-ui/Charts/chart-colors";
import { describeSlices, formatShare } from "@sincpro/mobile-ui/Charts/chart-describe";
import { formatChartValue } from "@sincpro/mobile-ui/Charts/chart-format";
import { ChartFrame, EMPTY_LABEL, Swatch } from "@sincpro/mobile-ui/Charts/chart-frame";
import {
  donutFrame,
  type DonutSlice,
  donutSlices,
  sliceAt,
} from "@sincpro/mobile-ui/Charts/chart-geometry";
import { activeChartRenderers } from "@sincpro/mobile-ui/Charts/chart-renderer";
import type { ChartPoint, ChartValueFormatter } from "@sincpro/mobile-ui/Charts/chart-types";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useState } from "react";
import { View } from "react-native";

export interface DonutChartProps {
  /** What the chart shows ("Ventas por canal"): its accessible name. */
  label: string;
  /** The parts of one whole. Zero, negative and missing values are left out. */
  data: readonly ChartPoint[];
  /** Diameter of the donut; it shrinks to the available width. */
  size?: number;
  /** Past this many parts the smallest fold into `otherLabel` (at most the palette's eight). */
  maxSlices?: number;
  otherLabel?: string;
  totalLabel?: string;
  formatValue?: ChartValueFormatter;
  /** The part the person selected, or `null` when they clear it. */
  onSelect?: (key: string | null) => void;
  loading?: boolean;
  emptyLabel?: string;
  testID?: string;
}

/** Every part with its value and share: the donut's table, and a way to select a part. */
function DonutLegend({
  slices,
  total,
  colors,
  selected,
  onSelect,
  formatValue,
}: {
  slices: readonly DonutSlice[];
  total: number;
  colors: ChartColors;
  selected: number | null;
  onSelect: (index: number | null) => void;
  formatValue: ChartValueFormatter;
}) {
  return (
    <View>
      {slices.map((slice, index) => {
        const share = formatShare(slice.value / total);
        const active = selected === index;
        return (
          <Pressable
            accessibilityLabel={`${slice.key}: ${formatValue(slice.value)}, ${share}`}
            accessibilityState={{ selected: active }}
            className="flex-row items-center gap-3"
            key={slice.key}
            onPress={() => onSelect(active ? null : index)}
            style={{ minHeight: 44 }}
          >
            <Swatch color={seriesColor(colors, index)} mark="slice" />
            <Typography.Text
              className="flex-1"
              numberOfLines={1}
              semibold={active}
              variant="bodySmall"
            >
              {slice.key}
            </Typography.Text>
            <Typography.Text variant="caption">{formatValue(slice.value)}</Typography.Text>
            <Typography.Text
              className="text-right text-text-secondary"
              style={{ minWidth: 56 }}
              variant="caption"
            >
              {share}
            </Typography.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** The parts of a whole: sales per channel, per category, per payment method. */
function DonutChart({
  label,
  data,
  size = 200,
  maxSlices = 6,
  otherLabel = "Otros",
  totalLabel = "Total",
  formatValue = formatChartValue,
  onSelect,
  loading = false,
  emptyLabel = EMPTY_LABEL,
  testID,
}: DonutChartProps) {
  const colors = chartColors(useTheme());
  const [width, setWidth] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const slices = donutSlices(
    data,
    Math.max(1, Math.min(maxSlices, colors.series.length)),
    otherLabel,
  );
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const selected = picked !== null && picked < slices.length ? picked : null;
  const focus = selected === null ? null : slices[selected];
  const diameter = width > 0 ? Math.min(size, width) : size;
  const frame = donutFrame(
    diameter,
    slices.map((slice) => slice.value),
  );
  const left = (width - diameter) / 2;
  const top = (size - diameter) / 2;
  const valueText = focus
    ? `${focus.key}: ${formatValue(focus.value)}, ${formatShare(focus.value / total)}`
    : `${totalLabel}: ${formatValue(total)}`;

  const select = (index: number | null) => {
    if (index === selected) return;
    setPicked(index);
    onSelect?.(index === null ? null : slices[index].key);
  };

  return (
    <ChartFrame
      count={slices.length}
      empty={!slices.length}
      emptyLabel={emptyLabel}
      footer={
        <DonutLegend
          colors={colors}
          formatValue={formatValue}
          onSelect={select}
          selected={selected}
          slices={slices}
          total={total}
        />
      }
      height={size}
      indexAt={(x, y) => sliceAt(frame, x - left, y - top)}
      label={label}
      loading={loading}
      onSelect={select}
      onWidth={setWidth}
      selected={selected}
      summary={describeSlices(slices, formatValue, totalLabel)}
      testID={testID}
      valueText={valueText}
    >
      {width > 0 ? (
        <View className="flex-1 items-center justify-center">
          <activeChartRenderers.donut
            arcs={frame.arcs.map((arc) => ({
              ...arc,
              color: seriesColor(colors, arc.index),
            }))}
            colors={colors}
            frame={frame}
            selected={selected}
          />
          {/* Three short lines fit the hole: at the middle it is almost as wide as its diameter. */}
          <View
            className="absolute items-center"
            pointerEvents="none"
            style={{ width: frame.inner * 1.7 }}
          >
            <Typography.Text adjustsFontSizeToFit numberOfLines={1} variant="data">
              {formatValue(focus ? focus.value : total)}
            </Typography.Text>
            <Typography.Text
              className="text-text-secondary"
              numberOfLines={1}
              variant="caption"
            >
              {focus ? focus.key : totalLabel}
            </Typography.Text>
            {focus ? (
              <Typography.Text className="text-text-secondary" variant="caption">
                {formatShare(focus.value / total)}
              </Typography.Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </ChartFrame>
  );
}

export default DonutChart;
