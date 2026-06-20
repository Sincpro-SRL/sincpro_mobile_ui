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

function LoadingState({
  message = "Actualizando lista de órdenes",
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
