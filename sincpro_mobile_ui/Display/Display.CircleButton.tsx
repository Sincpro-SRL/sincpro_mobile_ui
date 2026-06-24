import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { IconType } from "@sincpro/mobile-ui/utils/icon";
import { ComponentType } from "react";
import { View } from "react-native";
import { tv } from "tailwind-variants";

export interface CircleButtonProps {
  iconType?: IconType;
  size?: "sm" | "md" | "lg";
  color?: string;
  variant?: "primary" | "secondary" | "accent" | "success" | "danger" | "warning";
  className?: string;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
}

const circleButtonVariants = tv({
  base: "rounded-full items-center justify-center shadow-sm",
  variants: {
    size: {
      sm: "w-12 h-12",
      md: "w-15 h-15",
      lg: "w-20 h-20",
    },
    variant: {
      primary: "bg-primary",
      secondary: "bg-secondary",
      accent: "bg-accent",
      success: "bg-success",
      danger: "bg-danger",
      warning: "bg-warning",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "accent",
  },
});

const SIZE_MAP = {
  sm: { icon: 24 },
  md: { icon: 30 },
  lg: { icon: 40 },
};

export function CircleButton({
  iconType = "ionicons",
  size = "md",
  color,
  variant = "accent",
  className,
  customIcon,
}: CircleButtonProps) {
  const theme = useTheme();
  const iconColor = color ?? theme.text.inverse;

  return (
    <View className={cn(circleButtonVariants({ size, variant }), className)}>
      <Icon
        color={iconColor}
        customIcon={customIcon}
        size={SIZE_MAP[size].icon}
        type={iconType}
      />
    </View>
  );
}

export default CircleButton;
