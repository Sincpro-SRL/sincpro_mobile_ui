import { cn } from "@sincpro/mobile-ui/theme/tw";
import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

export interface AspectRatioProps extends ViewProps {
  ratio?: number;
  className?: string;
  children?: ReactNode;
}

function AspectRatio({ ratio = 1, className, style, children, ...rest }: AspectRatioProps) {
  return (
    <View className={cn(className)} style={[{ aspectRatio: ratio }, style]} {...rest}>
      {children}
    </View>
  );
}

export default AspectRatio;
export { AspectRatio };
