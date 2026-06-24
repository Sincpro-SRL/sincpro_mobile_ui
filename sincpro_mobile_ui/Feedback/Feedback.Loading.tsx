import Spinner, { type SpinnerVariant } from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import type React from "react";
import { View } from "react-native";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  variant?: SpinnerVariant;
  style?: object;
  className?: string;
}

function LoadingState({
  message = "Cargando…",
  size = "small",
  variant = "spinner",
  style = {},
  className,
}: LoadingStateProps) {
  return (
    <View className={cn("flex-1 justify-center items-center", className)} style={style}>
      <Spinner className="mb-5" size={size} text={message} variant={variant} />
    </View>
  );
}

export default LoadingState;
