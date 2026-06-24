import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ComponentType } from "react";
import { TouchableOpacity, View } from "react-native";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
  /** Ionicon name rendered above (or before) the label. */
  icon?: string;
  /** Custom icon component — takes precedence over `icon`. */
  customIcon?: ComponentType<{ size?: number; color?: string }>;
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
  className?: string;
  testID?: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  iconLayout = "top",
  className,
  testID,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const hasIcons = options.some((o) => o.icon || o.customIcon);

  return (
    <View
      accessibilityRole="tablist"
      className={cn("flex-row bg-bg-muted rounded-lg p-1 gap-1", className)}
      testID={testID}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const iconColor = selected ? theme.text.primary : theme.text.secondary;
        const hasIcon = !!(option.icon || option.customIcon);
        const inline = hasIcons && iconLayout === "left";

        return (
          <TouchableOpacity
            accessibilityLabel={option.label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            activeOpacity={0.7}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              flexDirection: inline ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: hasIcon ? 4 : 0,
              paddingVertical: hasIcons && !inline ? 8 : 8,
              paddingHorizontal: 4,
              borderRadius: 8,
              ...(selected
                ? { backgroundColor: theme.bg.card, ...theme.shadow.sm }
                : undefined),
            }}
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
              numberOfLines={1}
              semibold={selected}
              style={{ color: iconColor, fontSize: 12 }}
              variant="caption"
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
