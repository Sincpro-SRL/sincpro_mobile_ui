import { useTheme } from "@sincpro/mobile-ui/theme";
import { SCRIM } from "@sincpro/mobile-ui/theme/on-dark-surface";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewInstance,
} from "react-native";
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

const RestingOffsetContext = createContext(0);

/** The part of the sheet panel below the screen at rest (0 outside a sheet). */
export function useSheetRestingOffset(): number {
  return useContext(RestingOffsetContext);
}

export function resolveSnapPoint(point: SnapPoint, windowHeight: number): number {
  if (typeof point === "number") return point;
  const percent = Number.parseFloat(point);
  return Number.isFinite(percent) ? (windowHeight * percent) / 100 : windowHeight * 0.6;
}

/**
 * Panel geometry for a host of `height` whose top `topInset` points are covered (status
 * bar, notch). The panel is as tall as the highest snap point and never reaches into the
 * inset; it rests pushed down `restOffset` so only the lowest snap point shows.
 */
export function sheetGeometry(snapPoints: SnapPoint[], height: number, topInset: number) {
  const ceiling = height - topInset - 8;
  const snaps = snapPoints
    .map((point) => Math.min(resolveSnapPoint(point, height), ceiling))
    .sort((a, b) => a - b);
  const panelHeight = snaps[snaps.length - 1] ?? height * 0.6;
  const offsets = snaps.map((snap) => panelHeight - snap).sort((a, b) => b - a);
  return { ceiling, panelHeight, offsets, restOffset: offsets[0] ?? 0 };
}

/**
 * How much of the panel sits below the screen while it rests at its lowest snap point.
 * Scroll content needs this much extra room at its end, or its last rows stay off screen
 * until the sheet is dragged up.
 */
export function restingOffset(
  snapPoints: SnapPoint[],
  height: number,
  topInset: number,
): number {
  return sheetGeometry(snapPoints, height, topInset).restOffset;
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
  /** Actions pinned to the visible bottom of the sheet at every snap point. */
  footer?: ReactNode;
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
  footer,
  children,
  testID,
}: SheetSurfaceProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const keyboard = useReanimatedKeyboardAnimation();

  // Size against the host, not the window: a host shorter than the screen (a tab
  // layout, the storybook bar) would push a window-sized panel over the status bar.
  // Only the part of the top inset the host covers still has to be left free.
  const frame = useRef<ViewInstance>(null);
  const [host, setHost] = useState<{ top: number; height: number } | null>(null);
  const available = host?.height ?? windowHeight;
  const topInset = Math.max(0, insets.top - (host?.top ?? 0));
  const measureHost = () =>
    frame.current?.measureInWindow((_x, top, _width, height) => {
      if (height > 0) setHost({ top, height });
    });

  const { ceiling, panelHeight, offsets, restOffset } = sheetGeometry(
    snapPoints,
    available,
    topInset,
  );
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

  // The panel is as tall as the highest snap point and rests pushed down, so a footer laid
  // out at its bottom would sit off screen. It rises by the same amount the panel is
  // pushed down (up to the resting offset), and sinks with the panel while it closes.
  const footerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -Math.min(translateY.get(), restOffset) }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [restOffset, hiddenOffset], [1, 0], "clamp"),
  }));

  return (
    <View
      onLayout={measureHost}
      pointerEvents={visible ? "box-none" : "none"}
      ref={frame}
      style={StyleSheet.absoluteFill}
    >
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
        <KeyboardToolbar.Group style={styles.content}>
          <RestingOffsetContext value={restOffset}>{children}</RestingOffsetContext>
        </KeyboardToolbar.Group>
        {footer ? (
          <Animated.View style={[{ backgroundColor: theme.bg.card }, footerStyle]}>
            {footer}
            {/* Covers the strip under the risen footer (the bottom safe area), where the
                content behind it would otherwise show. The panel clips it. */}
            <View
              pointerEvents="none"
              style={[
                styles.footerSkirt,
                { backgroundColor: theme.bg.card, height: available },
              ]}
            />
          </Animated.View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: SCRIM },
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
  footerSkirt: { position: "absolute", left: 0, right: 0, top: "100%" },
  handleArea: { paddingTop: 8 },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, marginBottom: 8 },
});
