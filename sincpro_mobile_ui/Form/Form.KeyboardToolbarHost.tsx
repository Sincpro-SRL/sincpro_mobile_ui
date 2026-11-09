import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewInstance,
} from "react-native";
import { KeyboardToolbar, type KeyboardToolbarProps } from "react-native-keyboard-controller";

type ToolbarButtonComponent = NonNullable<KeyboardToolbarProps["button"]>;

/** keyboard-controller ships English labels; the app speaks Spanish. */
const LABELS: Record<string, { label: string; hint: string }> = {
  Previous: { label: "Campo anterior", hint: "Mueve el foco al campo anterior" },
  Next: { label: "Campo siguiente", hint: "Mueve el foco al campo siguiente" },
  Done: { label: "Ocultar teclado", hint: "Cierra el teclado" },
};

const ToolbarButton: ToolbarButtonComponent = ({
  children,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}) => {
  const copy = LABELS[accessibilityLabel];
  return (
    <Pressable
      accessibilityHint={copy?.hint}
      accessibilityLabel={copy?.label ?? accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, style]}
      testID={testID}
    >
      {children}
    </Pressable>
  );
};

/** keyboard-controller draws its toolbar at this height (KEYBOARD_TOOLBAR_HEIGHT). */
const TOOLBAR_HEIGHT = 42;

let inset = 0;
const listeners = new Set<() => void>();

function publish(next: number) {
  if (inset === next) return;
  inset = next;
  for (const listener of [...listeners]) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readInset() {
  return inset;
}

/** Space the global toolbar takes above the keyboard; 0 when it is off. */
export function useKeyboardToolbarInset(): number {
  return useSyncExternalStore(subscribe, readInset, readInset);
}

export interface KeyboardToolbarHostProps {
  doneLabel?: string;
  /** iOS convention: an accessory bar with previous / next / done. */
  ios?: boolean;
  /** Android convention is the IME action key; the bar is opt-in. */
  android?: boolean;
}

/**
 * The only keyboard toolbar of the app. Mount it once inside KeyboardProvider.
 * Each KeyboardForm and each sheet is a group, so previous / next stay inside it.
 */
export default function KeyboardToolbarHost({
  doneLabel = "Listo",
  ios = true,
  android = false,
}: KeyboardToolbarHostProps) {
  const theme = useTheme();
  const enabled = Platform.OS === "ios" ? ios : Platform.OS === "android" ? android : false;

  const { height: windowHeight } = useWindowDimensions();
  const frame = useRef<ViewInstance>(null);
  const [gap, setGap] = useState(0);
  const measureGap = () =>
    frame.current?.measureInWindow((_x, top, _width, height) =>
      setGap(Math.max(0, windowHeight - top - height)),
    );

  useLayoutEffect(() => {
    publish(enabled ? TOOLBAR_HEIGHT : 0);
    return () => publish(0);
  }, [enabled]);

  if (!enabled) return null;
  const colors = {
    primary: theme.text.accent,
    disabled: theme.text.disabled,
    background: theme.bg.card,
    ripple: theme.bg.muted,
  };
  return (
    // The toolbar sits on the keyboard measured from its container's bottom. A host that
    // does not reach the bottom of the screen (tabs, a layout) would leave it floating that
    // gap above the keyboard, so the gap is measured and given back.
    <View
      onLayout={measureGap}
      pointerEvents="box-none"
      ref={frame}
      style={StyleSheet.absoluteFill}
    >
      <KeyboardToolbar
        button={ToolbarButton}
        doneText={doneLabel}
        offset={{ opened: gap }}
        theme={{ light: colors, dark: colors }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 44, minHeight: 42, alignItems: "center", justifyContent: "center" },
});
