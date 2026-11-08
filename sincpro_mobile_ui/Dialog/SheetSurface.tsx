import { useTheme } from "@sincpro/mobile-ui/theme";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { type ReactNode, useEffect, useEffectEvent } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import {
  KeyboardToolbar,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

const DURATION_MS = 260;
const CLOSE_VELOCITY = 900;
const MIN_CONTENT_ABOVE_KEYBOARD = 240;

export type SnapPoint = string | number;

export function resolveSnapPoint(point: SnapPoint, windowHeight: number): number {
  if (typeof point === "number") return point;
  const percent = Number.parseFloat(point);
  return Number.isFinite(percent) ? (windowHeight * percent) / 100 : windowHeight * 0.6;
}

export interface SheetSurfaceProps {
  /** `false` starts the exit animation. */
  visible: boolean;
  snapPoints: SnapPoint[];
  dismissible: boolean;
  /** The user asked to close: backdrop, drag or accessibility escape. */
  onRequestClose: () => void;
  /** The exit animation finished and the surface can unmount. */
  onExited: () => void;
  /** Drag area at the top of the panel. */
  header: ReactNode;
  children: ReactNode;
  testID?: string;
}

/**
 * Bottom sheet drawn in the app window. While it exits it ignores touches,
 * so a tap during the close animation never lands on a view that unmounts.
 */
export function SheetSurface({
  visible,
  snapPoints,
  dismissible,
  onRequestClose,
  onExited,
  header,
  children,
  testID,
}: SheetSurfaceProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const keyboard = useReanimatedKeyboardAnimation();

  const ceiling = windowHeight - insets.top - 8;
  const snaps = snapPoints
    .map((point) => Math.min(resolveSnapPoint(point, windowHeight), ceiling))
    .sort((a, b) => a - b);
  const panelHeight = snaps[snaps.length - 1] ?? windowHeight * 0.6;
  const offsets = snaps.map((snap) => panelHeight - snap).sort((a, b) => b - a);
  const restOffset = offsets[0] ?? 0;
  const hiddenOffset = panelHeight + insets.bottom;
  const duration = reducedMotion ? 0 : DURATION_MS;

  const translateY = useSharedValue(hiddenOffset);
  const dragStart = useSharedValue(0);

  const exited = useEffectEvent(() => onExited());

  useEffect(() => {
    if (visible) {
      translateY.set(
        withTiming(restOffset, {
          duration,
          easing: Easing.out(Easing.cubic),
        }),
      );
      return;
    }
    translateY.set(withTiming(hiddenOffset, { duration, easing: Easing.in(Easing.cubic) }));
    if (duration === 0) {
      exited();
      return;
    }
    const timer = setTimeout(() => exited(), duration);
    return () => clearTimeout(timer);
  }, [visible, restOffset, hiddenOffset, duration, translateY]);

  const requestClose = () => {
    if (visible && dismissible) onRequestClose();
  };

  const pan = usePanGesture({
    activeOffsetY: [-8, 8],
    onActivate: () => {
      "worklet";
      dragStart.set(translateY.get());
    },
    onUpdate: (event) => {
      "worklet";
      const lowest = dismissible ? hiddenOffset : restOffset + 40;
      translateY.set(Math.min(Math.max(dragStart.get() + event.translationY, 0), lowest));
    },
    onDeactivate: (event) => {
      "worklet";
      const position = translateY.get();
      const pastRest = position - restOffset;
      const closing =
        dismissible &&
        (event.velocityY > CLOSE_VELOCITY || pastRest > (panelHeight - restOffset) * 0.35);
      if (closing) {
        scheduleOnRN(onRequestClose);
        return;
      }
      let target = offsets[0] ?? 0;
      for (const offset of offsets) {
        if (Math.abs(offset - position) < Math.abs(target - position)) target = offset;
      }
      translateY.set(withTiming(target, { duration: DURATION_MS }));
    },
  });

  const panelStyle = useAnimatedStyle(() => {
    const lifted = Math.abs(keyboard.height.get());
    const height =
      lifted > 0
        ? Math.max(panelHeight, Math.min(ceiling, lifted + MIN_CONTENT_ABOVE_KEYBOARD))
        : panelHeight;
    return {
      height,
      paddingBottom: Math.max(insets.bottom, lifted),
      transform: [{ translateY: translateY.get() }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [restOffset, hiddenOffset], [1, 0], "clamp"),
  }));

  return (
    <View pointerEvents={visible ? "box-none" : "none"} style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable
          accessibilityLabel={dismissible ? "Cerrar" : undefined}
          accessibilityRole={dismissible ? "button" : undefined}
          accessible={dismissible}
          onPress={requestClose}
          style={StyleSheet.absoluteFill}
          testID={testID ? `${testID}-backdrop` : undefined}
        />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        importantForAccessibility="yes"
        onAccessibilityEscape={requestClose}
        style={[styles.panel, { backgroundColor: theme.bg.card }, panelStyle]}
        testID={testID}
      >
        <GestureDetector gesture={pan}>
          <View style={styles.handleArea}>
            <View style={[styles.handle, { backgroundColor: theme.border.default }]} />
            {header}
          </View>
        </GestureDetector>
        <KeyboardToolbar.Group style={styles.content}>{children}</KeyboardToolbar.Group>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "rgba(0,0,0,0.4)" },
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  content: { flex: 1, minHeight: 0 },
  handleArea: { paddingTop: 8 },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, marginBottom: 8 },
});
