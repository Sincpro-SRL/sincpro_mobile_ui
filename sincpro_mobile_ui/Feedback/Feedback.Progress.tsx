import { cn } from "@sincpro/mobile-ui/theme/tw";
import { motion } from "@sincpro/mobile-ui/tokens/motion";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export interface ProgressProps {
  value?: number;
  indeterminate?: boolean;
  height?: number;
  className?: string;
  testID?: string;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function Progress({
  value = 0,
  indeterminate = false,
  height = 6,
  className,
  testID,
}: ProgressProps) {
  const translate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!indeterminate) return;
    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: 1,
        duration: motion.duration.slower,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate, translate]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={
        indeterminate ? undefined : { now: Math.round(clamp(value) * 100), min: 0, max: 100 }
      }
      className={cn("w-full overflow-hidden rounded-full bg-bg-muted", className)}
      style={{ height }}
      testID={testID}
    >
      {indeterminate ? (
        <Animated.View
          className="h-full rounded-full bg-primary"
          style={{
            width: "40%",
            transform: [
              {
                translateX: translate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-40%", "250%"],
                }),
              },
            ],
          }}
        />
      ) : (
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${clamp(value) * 100}%` }}
        />
      )}
    </View>
  );
}

export default Progress;
