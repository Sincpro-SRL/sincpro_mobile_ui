import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type React from "react";
import { useEffect } from "react";
import { ActivityIndicator, View, type ViewStyle } from "react-native";
import Animated, {
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
}

function DotsLoader({ color, size }: DotsProps) {
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
  }, []);

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
}

function RippleLoader({ color, size }: RippleProps) {
  const base = size === "large" ? 48 : 32;

  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0.85);

  useEffect(() => {
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
  }, []);

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

export interface SpinnerProps {
  /** Visual style of the loading indicator. Defaults to `"spinner"`. */
  variant?: SpinnerVariant;
  size?: "small" | "large";
  color?: string;
  text?: string;
  style?: ViewStyle;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  variant = "spinner",
  size = "large",
  color = theme.primary,
  text,
  style,
  className,
}) => {
  const indicator =
    variant === "dots" ? (
      <DotsLoader color={color} size={size} />
    ) : variant === "ripple" ? (
      <RippleLoader color={color} size={size} />
    ) : (
      <ActivityIndicator color={color} size={size} />
    );

  return (
    <View className={cn("items-center justify-center", className)} style={style}>
      {indicator}
      {text && (
        <Typography.Text className="mt-2.5 text-base" variant="body">
          {text}
        </Typography.Text>
      )}
    </View>
  );
};

export default Spinner;
