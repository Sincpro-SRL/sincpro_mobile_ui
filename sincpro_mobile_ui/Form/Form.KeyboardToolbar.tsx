import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewInstance,
  type ViewStyle,
} from "react-native";
import {
  FocusedInputEvents,
  KeyboardController,
  KeyboardStickyView,
  useKeyboardState,
} from "react-native-keyboard-controller";

export type KeyboardToolbarAction = "previous" | "next" | "done";

export interface KeyboardToolbarProps {
  previousLabel?: string;
  nextLabel?: string;
  doneLabel?: string;
  showDoneLabel?: boolean;
  onHeightChange?: (height: number) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  actionStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  bottomGapOffset?: number;
  testID?: string;
  renderActionContent?: (
    action: KeyboardToolbarAction,
    state: { label: string; disabled: boolean },
  ) => ReactNode;
}

export default function KeyboardToolbar({
  previousLabel = "Campo anterior",
  nextLabel = "Campo siguiente",
  doneLabel = "Ocultar teclado",
  showDoneLabel = false,
  onHeightChange,
  className,
  style,
  actionStyle,
  labelStyle,
  iconSize = 20,
  bottomGapOffset = 0,
  testID = "keyboard-toolbar",
  renderActionContent,
}: KeyboardToolbarProps) {
  const theme = useTheme();
  const frame = useRef<ViewInstance>(null);
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
  const content = (action: KeyboardToolbarAction, label: string, disabled: boolean) => {
    if (renderActionContent) return renderActionContent(action, { label, disabled });
    if (action === "done" && showDoneLabel)
      return (
        <Typography.Text className="text-text-accent" style={labelStyle} variant="bodySmall">
          {label}
        </Typography.Text>
      );
    return (
      <Icon
        color={disabled ? theme.text.tertiary : theme.text.accent}
        name={action === "previous" ? "collapse" : action === "next" ? "expand" : "check"}
        size={iconSize}
      />
    );
  };
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
        offset={{ closed: height, opened: bottomGap + bottomGapOffset - 8 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <View
          className={className}
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            setHeight(nextHeight);
            onHeightChange?.(nextHeight);
          }}
          style={[
            {
              minHeight: 48,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 8,
              backgroundColor: theme.bg.card,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: theme.border.light,
            },
            style,
          ]}
          testID={testID}
        >
          <View style={{ flexDirection: "row" }}>
            <Pressable
              accessibilityLabel={previousLabel}
              disabled={previousDisabled}
              hitSlop={0}
              onPress={() => KeyboardController.setFocusTo("prev")}
              style={[styles.arrow, actionStyle]}
            >
              {content("previous", previousLabel, previousDisabled)}
            </Pressable>
            <Pressable
              accessibilityLabel={nextLabel}
              disabled={nextDisabled}
              hitSlop={0}
              onPress={() => KeyboardController.setFocusTo("next")}
              style={[styles.arrow, actionStyle]}
            >
              {content("next", nextLabel, nextDisabled)}
            </Pressable>
          </View>
          <Pressable
            accessibilityLabel={doneLabel}
            hitSlop={0}
            onPress={() => KeyboardController.dismiss()}
            style={[
              {
                minWidth: 48,
                minHeight: 48,
                flexShrink: 1,
                justifyContent: "center",
                padding: 8,
              },
              actionStyle,
            ]}
          >
            {content("done", doneLabel, false)}
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
