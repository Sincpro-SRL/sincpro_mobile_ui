import React, { ComponentType } from "react";
import { View } from "react-native";
import { tv } from "tailwind-variants";

import { Display } from "../Display";
import { IconType } from "../lib/icon";
import { theme } from "../theme";
import { cn } from "../theme/tw";

interface CircleButtonProps {
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
      sm: "w-12 h-12", // 48px
      md: "w-15 h-15", // 60px
      lg: "w-20 h-20", // 80px
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
  sm: { container: 48, icon: 24 },
  md: { container: 60, icon: 30 },
  lg: { container: 80, icon: 40 },
};

export function CircleButton({
  iconType = "ionicons",
  size = "md",
  color = theme.text.inverse,
  variant = "accent",
  className,
  customIcon,
}: CircleButtonProps) {
  const iconSize = SIZE_MAP[size].icon;

  return (
    <View className={cn(circleButtonVariants({ size, variant }), className)}>
      <Display.Icon color={color} customIcon={customIcon} size={iconSize} type={iconType} />
    </View>
  );
}
