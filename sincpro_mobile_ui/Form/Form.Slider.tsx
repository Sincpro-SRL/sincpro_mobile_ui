import NativeSlider from "@expo/ui/community/slider";
import { useTheme } from "@sincpro/mobile-ui/theme";
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
  readOnly?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  className?: string;
  testID?: string;
}

function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue,
  disabled = false,
  readOnly = false,
  accessibilityLabel,
  accessibilityHint,
  className,
  testID,
}: SliderProps) {
  const theme = useTheme();
  const blocked = disabled || readOnly;
  return (
    <View className={cn("gap-1", className)} testID={testID}>
      {label || formatValue ? (
        <View className="flex-row items-center justify-between">
          {label ? (
            <Typography.Text className="text-text-primary" semibold variant="bodySmall">
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
      <NativeSlider
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel ?? label ?? "Valor"}
        disabled={blocked}
        maximumTrackTintColor={theme.container.primary}
        maximumValue={max}
        minimumTrackTintColor={theme.primary}
        minimumValue={min}
        onValueChange={(next) => {
          if (blocked) return;
          const snapped = step > 0 ? min + Math.round((next - min) / step) * step : next;
          onChange(Math.min(max, Math.max(min, snapped)));
        }}
        step={step}
        style={{ minHeight: 48 }}
        testID={testID ? `${testID}-slider` : undefined}
        thumbTintColor={theme.primary}
        value={value}
      />
    </View>
  );
}

export default Slider;
