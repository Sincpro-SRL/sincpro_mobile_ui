import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import Pattern from "@sincpro/mobile-ui/Display/Display.Pattern";
import Progress from "@sincpro/mobile-ui/Feedback/Feedback.Progress";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Animated, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

export interface DomainSplashRenderProps {
  domainName: string;
  isLoading: boolean;
  reducedMotion: boolean;
}

export interface DomainSplashScreenProps {
  domainName: string;
  isLoading: boolean;
  children: ReactNode;
  onComplete?: () => void;
  minDuration?: number;
  containerStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  renderLoading?: (props: DomainSplashRenderProps) => ReactNode;
  testID?: string;
}

function DomainSplashScreen({
  domainName,
  isLoading,
  children,
  onComplete,
  minDuration = 300,
  containerStyle,
  overlayStyle,
  renderLoading,
  testID,
}: DomainSplashScreenProps) {
  if (!Number.isFinite(minDuration) || minDuration < 0)
    throw new RangeError(
      "DomainSplashScreen minDuration must be a finite, non-negative number.",
    );

  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(isLoading ? 1 : 0));
  const [visible, setVisible] = useState(isLoading);
  const startedAt = useRef<number | null>(null);
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const busy = isLoading || visible;
  if (isLoading && !visible) setVisible(true);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isLoading) {
      startedAt.current = Date.now();
      completed.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      opacity.stopAnimation();
      opacity.setValue(1);
      return;
    }
    if (startedAt.current === null || completed.current) return;
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;
    const finish = () => {
      if (!active || completed.current) return;
      completed.current = true;
      setVisible(false);
      onCompleteRef.current?.();
    };
    const timeout = setTimeout(
      () => {
        if (reducedMotion) {
          opacity.setValue(0);
          finish();
        } else {
          animation = Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            isInteraction: false,
          });
          animation.start(({ finished }) => {
            if (finished) finish();
          });
        }
      },
      Math.max(0, minDuration - (Date.now() - startedAt.current)),
    );
    return () => {
      active = false;
      clearTimeout(timeout);
      animation?.stop();
    };
  }, [isLoading, minDuration, opacity, reducedMotion]);

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <View
        accessibilityElementsHidden={busy}
        importantForAccessibility={busy ? "no-hide-descendants" : "auto"}
        pointerEvents={busy ? "none" : "auto"}
        style={styles.container}
        testID={testID ? `${testID}-content` : undefined}
      >
        {children}
      </View>
      {busy ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: isLoading ? 1 : opacity },
            overlayStyle,
          ]}
          testID={testID ? `${testID}-loading` : undefined}
        >
          {renderLoading ? (
            renderLoading({ domainName, isLoading, reducedMotion })
          ) : (
            <GradientSurface
              className="flex-1"
              preset="warm"
              radius="none"
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <Pattern color={theme.primary} kind="dots" opacity={0.14} size={26} />
              <View className="flex-1 justify-center items-center px-8">
                <View className="w-full items-center gap-5">
                  <Typography.Text
                    bold
                    style={{ color: "#FFFFFF", fontSize: 24, letterSpacing: 0.5 }}
                  >
                    {`Cargando ${domainName}`}
                  </Typography.Text>

                  <Progress
                    accessibilityLabel={`Cargando ${domainName}`}
                    indeterminate
                    indicatorStyle={{ backgroundColor: theme.primary }}
                    style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                  />
                </View>
              </View>
            </GradientSurface>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DomainSplashScreen;
