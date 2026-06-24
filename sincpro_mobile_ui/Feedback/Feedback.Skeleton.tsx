import { cn } from "@sincpro/mobile-ui/theme/tw";
import { motion } from "@sincpro/mobile-ui/tokens/motion";
import { useEffect, useRef } from "react";
import { Animated, type DimensionValue, Easing, type ViewStyle } from "react-native";

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  circle?: boolean;
  className?: string;
  style?: ViewStyle;
}

function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
  circle = false,
  className,
  style,
}: SkeletonProps) {
  // eslint-disable-next-line react-hooks/refs
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: motion.duration.slow,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: motion.duration.slow,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const resolvedRadius = circle && typeof height === "number" ? height / 2 : radius;

  return (
    <Animated.View
      accessibilityElementsHidden
      className={cn("bg-bg-muted", className)}
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: resolvedRadius }, style, { opacity }]}
    />
  );
}

export default Skeleton;
