import RNSlider from "@react-native-community/slider";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
  testID?: string;
}

/**
 * **Tokenized** slider (track in `primary`) on `@react-native-community/slider` — clean,
 * on-brand, consistent across iOS/Android. (The `@expo/ui` Slider was evaluated but its
 * Material style with ticks ignores the tokens → not a case where native wins.)
 * Subpath `Form/Slider`; **optional** peer dep.
 */
function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue,
  disabled = false,
  className,
  testID,
}: SliderProps) {
  return (
    <View className={cn("gap-1", className)} testID={testID}>
      {label || formatValue ? (
        <View className="flex-row items-center justify-between">
          {label ? (
            <Typography.Text className="font-medium text-text-primary" variant="bodySmall">
              {label}
            </Typography.Text>
          ) : null}
          {formatValue ? (
            <Typography.Text className="text-text-secondary" variant="bodySmall">
              {formatValue(value)}
            </Typography.Text>
          ) : null}
        </View>
      ) : null}
      <RNSlider
        disabled={disabled}
        maximumTrackTintColor={theme.bg.muted}
        maximumValue={max}
        minimumTrackTintColor={theme.primary}
        minimumValue={min}
        onValueChange={onChange}
        step={step}
        thumbTintColor={theme.primary}
        value={value}
      />
    </View>
  );
}

export default Slider;
