import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ComponentRef, useEffect, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import {
  FocusedInputEvents,
  KeyboardController,
  KeyboardStickyView,
  useKeyboardState,
} from "react-native-keyboard-controller";

export interface KeyboardToolbarProps {
  previousLabel?: string;
  nextLabel?: string;
  doneLabel?: string;
  onHeightChange?: (height: number) => void;
}

export default function KeyboardToolbar({
  previousLabel = "Campo anterior",
  nextLabel = "Campo siguiente",
  doneLabel = "Ocultar teclado",
  onHeightChange,
}: KeyboardToolbarProps) {
  const theme = useTheme();
  const frame = useRef<ComponentRef<typeof View>>(null);
  const { height: windowHeight } = useWindowDimensions();
  const [bottomGap, setBottomGap] = useState(0);
  const [height, setHeight] = useState(48);
  const [inputs, setInputs] = useState({ current: 0, count: 0 });
  const isVisible = useKeyboardState((state) => state.isVisible);
  useEffect(() => {
    const subscription = FocusedInputEvents.addListener("focusDidSet", setInputs);
    return () => subscription.remove();
  }, []);
  const previousDisabled = inputs.current === 0;
  const nextDisabled = inputs.current >= inputs.count - 1;
  return (
    <View
      accessibilityElementsHidden={!isVisible}
      importantForAccessibility={isVisible ? "auto" : "no-hide-descendants"}
      onLayout={() => {
        frame.current?.measureInWindow((_x, y, _width, frameHeight) =>
          setBottomGap(Math.max(0, windowHeight - y - frameHeight)),
        );
      }}
      pointerEvents="box-none"
      ref={frame}
      style={StyleSheet.absoluteFill}
    >
      <KeyboardStickyView
        offset={{ closed: height, opened: bottomGap - 8 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <View
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            setHeight(nextHeight);
            onHeightChange?.(nextHeight);
          }}
          style={{
            minHeight: 48,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 8,
            backgroundColor: theme.bg.card,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.border.light,
          }}
          testID="keyboard-toolbar"
        >
          <View style={{ flexDirection: "row" }}>
            <Pressable
              accessibilityLabel={previousLabel}
              disabled={previousDisabled}
              hitSlop={0}
              onPress={() => KeyboardController.setFocusTo("prev")}
              style={styles.arrow}
            >
              <Icon
                color={previousDisabled ? theme.text.tertiary : theme.text.accent}
                name="chevron-up"
                size={24}
              />
            </Pressable>
            <Pressable
              accessibilityLabel={nextLabel}
              disabled={nextDisabled}
              hitSlop={0}
              onPress={() => KeyboardController.setFocusTo("next")}
              style={styles.arrow}
            >
              <Icon
                color={nextDisabled ? theme.text.tertiary : theme.text.accent}
                name="chevron-down"
                size={24}
              />
            </Pressable>
          </View>
          <Pressable
            accessibilityLabel={doneLabel}
            hitSlop={0}
            onPress={() => KeyboardController.dismiss()}
            style={{
              minWidth: 48,
              minHeight: 48,
              flexShrink: 1,
              justifyContent: "center",
              padding: 8,
            }}
          >
            <Typography.Text className="text-text-accent" semibold variant="bodyLarge">
              {doneLabel}
            </Typography.Text>
          </Pressable>
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
