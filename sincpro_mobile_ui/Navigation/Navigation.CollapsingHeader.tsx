import AppBar, {
  type AppBarActionProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { createContext, type ReactNode, use } from "react";
import { type ScrollViewProps, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** A scroll position read on the UI thread. Any Reanimated shared value fits. */
export interface ScrollOffset {
  get(): number;
}

const CollapsingContext = createContext<SharedValue<number> | null>(null);

/** Connects a `CollapsingHeader` with the `CollapsingHeader.ScrollView` below it. */
function Root({ children }: { children: ReactNode }) {
  const offset = useSharedValue(0);
  return (
    <CollapsingContext value={offset}>
      <View style={{ flex: 1 }}>{children}</View>
    </CollapsingContext>
  );
}

/** The scroll that drives the header. Its offset is written on the UI thread, never in JS. */
function CollapsingScrollView(props: Omit<ScrollViewProps, "onScroll">) {
  const offset = use(CollapsingContext);
  if (!offset) {
    throw new Error("CollapsingHeader.ScrollView must be inside CollapsingHeader.Root");
  }
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      offset.set(event.contentOffset.y);
    },
  });
  return <Animated.ScrollView scrollEventThrottle={16} {...props} onScroll={onScroll} />;
}

export interface CollapsingHeaderProps {
  title: string;
  subtitle?: string;
  /**
   * Scroll position from your own Reanimated scroll (FlashList, a custom list).
   * Inside `CollapsingHeader.Root` it comes from `CollapsingHeader.ScrollView`.
   */
  scrollY?: ScrollOffset;
  onBack?: () => void;
  actions?: ReactNode;
  /** Extra height of the collapsing large-title (px). Default 56, or 72 with subtitle. */
  largeHeight?: number;
  /** Reserves the status-bar space (insets.top). `false` to embed/demo. */
  safeArea?: boolean;
  testID?: string;
}

/**
 * Header with a large-title that **collapses on scroll** (merge of iOS 26 large title +
 * Material 3 large top app bar). The compact bar stays fixed and its title fades in while
 * scrolling; the large-title fades out and slides up.
 *
 * Every frame runs on the UI thread (Reanimated): scrolling never waits for JS.
 * ```tsx
 * <CollapsingHeader.Root>
 *   <CollapsingHeader title="Inicio" />
 *   <CollapsingHeader.ScrollView>{content}</CollapsingHeader.ScrollView>
 * </CollapsingHeader.Root>
 * ```
 */
function CollapsingHeader({
  title,
  subtitle,
  scrollY,
  onBack,
  actions,
  largeHeight = subtitle ? 72 : 56,
  safeArea = true,
  testID,
}: CollapsingHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const rootOffset = use(CollapsingContext);
  const offset = scrollY ?? rootOffset;
  if (!offset) throw new Error("CollapsingHeader needs CollapsingHeader.Root or scrollY");

  const largeStyle = useAnimatedStyle(() => {
    const y = offset.get();
    return {
      opacity: interpolate(y, [0, largeHeight * 0.6], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(
            y,
            [0, largeHeight],
            [0, -largeHeight / 2],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  const largeContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      offset.get(),
      [0, largeHeight],
      [largeHeight, 0],
      Extrapolation.CLAMP,
    ),
  }));
  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      offset.get(),
      [largeHeight * 0.6, largeHeight],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={{ backgroundColor: theme.bg.card }} testID={testID}>
      <View style={{ paddingTop: safeArea ? insets.top : 0 }}>
        <View className="flex-row items-center px-3 gap-2 min-h-[52px]">
          <View style={{ minWidth: 38 }}>
            {onBack ? (
              <AppBar.Action accessibilityLabel="Volver" icon="back" onPress={onBack} />
            ) : null}
          </View>
          <Animated.View style={[{ flex: 1 }, compactTitleStyle]}>
            <Typography.Text
              className="text-text-primary"
              numberOfLines={1}
              semibold
              variant="subtitle"
            >
              {title}
            </Typography.Text>
          </Animated.View>
          <View className="flex-row items-center justify-end gap-2" style={{ minWidth: 38 }}>
            {actions}
          </View>
        </View>
      </View>

      <Animated.View style={[{ overflow: "hidden" }, largeContainerStyle]}>
        <Animated.View style={largeStyle}>
          <View className="px-4 pb-2">
            <Typography.Text className="text-text-primary" variant="h2">
              {title}
            </Typography.Text>
            {subtitle ? (
              <Typography.Text className="text-text-secondary" variant="bodySmall">
                {subtitle}
              </Typography.Text>
            ) : null}
          </View>
        </Animated.View>
      </Animated.View>
      <View className="border-b border-border-light" />
    </View>
  );
}

const CollapsingHeaderWithParts = Object.assign(CollapsingHeader, {
  Root,
  ScrollView: CollapsingScrollView,
});

export type { AppBarActionProps };
export default CollapsingHeaderWithParts;
