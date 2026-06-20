import { ComponentType, ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

import { theme } from "../theme";
import { tv, type VariantProps } from "../theme/tw";
import { Typography } from "../Typography";

const menuButton = tv({
  slots: {
    container: "flex-row items-center py-3 px-4 bg-bg-card",
    iconContainer: "mr-3 w-8 h-8 rounded-lg items-center justify-center",
    content: "flex-1",
    label: "",
    rightContainer: "ml-2",
    chevronContainer: "ml-2 w-5 h-5 items-center justify-center",
    chevron: "text-xl",
  },
  variants: {
    variant: {
      default: {
        iconContainer: "bg-bg-hover",
        label: "text-text-primary",
      },
      danger: {
        iconContainer: "bg-danger-light",
        label: "text-danger",
      },
    },
    showDivider: {
      true: {
        container: "border-b border-border-default",
      },
    },
    disabled: {
      true: {
        container: "opacity-40",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    showDivider: true,
    disabled: false,
  },
});

interface MenuButtonProps extends VariantProps<typeof menuButton> {
  icon?: ComponentType<{ size?: number; color?: string }>;
  label: string;
  description?: string;
  onPress?: () => void;
  rightComponent?: ReactNode;
  className?: string;
}

function MenuButton({
  icon: Icon,
  label,
  description,
  onPress,
  rightComponent,
  showDivider = true,
  variant = "default",
  disabled = false,
  className,
}: MenuButtonProps) {
  const styles = menuButton({ variant, showDivider, disabled });
  const isDanger = variant === "danger";
  const isClickable = !!onPress && !disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className={styles.container({ className })}
      disabled={disabled || !onPress}
      onPress={onPress}
    >
      {Icon && (
        <View className={styles.iconContainer()}>
          <Icon color={isDanger ? theme.danger : theme.text.secondary} size={20} />
        </View>
      )}
      <View className={styles.content()}>
        <Typography.Text className={styles.label()} variant="body">
          {label}
        </Typography.Text>
        {description && (
          <Typography.Text className="text-text-secondary" variant="bodySmall">
            {description}
          </Typography.Text>
        )}
      </View>
      {rightComponent && <View className={styles.rightContainer()}>{rightComponent}</View>}
      {!rightComponent && isClickable && (
        <View className={styles.chevronContainer()}>
          <Typography.Text className={styles.chevron()}>›</Typography.Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default MenuButton;
