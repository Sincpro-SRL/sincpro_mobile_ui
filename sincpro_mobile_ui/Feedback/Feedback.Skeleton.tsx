import { cn } from "@sincpro/mobile-ui/theme/tw";
import { motion } from "@sincpro/mobile-ui/tokens/motion";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { useEffect, useRef } from "react";
import { Animated, type DimensionValue, Easing, type ViewProps } from "react-native";

export interface SkeletonProps extends Omit<ViewProps, "children"> {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  circle?: boolean;
  className?: string;
  animated?: boolean;
}

function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
  circle = false,
  className,
  style,
  animated = true,
  ...props
}: SkeletonProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animated && !reducedMotion;
  // eslint-disable-next-line react-hooks/refs
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    opacity.setValue(0.5);
    if (!shouldAnimate) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: motion.duration.slow,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: motion.duration.slow,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity, shouldAnimate]);

  const resolvedRadius = circle && typeof height === "number" ? height / 2 : radius;

  return (
    <Animated.View
      {...props}
      accessibilityElementsHidden
      className={cn("bg-bg-muted", className)}
      importantForAccessibility="no-hide-descendants"
      style={[
        { width, height, borderRadius: resolvedRadius },
        style,
        { opacity: shouldAnimate ? opacity : 0.5 },
      ]}
    />
  );
}

export default Skeleton;
