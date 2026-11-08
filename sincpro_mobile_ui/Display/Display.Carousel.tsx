import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { uniqueKeys } from "@sincpro/mobile-ui/utils/keys";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  type ScrollViewInstance,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export interface CarouselControlsProps {
  index: number;
  count: number;
  canPrevious: boolean;
  canNext: boolean;
  previous: () => void;
  next: () => void;
  goTo: (index: number) => void;
}

export interface CarouselProps<T> extends Omit<ViewProps, "children"> {
  data: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemWidth: number;
  gap?: number;
  showDots?: boolean;
  className?: string;
  testID?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
  previousAccessibilityLabel?: string;
  nextAccessibilityLabel?: string;
  formatPageLabel?: (index: number, count: number) => string;
  renderControls?: (props: CarouselControlsProps) => ReactNode;
  controlsClassName?: string;
  paginationTextProps?: ComponentProps<typeof Typography.Text>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  activeDotStyle?: StyleProp<ViewStyle>;
}

function Carousel<T>({
  data,
  renderItem,
  keyExtractor,
  itemWidth,
  gap = 12,
  showDots = true,
  className,
  testID,
  index: controlledIndex,
  onIndexChange,
  previousAccessibilityLabel = "Elemento anterior",
  nextAccessibilityLabel = "Elemento siguiente",
  formatPageLabel = (index, count) => `Elemento ${index + 1} de ${count}`,
  renderControls,
  controlsClassName,
  paginationTextProps,
  contentContainerStyle,
  itemStyle,
  dotStyle,
  activeDotStyle,
  ...viewProps
}: CarouselProps<T>) {
  if (
    !Number.isFinite(itemWidth) ||
    itemWidth <= 0 ||
    !Number.isFinite(gap) ||
    gap < 0 ||
    !Number.isFinite(itemWidth + gap)
  )
    throw new RangeError(
      "Carousel requires a positive finite itemWidth and a non-negative finite gap.",
    );
  if (
    controlledIndex !== undefined &&
    (!Number.isInteger(controlledIndex) || controlledIndex < 0)
  )
    throw new RangeError("Carousel index must be a non-negative integer.");
  if (controlledIndex !== undefined && !onIndexChange)
    throw new Error("Carousel requires onIndexChange when index is controlled.");

  const keys = uniqueKeys(data, keyExtractor, "Carousel");
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [scrollRevision, setScrollRevision] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const mounted = useRef(false);
  const snap = itemWidth + gap;
  const current = Math.min(controlledIndex ?? active, Math.max(0, data.length - 1));
  const nativePosition = useRef({ index: 0, snap, count: data.length, width: 0 });
  if (controlledIndex === undefined && active !== current) setActive(current);

  useEffect(() => {
    const previous = nativePosition.current;
    if (
      previous.index !== current ||
      previous.snap !== snap ||
      previous.width !== viewportWidth
    ) {
      scrollRef.current?.scrollTo({
        x: current * snap,
        y: 0,
        animated:
          mounted.current &&
          !reducedMotion &&
          previous.snap === snap &&
          previous.count === data.length &&
          previous.width === viewportWidth,
      });
    }
    nativePosition.current = {
      index: current,
      snap,
      count: data.length,
      width: viewportWidth,
    };
    mounted.current = true;
    if (
      controlledIndex === undefined &&
      previous.count > data.length &&
      previous.index !== current
    ) {
      onIndexChange?.(current);
    }
  }, [
    active,
    current,
    controlledIndex,
    data.length,
    onIndexChange,
    reducedMotion,
    snap,
    viewportWidth,
    scrollRevision,
  ]);

  const changeIndex = (next: number) => {
    setActive(next);
    if (next !== current) onIndexChange?.(next);
  };
  const goTo = (next: number) => {
    if (!Number.isInteger(next) || next < 0 || next >= data.length)
      throw new RangeError("Carousel goTo requires an index within the current data.");
    changeIndex(next);
  };
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    if (!Number.isFinite(offset))
      throw new RangeError("Carousel received a non-finite scroll offset.");
    const next = Math.max(0, Math.min(Math.round(offset / snap), data.length - 1));
    nativePosition.current = { index: next, snap, count: data.length, width: viewportWidth };
    changeIndex(next);
    if (controlledIndex !== undefined) setScrollRevision((revision) => revision + 1);
  };
  const controls: CarouselControlsProps = {
    index: current,
    count: data.length,
    canPrevious: current > 0,
    canNext: current < data.length - 1,
    previous: () => {
      if (current > 0) goTo(current - 1);
    },
    next: () => {
      if (current < data.length - 1) goTo(current + 1);
    },
    goTo,
  };

  return (
    <View {...viewProps} className={className} testID={testID}>
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        decelerationRate="fast"
        horizontal
        onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
        onMomentumScrollEnd={onScroll}
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        snapToInterval={snap}
        testID={testID ? `${testID}-scroll` : undefined}
      >
        {data.map((item, index) => (
          <View
            key={keys[index]}
            style={[
              itemStyle,
              { width: itemWidth, marginRight: index < data.length - 1 ? gap : 0 },
            ]}
          >
            {renderItem(item, index)}
          </View>
        ))}
        {data.length > 0 ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{ width: Math.max(0, viewportWidth - itemWidth) }}
            testID={testID ? `${testID}-end-spacing` : undefined}
          />
        ) : null}
      </ScrollView>

      {showDots && data.length > 1 ? (
        <View
          accessibilityElementsHidden
          className="flex-row justify-center gap-1.5 mt-3"
          importantForAccessibility="no-hide-descendants"
        >
          {data.map((_item, index) => (
            <View
              className="h-1.5 rounded-full"
              key={keys[index]}
              style={[
                {
                  width: index === current ? 16 : 6,
                  backgroundColor: index === current ? theme.primary : theme.border.strong,
                },
                dotStyle,
                index === current ? activeDotStyle : undefined,
              ]}
            />
          ))}
        </View>
      ) : null}
      {data.length > 1 ? (
        renderControls ? (
          renderControls(controls)
        ) : (
          <View
            className={controlsClassName ?? "flex-row items-center justify-center gap-3 mt-2"}
          >
            <IconButton
              accessibilityLabel={previousAccessibilityLabel}
              disabled={!controls.canPrevious}
              icon="back"
              onPress={controls.previous}
            />
            <Typography.Text {...paginationTextProps} accessibilityLiveRegion="polite">
              {formatPageLabel(current, data.length)}
            </Typography.Text>
            <IconButton
              accessibilityLabel={nextAccessibilityLabel}
              disabled={!controls.canNext}
              icon="next"
              onPress={controls.next}
            />
          </View>
        )
      ) : null}
    </View>
  );
}

export default Carousel;
