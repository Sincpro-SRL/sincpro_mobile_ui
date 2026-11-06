import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { theme } from "@sincpro/mobile-ui/theme";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type React from "react";
import { FC } from "react";
import type { AccessibilityProps } from "react-native";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

// ============================================================================
// STYLE VARIANTS
// ============================================================================

const button = tv({
  base: "rounded-md items-center justify-center flex-row min-h-[44px]",
  variants: {
    variant: {
      primary: "bg-accent",
      accent: "bg-transparent",
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
    {
      variant: "primary",
      disabled: true,
      className: "text-text-on-accent",
    },
    {
      variant: "accent",
      disabled: true,
      className: "text-text-accent",
    },
    {
      variant: "transparent",
      disabled: true,
      className: "text-text-inverse/70",
    },
    {
      variant: ["secondary", "outline", "link"],
      disabled: true,
      className: "text-text-secondary",
    },
    {
      variant: "outlineDanger",
      disabled: true,
      className: "text-danger/50",
    },
    {
      variant: "outlineBlack",
      disabled: true,
      className: "text-text-primary/50",
    },
    {
      variant: "flat",
      disabled: true,
      className: "text-text-primary/50",
    },
  ],
  defaultVariants: {
    variant: "primary",
    disabled: false,
  },
});

// ============================================================================
// COLOR & SIZE MAPS (Dynamic with theme)
// ============================================================================

function getLoadingColorDynamic(variant: string): string {
  const map: Record<string, string> = {
    primary: theme.text.onAccent,
    accent: theme.text.accent,
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

function getIconColorDynamic(variant: string, disabled: boolean): string {
  if (disabled) {
    const disabledMap: Record<string, string> = {
      primary: theme.text.onAccent + "70",
      accent: theme.text.accent + "70",
      secondary: theme.icon.disabled,
      outline: theme.icon.disabled,
      outlineDanger: theme.danger + "7f",
      outlineBlack: theme.text.primary + "7f",
      flat: theme.text.primary + "7f",
      link: theme.icon.disabled,
      transparent: theme.icon.inverse + "70",
    };
    return disabledMap[variant] ?? theme.icon.disabled;
  }

  const enabledMap: Record<string, string> = {
    primary: theme.text.onAccent,
    accent: theme.text.accent,
    secondary: theme.text.primary,
    outline: theme.text.accent,
    outlineDanger: theme.danger,
    outlineBlack: theme.text.primary,
    flat: theme.text.primary,
    link: theme.text.accent,
    transparent: theme.icon.inverse,
  };
  return enabledMap[variant] ?? theme.icon.inverse;
}

const iconSizeMap = {
  small: 16,
  medium: 20,
  large: 28,
} as const;

const textVariantMap = {
  small: "buttonSmall" as const,
  medium: "button" as const,
  large: "buttonLarge" as const,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getLoadingColor(variant: string): string {
  return getLoadingColorDynamic(variant);
}

function getIconColor(variant: string, disabled: boolean): string {
  return getIconColorDynamic(variant, disabled);
}

function getIconSize(size: string): number {
  return iconSizeMap[size as keyof typeof iconSizeMap] ?? 20;
}

function getTextVariant(size: string): "buttonSmall" | "button" | "buttonLarge" {
  return textVariantMap[size as keyof typeof textVariantMap] ?? "button";
}

// ============================================================================
// BASE BUTTON COMPONENT (NO Dialog dependency)
// ============================================================================

export interface BaseButtonProps extends VariantProps<typeof button>, AccessibilityProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  accessibleSizing?: boolean;
  testID?: string;
}

export const BaseButton: FC<BaseButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className,
  icon,
  accessibleSizing = false,
  testID,
  accessibilityLabel,
  accessibilityState,
  ...accessibilityProps
}) => {
  const textColorClass = textColor({
    variant: (variant as any) ?? "primary",
    disabled,
  });
  const loadingColorValue = getLoadingColor((variant as any) ?? "primary");
  const textVariantValue = getTextVariant((size as any) ?? "medium");

  if (variant === "link") {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className={className}
        disabled={disabled || loading}
        onPress={onPress}
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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={button({ variant, size, disabled, className })}
      disabled={disabled || loading}
      onPress={onPress}
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
      {icon && !loading && <View className="mr-2">{icon}</View>}
      {loading ? (
        <ActivityIndicator color={loadingColorValue} size="small" />
      ) : (
        <Typography.Text
          className={textColorClass}
          semibold={variant === "primary"}
          variant={textVariantValue}
        >
          {title}
        </Typography.Text>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// BASE BUTTON ICON COMPONENT (NO Dialog dependency)
// ============================================================================

export interface BaseButtonIconProps
  extends VariantProps<typeof buttonIcon>, AccessibilityProps {
  icon: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  accessibleSizing?: boolean;
  testID?: string;
}

export const BaseButtonIcon: FC<BaseButtonIconProps> = ({
  icon,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className,
  accessibleSizing = false,
  testID,
  accessibilityState,
  ...accessibilityProps
}) => {
  const iconColorValue = getIconColor((variant as any) ?? "primary", disabled);
  const loadingColorValue = getLoadingColor((variant as any) ?? "primary");
  const iconSizeValue = getIconSize((size as any) ?? "medium");

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={buttonIcon({ variant, size, disabled, className })}
      disabled={disabled || loading}
      onPress={onPress}
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

// ============================================================================
// COMPOUND COMPONENT
// ============================================================================

const BaseButtonWithIcon = Object.assign(BaseButton, { Icon: BaseButtonIcon });

export default BaseButtonWithIcon;
