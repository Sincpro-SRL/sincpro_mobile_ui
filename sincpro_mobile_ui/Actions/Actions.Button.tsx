import { useConfirmationContext } from "@sincpro/mobile-ui/Dialog/Confirmation.context";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { theme } from "@sincpro/mobile-ui/theme";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type React from "react";
import { FC, useCallback } from "react";
import type { AccessibilityProps } from "react-native";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

// ─── Style variants ───────────────────────────────────────────────────────────

const button = tv({
  base: "rounded-md items-center justify-center flex-row min-h-[44px]",
  variants: {
    variant: {
      primary: "bg-accent",
      accent: "bg-transparent",
      cta: "bg-accent",
      secondary: "bg-bg-muted border border-border-strong",
      outline: "bg-transparent border border-primary",
      outlineDanger: "bg-transparent border border-danger",
      outlineBlack: "bg-transparent border border-border-strong",
      flat: "bg-text-primary/10",
      link: "bg-transparent min-h-0",
      transparent: "bg-transparent border border-border-light",
    },
    size: {
      small: "py-1.5 px-3 min-h-[36px]",
      medium: "py-2.5 px-4 min-h-[44px]",
      large: "py-3 px-5 min-h-[48px]",
    },
    disabled: {
      true: "opacity-70",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

const buttonIcon = tv({
  base: "rounded-md items-center justify-center aspect-square",
  variants: {
    variant: {
      primary: "bg-accent",
      accent: "bg-transparent",
      cta: "bg-accent",
      secondary: "bg-bg-muted border border-border-strong",
      outline: "bg-transparent border border-primary",
      outlineDanger: "bg-transparent border border-danger",
      outlineBlack: "bg-transparent border border-border-strong",
      flat: "bg-text-primary/10",
      link: "bg-transparent",
      transparent: "bg-transparent border border-border-light",
    },
    size: {
      small: "w-9 h-9",
      medium: "w-11 h-11",
      large: "w-[52px] h-[52px]",
    },
    disabled: {
      true: "opacity-70",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

const textColor = tv({
  variants: {
    variant: {
      primary: "text-text-on-accent",
      accent: "text-text-accent",
      cta: "text-text-on-accent",
      secondary: "text-text-primary",
      outline: "text-text-accent",
      outlineDanger: "text-danger",
      outlineBlack: "text-text-primary",
      flat: "text-text-primary",
      link: "text-text-accent",
      transparent: "text-text-inverse",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  compoundVariants: [
    { variant: "primary", disabled: true, className: "text-text-on-accent" },
    { variant: "accent", disabled: true, className: "text-text-accent" },
    { variant: "cta", disabled: true, className: "text-text-on-accent" },
    { variant: "transparent", disabled: true, className: "text-text-inverse/70" },
    {
      variant: ["secondary", "outline", "link"],
      disabled: true,
      className: "text-text-secondary",
    },
    { variant: "outlineDanger", disabled: true, className: "text-danger/50" },
    { variant: "outlineBlack", disabled: true, className: "text-text-primary/50" },
    { variant: "flat", disabled: true, className: "text-text-primary/50" },
  ],
  defaultVariants: { variant: "primary", disabled: false },
});

// ─── Color / size helpers ─────────────────────────────────────────────────────

function getLoadingColor(variant: string): string {
  const map: Record<string, string> = {
    primary: theme.text.onAccent,
    accent: theme.text.accent,
    cta: theme.text.onAccent,
    secondary: theme.text.primary,
    outline: theme.text.accent,
    outlineDanger: theme.danger,
    outlineBlack: theme.text.primary,
    flat: theme.text.primary,
    link: theme.text.accent,
    transparent: theme.text.inverse,
  };
  return map[variant] ?? theme.text.inverse;
}

function getIconColor(variant: string, disabled: boolean): string {
  if (disabled) {
    const map: Record<string, string> = {
      primary: theme.text.onAccent + "70",
      accent: theme.text.accent + "70",
      cta: theme.text.onAccent + "70",
      secondary: theme.text.disabled,
      outline: theme.icon.disabled,
      outlineDanger: theme.danger + "7f",
      outlineBlack: theme.text.primary + "7f",
      flat: theme.text.primary + "7f",
      link: theme.icon.disabled,
      transparent: theme.icon.inverse + "70",
    };
    return map[variant] ?? theme.icon.disabled;
  }
  const map: Record<string, string> = {
    primary: theme.text.onAccent,
    accent: theme.text.accent,
    cta: theme.text.onAccent,
    secondary: theme.text.primary,
    outline: theme.text.accent,
    outlineDanger: theme.danger,
    outlineBlack: theme.text.primary,
    flat: theme.text.primary,
    link: theme.text.accent,
    transparent: theme.icon.inverse,
  };
  return map[variant] ?? theme.icon.inverse;
}

const iconSizeMap = { small: 16, medium: 20, large: 28 } as const;
const textVariantMap = {
  small: "buttonSmall" as const,
  medium: "button" as const,
  large: "buttonLarge" as const,
};

// ─── Button ───────────────────────────────────────────────────────────────────

export interface ButtonProps extends VariantProps<typeof button>, AccessibilityProps {
  title: string;
  onPress?: () => void;
  confirm?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  testID?: string;
  accessibleSizing?: boolean;
}

const Button: FC<ButtonProps> = ({
  title,
  onPress,
  confirm,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className,
  icon,
  testID,
  accessibleSizing = false,
  accessibilityLabel,
  accessibilityState,
  ...accessibilityProps
}) => {
  const { show, hide } = useConfirmationContext();
  const textColorClass = textColor({ variant: variant as any, disabled });
  const loadingColorValue = getLoadingColor(variant as any);
  const textVariantValue = textVariantMap[size as keyof typeof textVariantMap] ?? "button";

  const handlePress = useCallback(() => {
    if (confirm && onPress) {
      show({
        title: "Confirmar acción",
        message: confirm,
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        onConfirm: () => {
          hide();
          onPress();
        },
        onCancel: () => hide(),
      });
    } else if (onPress) {
      onPress();
    }
  }, [onPress, confirm, show, hide]);

  if (variant === "link") {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className={className}
        disabled={disabled || loading}
        onPress={handlePress}
        {...accessibilityProps}
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityRole="button"
        accessibilityState={{
          ...accessibilityState,
          disabled: disabled || loading,
          busy: loading,
        }}
        style={
          accessibleSizing
            ? { minHeight: 48, minWidth: 48, justifyContent: "center" }
            : undefined
        }
        testID={testID}
      >
        {loading ? (
          <ActivityIndicator color={loadingColorValue} size="small" />
        ) : (
          <Typography.Text className={textColorClass} variant={textVariantValue}>
            {title}
          </Typography.Text>
        )}
      </TouchableOpacity>
    );
  }

  const emphasize = variant === "primary" || variant === "cta";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={button({ variant, size, disabled, className })}
      disabled={disabled || loading}
      onPress={handlePress}
      {...accessibilityProps}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        disabled: disabled || loading,
        busy: loading,
      }}
      style={accessibleSizing ? { minHeight: 48, minWidth: 48 } : undefined}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={loadingColorValue} size="small" />
      ) : (
        <>
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Typography.Text
            allowFontScaling={accessibleSizing}
            className={textColorClass}
            ellipsizeMode="tail"
            numberOfLines={accessibleSizing ? undefined : 1}
            semibold={emphasize}
            variant={textVariantValue}
          >
            {title}
          </Typography.Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// ─── ButtonIcon ───────────────────────────────────────────────────────────────

export interface ButtonIconProps extends VariantProps<typeof buttonIcon>, AccessibilityProps {
  icon: string;
  onPress?: () => void;
  confirm?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  testID?: string;
  accessibleSizing?: boolean;
}

const ButtonIcon: FC<ButtonIconProps> = ({
  icon,
  onPress,
  confirm,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className,
  testID,
  accessibleSizing = false,
  accessibilityState,
  ...accessibilityProps
}) => {
  const { show, hide } = useConfirmationContext();
  const iconColorValue = getIconColor(variant as any, disabled);
  const iconSizeValue = iconSizeMap[size as keyof typeof iconSizeMap] ?? 20;
  const loadingColorValue = getLoadingColor(variant as any);

  const handlePress = useCallback(() => {
    if (confirm && onPress) {
      show({
        title: "Confirmar acción",
        message: confirm,
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        onConfirm: () => {
          hide();
          onPress();
        },
        onCancel: () => hide(),
      });
    } else if (onPress) {
      onPress();
    }
  }, [onPress, confirm, show, hide]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={buttonIcon({ variant, size, disabled, className })}
      disabled={disabled || loading}
      onPress={handlePress}
      {...accessibilityProps}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        disabled: disabled || loading,
        busy: loading,
      }}
      style={accessibleSizing ? { minHeight: 48, minWidth: 48 } : undefined}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={loadingColorValue} size="small" />
      ) : (
        <Icon color={iconColorValue} name={icon} size={iconSizeValue} />
      )}
    </TouchableOpacity>
  );
};

const ButtonWithIcon = Object.assign(Button, { Icon: ButtonIcon });
export default ButtonWithIcon;
