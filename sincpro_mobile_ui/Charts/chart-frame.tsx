import type { ChartReadout } from "@sincpro/mobile-ui/Charts/chart-describe";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { type AccessibilityActionEvent, View } from "react-native";
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from "react-native-gesture-handler";

export type ChartMark = "bar" | "line" | "slice";

export const EMPTY_LABEL = "Sin datos para mostrar";

const STEP_ACTIONS = [{ name: "increment" }, { name: "decrement" }];

/** The key of a series or slice: a short line for lines, a square for filled marks. */
export function Swatch({ color, mark }: { color: string; mark: ChartMark }) {
  return (
    <View
      style={
        mark === "line"
          ? { width: 12, height: 2, borderRadius: 1, backgroundColor: color }
          : { width: 8, height: 8, borderRadius: 2, backgroundColor: color }
      }
    />
  );
}

/**
 * The values of the focused category, above the plot. Values lead and names follow; a single
 * series shows no name, since the chart's title already says what it is. Screen readers get
 * the same text as the plot's value, so the readout itself is hidden from them.
 */
export function ChartReadoutView({
  readout,
  mark,
}: {
  readout: ChartReadout;
  mark: ChartMark;
}) {
  return (
    <View
      accessibilityElementsHidden
      className="gap-1"
      importantForAccessibility="no-hide-descendants"
    >
      <Typography.Text className="text-text-secondary" variant="caption">
        {readout.title}
      </Typography.Text>
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        {readout.rows.map((row) => (
          <View className="flex-row items-center gap-2" key={row.name}>
            <Swatch color={row.color} mark={mark} />
            <Typography.Text variant="data">{row.value}</Typography.Text>
            {readout.rows.length > 1 ? (
              <Typography.Text className="text-text-secondary" variant="bodySmall">
                {row.name}
              </Typography.Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Names every series next to its mark; identity never depends on matching colors alone. */
export function ChartLegend({
  items,
  mark,
}: {
  items: readonly { name: string; color: string }[];
  mark: ChartMark;
}) {
  return (
    <View
      accessibilityElementsHidden
      className="flex-row flex-wrap gap-x-4 gap-y-1"
      importantForAccessibility="no-hide-descendants"
    >
      {items.map((item) => (
        <View className="flex-row items-center gap-2" key={item.name}>
          <Swatch color={item.color} mark={mark} />
          <Typography.Text className="text-text-secondary" variant="bodySmall">
            {item.name}
          </Typography.Text>
        </View>
      ))}
    </View>
  );
}

export interface ChartFrameProps {
  label: string;
  /** Every value in words, read after the label. */
  summary: string;
  /** The focused value in words; announced as the plot's value while stepping. */
  valueText: string;
  height: number;
  /** How many positions the selection steps through. */
  count: number;
  selected: number | null;
  onSelect: (index: number | null) => void;
  /** The position under a touch, in plot coordinates; `null` clears the selection. */
  indexAt: (x: number, y: number) => number | null;
  onWidth: (width: number) => void;
  header?: ReactNode;
  footer?: ReactNode;
  loading: boolean;
  empty: boolean;
  emptyLabel: string;
  testID?: string;
  children: ReactNode;
}

/**
 * What every chart shares: it measures the plot, selects with a tap or a horizontal drag
 * (a vertical drag keeps scrolling the screen), lets screen readers step through the values
 * as an adjustable control, and keeps the previous frame dimmed while new data loads.
 */
export function ChartFrame({
  label,
  summary,
  valueText,
  height,
  count,
  selected,
  onSelect,
  indexAt,
  onWidth,
  header,
  footer,
  loading,
  empty,
  emptyLabel,
  testID,
  children,
}: ChartFrameProps) {
  const pick = (x: number, y: number, toggle: boolean) => {
    const index = indexAt(x, y);
    onSelect(toggle && index === selected ? null : index);
  };
  const tap = useTapGesture({
    runOnJS: true,
    onActivate: ({ x, y }) => pick(x, y, true),
  });
  const drag = usePanGesture({
    runOnJS: true,
    activeOffsetX: [-8, 8],
    failOffsetY: [-12, 12],
    onActivate: ({ x, y }) => pick(x, y, false),
    onUpdate: ({ x, y }) => pick(x, y, false),
  });
  const gesture = useCompetingGestures(drag, tap);

  const step = (direction: 1 | -1) => {
    if (!count) return;
    if (selected === null) onSelect(direction === 1 ? 0 : count - 1);
    else onSelect(Math.min(count - 1, Math.max(0, selected + direction)));
  };
  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === "increment") step(1);
    if (event.nativeEvent.actionName === "decrement") step(-1);
  };

  if (loading && empty) {
    return (
      <View
        accessibilityLabel={`${label}. Cargando`}
        accessibilityState={{ busy: true }}
        accessible
        testID={testID}
      >
        <Skeleton height={height} />
      </View>
    );
  }

  if (empty) {
    return (
      <View
        accessibilityLabel={`${label}. ${emptyLabel}`}
        accessible
        className="items-center justify-center"
        style={{ height }}
        testID={testID}
      >
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          {emptyLabel}
        </Typography.Text>
      </View>
    );
  }

  return (
    <View className="gap-3" testID={testID}>
      {header}
      <GestureDetector gesture={gesture}>
        <View
          accessibilityActions={STEP_ACTIONS}
          accessibilityLabel={`${label}. ${summary}`}
          accessibilityRole="adjustable"
          accessibilityState={{ busy: loading }}
          accessibilityValue={{ text: valueText }}
          accessible
          onAccessibilityAction={onAccessibilityAction}
          onLayout={(event) => onWidth(event.nativeEvent.layout.width)}
          style={{ height, opacity: loading ? 0.5 : 1 }}
          testID={testID ? `${testID}-plot` : undefined}
        >
          {children}
        </View>
      </GestureDetector>
      {footer}
    </View>
  );
}
