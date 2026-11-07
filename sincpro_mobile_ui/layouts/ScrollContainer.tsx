import ScreenStatusBar from "@sincpro/mobile-ui/layouts/ScreenStatusBar";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScrollContainerProps = {
  children: ReactNode;
  contentContainerStyle?: object;
  className?: string;
  barStyle?: "light-content" | "dark-content";
};

function ScrollContainer({
  children,
  contentContainerStyle = {},
  className,
  barStyle,
}: ScrollContainerProps) {
  const theme = useTheme();

  return (
    <SafeAreaView className={cn("flex-1 bg-bg-card", className)}>
      <ScreenStatusBar backgroundColor={theme.bg.card} barStyle={barStyle} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={[{ flexGrow: 1, padding: 16 }, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ScrollContainer;
