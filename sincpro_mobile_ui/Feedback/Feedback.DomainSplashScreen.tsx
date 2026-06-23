import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import Pattern from "@sincpro/mobile-ui/Display/Display.Pattern";
import { Typography } from "@sincpro/mobile-ui/Typography";
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
        style={[StyleSheet.absoluteFill, splashStyle]}
      >
        <GradientSurface
          preset="night-green"
          radius="none"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Pattern color="#22E584" kind="dots" opacity={0.14} size={26} />
          <View className="flex-1 justify-center items-center px-8">
            <View className="w-full items-center gap-5">
              <Typography.Text
                bold
                style={{ color: "#FFFFFF", fontSize: 24, letterSpacing: 0.5 }}
              >
                {isComplete ? "¡Listo!" : `Cargando ${domainName}`}
              </Typography.Text>

              {!isComplete && (
                <View
                  className="w-full rounded-full h-1.5 overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                >
                  <Animated.View
                    className="rounded-full h-1.5"
                    style={[{ backgroundColor: "#22E584" }, progressBarStyle]}
                  />
                </View>
              )}

              {isComplete && (
                <Typography.Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                  Ya puedes comenzar a usar {domainName}.
                </Typography.Text>
              )}
            </View>
          </View>
        </GradientSurface>
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
