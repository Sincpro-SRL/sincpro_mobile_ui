import Spinner, { type SpinnerVariant } from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import type React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  variant?: SpinnerVariant;
  style?: StyleProp<ViewStyle>;
  className?: string;
  animated?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

function LoadingState({
  message = "Cargando…",
  size = "small",
  variant = "spinner",
  style = {},
  className,
  animated,
  accessibilityLabel,
  testID,
}: LoadingStateProps) {
  return (
    <View className={cn("flex-1 justify-center items-center", className)} style={style}>
      <Spinner
        accessibilityLabel={accessibilityLabel}
        animated={animated}
        className="mb-5"
        size={size}
        testID={testID}
        text={message}
        variant={variant}
      />
    </View>
  );
}

export default LoadingState;
