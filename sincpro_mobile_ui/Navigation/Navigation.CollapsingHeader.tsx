import AppBar, {
  type AppBarActionProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { Animated, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface CollapsingHeaderProps {
  title: string;
  subtitle?: string;
  scrollY: Animated.Value;
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
 * scrolling; the large-title fades out and slides up. Controlled by an `Animated.Value`.
 *
 * Usage: pass `scrollY` from your `Animated.ScrollView`. Since the large-title collapses its
 * `height` (not supported by the native driver), use `useNativeDriver: false`:
 * ```tsx
 * const scrollY = useRef(new Animated.Value(0)).current;
 * <CollapsingHeader title="Inicio" scrollY={scrollY} />
 * <Animated.ScrollView
 *   onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
 *   scrollEventThrottle={16}
 * />
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
  const insets = useSafeAreaInsets();

  const largeOpacity = scrollY.interpolate({
    inputRange: [0, largeHeight * 0.6],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const largeTranslate = scrollY.interpolate({
    inputRange: [0, largeHeight],
    outputRange: [0, -largeHeight / 2],
    extrapolate: "clamp",
  });
  const largeContainerHeight = scrollY.interpolate({
    inputRange: [0, largeHeight],
    outputRange: [largeHeight, 0],
    extrapolate: "clamp",
  });
  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [largeHeight * 0.6, largeHeight],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={{ backgroundColor: theme.bg.card }} testID={testID}>
      <View style={{ paddingTop: safeArea ? insets.top : 0 }}>
        <View className="flex-row items-center px-3 gap-2 min-h-[52px]">
          <View style={{ minWidth: 38 }}>
            {onBack ? (
              <AppBar.Action
                accessibilityLabel="Volver"
                icon="chevron-back"
                onPress={onBack}
              />
            ) : null}
          </View>
          <Animated.View className="flex-1" style={{ opacity: compactTitleOpacity }}>
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

      <Animated.View style={{ height: largeContainerHeight, overflow: "hidden" }}>
        <Animated.View
          className="px-4 pb-2"
          style={{ opacity: largeOpacity, transform: [{ translateY: largeTranslate }] }}
        >
          <Typography.Text className="text-text-primary" variant="h2">
            {title}
          </Typography.Text>
          {subtitle ? (
            <Typography.Text className="text-text-secondary" variant="bodySmall">
              {subtitle}
            </Typography.Text>
          ) : null}
        </Animated.View>
      </Animated.View>
      <View className="border-b border-border-light" />
    </View>
  );
}

export type { AppBarActionProps };
export default CollapsingHeader;
