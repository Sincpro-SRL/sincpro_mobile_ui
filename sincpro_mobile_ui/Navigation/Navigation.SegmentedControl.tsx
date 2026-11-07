import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ComponentType } from "react";
import { type StyleProp, TouchableOpacity, View, type ViewStyle } from "react-native";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
  /** Ionicon name rendered above (or before) the label. */
  icon?: string;
  /** Custom icon component — takes precedence over `icon`. */
  customIcon?: ComponentType<{ size?: number; color?: string }>;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /**
   * Icon layout when options have icons:
   * - `"top"` (default) — icon stacked above the label (taller pill).
   * - `"left"` — icon inline left of the label (compact, single-line).
   */
  iconLayout?: "top" | "left";
  /** Increase each option's target to at least 48 points. */
  accessibleSizing?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  labelTextProps?: Partial<React.ComponentProps<typeof Typography.Text>>;
  className?: string;
  testID?: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  iconLayout = "top",
  accessibleSizing = false,
  disabled = false,
  accessibilityLabel,
  style,
  optionStyle,
  labelTextProps,
  className,
  testID,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const hasIcons = options.some((o) => o.icon || o.customIcon);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      className={cn("flex-row bg-bg-muted rounded-lg p-1 gap-1", className)}
      style={style}
      testID={testID}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const isDisabled = disabled || !!option.disabled;
        const iconColor = selected ? theme.text.primary : theme.text.secondary;
        const hasIcon = !!(option.icon || option.customIcon);
        const inline = hasIcons && iconLayout === "left";
        const baseStyle: ViewStyle = {
          flex: 1,
          minHeight: accessibleSizing ? 48 : undefined,
          flexDirection: inline ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: hasIcon ? 4 : 0,
          paddingVertical: 8,
          paddingHorizontal: 4,
          borderRadius: 8,
          ...(selected ? { backgroundColor: theme.bg.card, ...theme.shadow.sm } : undefined),
          opacity: isDisabled ? 0.5 : 1,
        };

        return (
          <TouchableOpacity
            accessibilityHint={option.accessibilityHint}
            accessibilityLabel={option.accessibilityLabel ?? option.label}
            accessibilityRole="tab"
            accessibilityState={isDisabled ? { selected, disabled: true } : { selected }}
            activeOpacity={0.7}
            disabled={isDisabled || undefined}
            hitSlop={accessibleSizing ? 0 : undefined}
            key={option.value}
            onPress={() => {
              if (!isDisabled) onChange(option.value);
            }}
            style={optionStyle ? [baseStyle, optionStyle] : baseStyle}
          >
            {hasIcon ? (
              <Icon
                color={iconColor}
                customIcon={option.customIcon}
                name={option.icon}
                size={16}
                type={option.customIcon ? "custom" : "ionicons"}
              />
            ) : null}
            <Typography.Text
              {...labelTextProps}
              numberOfLines={
                labelTextProps?.numberOfLines ?? (accessibleSizing ? undefined : 1)
              }
              semibold={labelTextProps?.semibold ?? selected}
              style={[
                {
                  color: iconColor,
                  fontSize: accessibleSizing ? 14 : 12,
                  textAlign: "center",
                  flexShrink: 1,
                },
                labelTextProps?.style,
              ]}
              variant={labelTextProps?.variant ?? "caption"}
            >
              {option.label}
            </Typography.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default SegmentedControl;
export { SegmentedControl };
