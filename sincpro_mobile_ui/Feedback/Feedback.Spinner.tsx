import type React from "react";
import { ActivityIndicator, View, type ViewStyle } from "react-native";

import { cn } from "../theme/tw";
import { Typography } from "../Typography";

export interface SpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  style?: ViewStyle;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "large",
  color = "#FF7B0A",
  text,
  style,
  className,
}) => {
  return (
    <View className={cn("items-center justify-center", className)} style={style}>
      <ActivityIndicator color={color} size={size} />
      {text && (
        <Typography.Text className="mt-2.5 text-base" variant="body">
          {text}
        </Typography.Text>
      )}
    </View>
  );
};

export default Spinner;
