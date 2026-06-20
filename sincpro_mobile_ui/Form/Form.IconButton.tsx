import { Display } from "@sincpro/mobile-ui/Display";
import { theme } from "@sincpro/mobile-ui/theme";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { IconType } from "@sincpro/mobile-ui/utils/icon";
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

interface IconButtonProps extends VariantProps<typeof iconButton> {
  icon?: string;
  type?: IconType;
  onPress: () => void;
  loading?: boolean;
  iconColor?: string;
  className?: string;
}

function IconButton({
  icon,
  type = "feather",
  onPress,
  variant = "ghost",
  size = "medium",
  loading = false,
  disabled = false,
  rounded = false,
  iconColor,
  className,
}: IconButtonProps) {
  const getLoadingColor = () => {
    switch (variant) {
      case "primary":
      case "tertiary":
        return theme.primary;
      case "secondary":
      case "ghost":
        return theme.primary;
      default:
        return theme.primary;
    }
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    switch (variant) {
      case "primary":
      case "tertiary":
        return theme.primary;
      case "secondary":
        return theme.primary;
      case "ghost":
        return theme.primary;
      default:
        return theme.primary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={iconButton({ variant, size, rounded, disabled, className })}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <Display.Icon color={getIconColor()} name={icon} size={24} type={type} />
      )}
    </TouchableOpacity>
  );
}

export default IconButton;
