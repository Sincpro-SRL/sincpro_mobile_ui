import type { IconName } from "@sincpro/mobile-ui/Display";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { theme } from "@sincpro/mobile-ui/theme";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import type { AccessibilityProps } from "react-native";
import { ActivityIndicator, TouchableOpacity } from "react-native";

const iconButton = tv({
  base: "rounded-lg items-center justify-center",
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-bg-card border border-primary",
      tertiary: "bg-accent",
      ghost: "bg-transparent",
    },
    size: {
      small: "w-8 h-8",
      medium: "w-10 h-10",
      large: "w-12 h-12",
    },
    rounded: {
      true: "rounded-full",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "ghost",
    size: "medium",
    rounded: false,
    disabled: false,
  },
});

export interface IconButtonProps extends VariantProps<typeof iconButton>, AccessibilityProps {
  icon: IconName;
  onPress: () => void;
  loading?: boolean;
  iconColor?: string;
  className?: string;
  testID?: string;
}

function IconButton({
  icon,
  onPress,
  variant = "ghost",
  size = "medium",
  loading = false,
  disabled = false,
  rounded = false,
  iconColor,
  className,
  testID,
  accessibilityState,
  ...accessibilityProps
}: IconButtonProps) {
  const resolvedColor = iconColor ?? theme.text.accent;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={iconButton({ variant, size, rounded, disabled, className })}
      disabled={disabled || loading}
      onPress={onPress}
      {...accessibilityProps}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        disabled: disabled || loading,
        busy: loading,
      }}
      style={{ minHeight: 48, minWidth: 48 }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={resolvedColor} size="small" />
      ) : (
        <Icon color={resolvedColor} name={icon} size={24} />
      )}
    </TouchableOpacity>
  );
}

export default IconButton;
