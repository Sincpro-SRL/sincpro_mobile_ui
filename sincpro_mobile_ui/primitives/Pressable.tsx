import { cn } from "@sincpro/mobile-ui/theme/tw";
import type { ReactNode } from "react";
import {
  type StyleProp,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from "react-native";

export interface PressableProps extends Omit<TouchableOpacityProps, "style" | "children"> {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

function Pressable({
  className,
  disabled = false,
  hitSlop = 8,
  activeOpacity = 0.7,
  accessibilityRole = "button",
  style,
  children,
  ...rest
}: PressableProps) {
  const isDisabled = !!disabled;
  return (
    <TouchableOpacity
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: isDisabled }}
      activeOpacity={activeOpacity}
      className={cn(isDisabled && "opacity-50", className)}
      disabled={isDisabled}
      hitSlop={hitSlop}
      style={style}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

export default Pressable;
export { Pressable };
