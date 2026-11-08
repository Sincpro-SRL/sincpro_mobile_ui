import NativeSegmentedControl from "@expo/ui/community/segmented-control";
import { relativeLuminance, useTheme } from "@sincpro/mobile-ui/theme";
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
  const groups: { disabled: boolean; options: SegmentedOption<T>[] }[] = [];
  for (const option of options) {
    const blocked = disabled || readOnly || !!option.disabled;
    const group = groups.at(-1);
    if (group?.disabled === blocked) group.options.push(option);
    else groups.push({ disabled: blocked, options: [option] });
  }

  return (
    <View className={className} style={style} testID={testID}>
      {accessibilityLabel ? (
        <Typography.Text className="pb-1 text-text-primary" variant="bodySmall">
          {accessibilityLabel}
        </Typography.Text>
      ) : null}
      <View style={{ flexDirection: "row", gap: 4, minHeight: 48 }}>
        {groups.map((group, groupIndex) => (
          <View key={group.options[0].value} style={{ flex: group.options.length }}>
            <NativeSegmentedControl
              accessibilityLabel={accessibilityLabel}
              appearance={relativeLuminance(theme.bg.card) < 0.179 ? "dark" : "light"}
              enabled={!group.disabled}
              onChange={({ nativeEvent }) => {
                const option = group.options[nativeEvent.selectedSegmentIndex];
                if (option && !group.disabled) onChange(option.value);
              }}
              selectedIndex={group.options.findIndex((option) => option.value === value)}
              style={{ minHeight: 48 }}
              testID={testID ? `${testID}-segments-${groupIndex}` : undefined}
              tintColor={theme.primary}
              values={group.options.map((option) => option.label)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

export default SegmentedControl;
export { SegmentedControl };
