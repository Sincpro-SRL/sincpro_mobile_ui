import type { IconName } from "@sincpro/mobile-ui/Display";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
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

type IconButtonVariant = NonNullable<VariantProps<typeof iconButton>["variant"]>;
type IconButtonSize = NonNullable<VariantProps<typeof iconButton>["size"]>;

/** The visible button keeps its size; the touch target always reaches 48 points. */
const TOUCH_SLOP: Record<IconButtonSize, number> = { small: 8, medium: 4, large: 0 };

function useIconColor(variant: IconButtonVariant) {
  const theme = useTheme();
  const colors: Record<IconButtonVariant, string> = {
    primary: theme.text.onPrimary,
    secondary: theme.text.accent,
    tertiary: theme.text.onAccent,
    ghost: theme.text.accent,
  };
  return colors[variant];
}

export interface IconButtonProps extends VariantProps<typeof iconButton>, AccessibilityProps {
  icon: IconName;
  onPress: () => void;
  loading?: boolean;
  /** Overrides the ink of the variant, e.g. an inverse icon over a brand header. */
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
  const variantColor = useIconColor(variant ?? "ghost");
  const resolvedColor = iconColor ?? variantColor;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={iconButton({ variant, size, rounded, disabled, className })}
      disabled={disabled || loading}
      hitSlop={TOUCH_SLOP[size ?? "medium"]}
      onPress={onPress}
      {...accessibilityProps}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        disabled: disabled || loading,
        busy: loading,
      }}
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
