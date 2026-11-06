import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import type React from "react";
import { useEffect } from "react";
import { ActivityIndicator, View, type ViewProps } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// ─── Dots ─────────────────────────────────────────────────────────────────────

interface DotsProps {
  color: string;
  size: "small" | "large";
  animated: boolean;
}

function DotsLoader({ color, size, animated }: DotsProps) {
  const dotSize = size === "large" ? 11 : 8;
  const bounce = size === "large" ? 13 : 9;
  const dot = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: color,
  };

  const y1 = useSharedValue(0);
  const y2 = useSharedValue(0);
  const y3 = useSharedValue(0);

  useEffect(() => {
    y1.value = 0;
    y2.value = 0;
    y3.value = 0;
    if (!animated) return;
    const seq = withRepeat(
      withSequence(
        withTiming(-bounce, { duration: 280, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 280, easing: Easing.in(Easing.quad) }),
        withTiming(0, { duration: 200 }),
      ),
      -1,
      false,
    );
    y1.value = withDelay(0, seq);
    y2.value = withDelay(160, seq);
    y3.value = withDelay(320, seq);
    return () => {
      cancelAnimation(y1);
      cancelAnimation(y2);
      cancelAnimation(y3);
    };
  }, [animated, bounce, y1, y2, y3]);

  const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: y1.value }] }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: y2.value }] }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: y3.value }] }));

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Animated.View style={[dot, s1]} />
      <Animated.View style={[dot, s2]} />
      <Animated.View style={[dot, s3]} />
    </View>
  );
}

// ─── Ripple ───────────────────────────────────────────────────────────────────

interface RippleProps {
  color: string;
  size: "small" | "large";
  animated: boolean;
}

function RippleLoader({ color, size, animated }: RippleProps) {
  const base = size === "large" ? 48 : 32;

  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0.85);

  useEffect(() => {
    scale.value = animated ? 0.2 : 1;
    opacity.value = 0.85;
    if (!animated) return;
    scale.value = withRepeat(
      withTiming(2.6, { duration: 1400, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1400, easing: Easing.in(Easing.quad) }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [animated, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={{ width: base, height: base, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View
        style={[
          {
            width: base,
            height: base,
            borderRadius: base / 2,
            borderWidth: 2.5,
            borderColor: color,
            position: "absolute",
          },
          animStyle,
        ]}
      />
    </View>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type SpinnerVariant = "spinner" | "dots" | "ripple";

export interface SpinnerProps extends Omit<
  ViewProps,
  "children" | "accessibilityRole" | "accessibilityState"
> {
  /** Visual style of the loading indicator. Defaults to `"spinner"`. */
  variant?: SpinnerVariant;
  size?: "small" | "large";
  color?: string;
  text?: string;
  className?: string;
  animated?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  variant = "spinner",
  size = "large",
  color,
  text,
  style,
  className,
  animated = true,
  accessibilityLabel = text ?? "Cargando",
  ...props
}) => {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animated && !reducedMotion;
  const resolvedColor = color ?? theme.primary;
  const staticSize = size === "large" ? 36 : 20;
  const indicator =
    variant === "dots" ? (
      <DotsLoader animated={shouldAnimate} color={resolvedColor} size={size} />
    ) : variant === "ripple" ? (
      <RippleLoader animated={shouldAnimate} color={resolvedColor} size={size} />
    ) : shouldAnimate ? (
      <ActivityIndicator color={resolvedColor} size={size} />
    ) : (
      <View
        style={{
          width: staticSize,
          height: staticSize,
          borderRadius: staticSize / 2,
          borderWidth: 2,
          borderColor: resolvedColor,
          borderTopColor: "transparent",
        }}
      />
    );

  return (
    <View
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityState={{ busy: true }}
      accessible
      className={cn("items-center justify-center", className)}
      style={style}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {indicator}
      </View>
      {text && (
        <Typography.Text className="mt-2.5 text-base" variant="body">
          {text}
        </Typography.Text>
      )}
    </View>
  );
};

export default Spinner;
