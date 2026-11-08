import { cn } from "@sincpro/mobile-ui/theme/tw";
import React, { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";
import { type Edge, SafeAreaView } from "react-native-safe-area-context";

type ScrollContainerProps = Omit<KeyboardAwareScrollViewProps, "children"> & {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  className?: string;
  edges?: Edge[];
};

function ScrollContainer({
  children,
  contentContainerStyle = {},
  className,
  edges = ["left", "right"],
  bottomOffset = 72,
  style,
  ...props
}: ScrollContainerProps) {
  return (
    <SafeAreaView className={cn("flex-1 bg-bg-card", className)} edges={edges}>
      <KeyboardAwareScrollView
        bottomOffset={bottomOffset}
        contentContainerStyle={[{ flexGrow: 1, padding: 16 }, contentContainerStyle]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={[{ flex: 1 }, style]}
        {...props}
      >
        <View className="flex-1">{children}</View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default ScrollContainer;
