import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { TouchableOpacity, View } from "react-native";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  testID?: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  testID,
}: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn("flex-row bg-bg-muted rounded-lg p-1 gap-1", className)}
      testID={testID}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            accessibilityLabel={option.label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-2 rounded-md"
            key={option.value}
            onPress={() => onChange(option.value)}
            style={
              selected ? { backgroundColor: theme.bg.card, ...theme.shadow.sm } : undefined
            }
          >
            <Typography.Text
              numberOfLines={1}
              semibold={selected}
              style={{ color: selected ? theme.text.primary : theme.text.secondary }}
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
