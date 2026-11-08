import { cn } from "@sincpro/mobile-ui/theme/tw";
import { motion } from "@sincpro/mobile-ui/tokens/motion";
import { normalizeProgress } from "@sincpro/mobile-ui/utils/progress";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export interface ProgressProps extends Omit<
  ViewProps,
  "children" | "accessibilityValue" | "accessibilityRole" | "accessibilityState"
> {
  value?: number;
  indeterminate?: boolean;
  height?: number;
  className?: string;
  animated?: boolean;
  indicatorClassName?: string;
  indicatorStyle?: StyleProp<ViewStyle>;
}

function Progress({
  value = 0,
  indeterminate = false,
  height = 6,
  className,
  animated = true,
  indicatorClassName,
  indicatorStyle,
  style,
  ...props
}: ProgressProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = indeterminate && animated && !reducedMotion;
  const progress = indeterminate ? 0 : normalizeProgress(value);
  const [translate] = useState(() => new Animated.Value(0));

  useEffect(() => {
    translate.setValue(0);
    if (!shouldAnimate) return;
    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: 1,
        duration: motion.duration.slower,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
        isInteraction: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [shouldAnimate, translate]);

  return (
    <View
      {...props}
      accessibilityRole="progressbar"
      accessibilityState={{ busy: indeterminate }}
      accessibilityValue={
        indeterminate ? undefined : { now: Math.round(progress * 100), min: 0, max: 100 }
      }
      accessible
      className={cn("w-full overflow-hidden rounded-full bg-bg-muted", className)}
      style={[{ height }, style]}
    >
      {indeterminate ? (
        <Animated.View
          className={cn("h-full rounded-full bg-primary", indicatorClassName)}
          style={[
            {
              width: "40%",
              marginLeft: shouldAnimate ? 0 : "30%",
              transform: shouldAnimate
                ? [
                    {
                      translateX: translate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["-40%", "250%"],
                      }),
                    },
                  ]
                : [],
            },
            indicatorStyle,
          ]}
        />
      ) : (
        <View
          className={cn("h-full rounded-full bg-primary", indicatorClassName)}
          style={[{ width: `${progress * 100}%` }, indicatorStyle]}
        />
      )}
    </View>
  );
}

export default Progress;
