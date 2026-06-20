import type React from "react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import GradientContainer from "../layouts/GradientContainer";
import { Typography } from "../Typography";

interface DomainSplashScreenProps {
  domainName: string;
  isLoading: boolean;
  children: ReactNode;
  onComplete?: () => void;
  minDuration?: number;
}

function DomainSplashScreen({
  domainName,
  isLoading,
  children,
  onComplete,
  minDuration = 300,
}: DomainSplashScreenProps) {
  const progressValue = useSharedValue(0);
  const opacityValue = useSharedValue(1);
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!isLoading) {
      progressValue.value = withTiming(100, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });

      setTimeout(() => {
        opacityValue.value = withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        });
      }, 100);
      return;
    }

    const startTime = Date.now();
    const totalDuration = 2500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      progressValue.value = newProgress;

      if (newProgress >= 100) {
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(() => {
          opacityValue.value = withTiming(
            0,
            {
              duration: 800,
              easing: Easing.out(Easing.ease),
            },
            (finished) => {
              if (finished) {
                scheduleOnRN(handleComplete);
              }
            },
          );
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  const splashStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  return (
    <View style={styles.container}>
      {children}
      <Animated.View
        pointerEvents={isLoading ? "auto" : "none"}
        style={[StyleSheet.absoluteFillObject, splashStyle]}
      >
        <GradientContainer className="flex-1 justify-center items-center px-8">
          <View className="w-full items-center gap-6">
            <Typography.Text className="text-2xl font-bold text-white">
              {isComplete ? "¡Listo!" : `Cargando ${domainName}`}
            </Typography.Text>

            {!isComplete && (
              <View className="w-full bg-transparent border border-white/30 rounded-full h-4 overflow-hidden">
                <Animated.View
                  className="bg-white rounded-full h-4 shadow-lg"
                  style={progressBarStyle}
                />
              </View>
            )}

            {isComplete && (
              <Typography.Text className="text-sm text-white/80">
                Ya puedes comenzar a usar {domainName}.
              </Typography.Text>
            )}
          </View>
        </GradientContainer>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DomainSplashScreen;
