import Spinner from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import type React from "react";
import { View } from "react-native";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  style?: object;
  className?: string;
}

/**
 * Full-screen centered loading state. Thin layout convenience over `Spinner` (the atom):
 * `Spinner` is the inline indicator (ActivityIndicator + optional text); `LoadingState`
 * is `Spinner` centered with `flex-1` for an empty screen/section. Use `Spinner` directly
 * when you need an inline/footer indicator (e.g. pagination), `LoadingState` for a blank view.
 */
function LoadingState({
  message = "Cargando…",
  size = "small",
  style = {},
  className,
}: LoadingStateProps) {
  return (
    <View className={cn("flex-1 justify-center items-center", className)} style={style}>
      <Spinner className="mb-5" size={size} text={message} />
    </View>
  );
}

export default LoadingState;
