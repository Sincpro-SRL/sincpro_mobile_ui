import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type StyleProp, View, type ViewStyle } from "react-native";

export type SegmentedOption<T extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  readOnly?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  testID?: string;
};

/** Drawn with tokens, not the platform control, so it looks the same on Android and iOS. */
function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  accessibilityLabel,
  style,
  className,
  testID,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View className={className} style={style} testID={testID}>
      {accessibilityLabel ? (
        <Typography.Text className="pb-1 text-text-primary" variant="bodySmall">
          {accessibilityLabel}
        </Typography.Text>
      ) : null}
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="tablist"
        style={{
          flexDirection: "row",
          gap: 4,
          padding: 4,
          borderRadius: 14,
          backgroundColor: theme.bg.muted,
        }}
      >
        {options.map((option) => {
          const selected = option.value === value;
          const blocked = disabled || readOnly || !!option.disabled;
          return (
            <Pressable
              accessibilityLabel={option.label}
              accessibilityRole="tab"
              accessibilityState={{ selected, disabled: blocked }}
              disabled={blocked}
              hitSlop={0}
              key={option.value}
              onPress={() => {
                if (!selected) onChange(option.value);
              }}
              style={{
                flex: 1,
                minHeight: 48,
                minWidth: 48,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                ...(selected ? { backgroundColor: theme.bg.card, ...theme.shadow.sm } : null),
              }}
              testID={testID ? `${testID}-${option.value}` : undefined}
            >
              <Typography.Text
                align="center"
                semibold={selected}
                style={{ color: selected ? theme.text.primary : theme.text.secondary }}
                variant="bodySmall"
              >
                {option.label}
              </Typography.Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default SegmentedControl;
export { SegmentedControl };
