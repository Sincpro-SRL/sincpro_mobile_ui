/* eslint-disable react-hooks/refs */
// This file uses the canonical RN patterns: useRef(new Animated.Value()).current and PanResponder
// created inside useState. Those hooks rules warn — they're not bugs here. Documented at the
// eslint config level (see eslint.config.js:30-33).

import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { themeToVars, useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { vars } from "nativewind";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Modal, PanResponder, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * @deprecated A provider is no longer required. `SheetProvider` is a no-op passthrough
 * kept to avoid breaking prior wiring. Remove it when you can.
 */
export function SheetProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  /** Max sheet height (fraction of the screen). Default 0.9. */
  maxHeightRatio?: number;
  /** Allow closing by tapping the dim backdrop. Default `false` (handle/button only). */
  dismissOnBackdrop?: boolean;
  /** Show a visible close button in the sheet header. */
  showCloseButton?: boolean;
  /** Increase interactive targets to 48 points. */
  accessibleSizing?: boolean;
  testID?: string;
}

/**
 * Bottom sheet on RN's native `Modal`: bottom-anchored, dim backdrop, handle with
 * **swipe-down to close** (handle only). By default it does NOT close on backdrop tap
 * (`dismissOnBackdrop`). No provider or native deps. Import via subpath `Dialog/Sheet`.
 */
function Sheet({
  visible,
  onClose,
  children,
  title,
  maxHeightRatio = 0.9,
  dismissOnBackdrop = false,
  showCloseButton = false,
  accessibleSizing = false,
  testID,
}: SheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(800)).current;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }).start();
    } else {
      translateY.setValue(800);
    }
  }, [visible, translateY]);

  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 2,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: 800,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onCloseRef.current());
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  );

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end" testID={testID}>
        {/* Dim backdrop: does NOT close on tap (unless dismissOnBackdrop) */}
        <View
          className="absolute inset-0 bg-black/50"
          onResponderRelease={dismissOnBackdrop ? onClose : undefined}
          onStartShouldSetResponder={() => dismissOnBackdrop}
        />
        <Animated.View
          accessibilityViewIsModal
          className="rounded-t-3xl"
          importantForAccessibility="yes"
          onAccessibilityEscape={onClose}
          style={[
            vars(themeToVars(theme)),
            {
              backgroundColor: theme.bg.card,
              paddingBottom: insets.bottom + 12,
              maxHeight: `${Math.round(maxHeightRatio * 100)}%`,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Drag zone: ONLY the top handle */}
          <View
            accessibilityElementsHidden
            className="items-center pt-3 pb-2"
            {...pan.panHandlers}
          >
            <View className="w-12 h-1.5 rounded-full bg-border-strong" />
          </View>
          {title || showCloseButton ? (
            <View className="flex-row items-center px-4 pb-1">
              {title ? (
                <Typography.Text
                  accessibilityRole="header"
                  className="flex-1 text-text-primary"
                  semibold
                  variant="subtitle"
                >
                  {title}
                </Typography.Text>
              ) : null}
              {showCloseButton ? (
                <Pressable
                  accessibilityLabel="Cerrar"
                  accessibilityRole="button"
                  className="items-center justify-center rounded-lg"
                  hitSlop={8}
                  onPress={onClose}
                  style={accessibleSizing ? { minWidth: 48, minHeight: 48 } : undefined}
                >
                  <Typography.Text className="text-text-accent" variant="bodySmall">
                    Cerrar
                  </Typography.Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4 }}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default Sheet;
