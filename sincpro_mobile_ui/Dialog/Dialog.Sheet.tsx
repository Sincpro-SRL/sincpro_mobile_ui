import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useEffect, useRef } from "react";
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
  testID,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible, translateY]);

  const pan = useRef(
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
  ).current;

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View className="flex-1 justify-end" testID={testID}>
        {/* Dim backdrop: does NOT close on tap (unless dismissOnBackdrop) */}
        <View
          className="absolute inset-0 bg-black/50"
          onResponderRelease={dismissOnBackdrop ? onClose : undefined}
          onStartShouldSetResponder={() => dismissOnBackdrop}
        />
        <Animated.View
          className="rounded-t-3xl"
          style={{
            backgroundColor: theme.bg.card,
            paddingBottom: insets.bottom + 12,
            maxHeight: `${Math.round(maxHeightRatio * 100)}%`,
            transform: [{ translateY }],
          }}
        >
          {/* Drag zone: ONLY the top handle */}
          <View className="items-center pt-3 pb-2" {...pan.panHandlers}>
            <View className="w-12 h-1.5 rounded-full bg-border-strong" />
          </View>
          {title ? (
            <Typography.Text
              className="text-text-primary px-4 pb-1"
              semibold
              variant="subtitle"
            >
              {title}
            </Typography.Text>
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
