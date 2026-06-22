import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { Switch as RNSwitch, View } from "react-native";

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  testID?: string;
}

function Switch({
  value,
  onValueChange,
  label,
  disabled = false,
  className,
  testID,
}: SwitchProps) {
  return (
    <View className={cn("flex-row items-center justify-between gap-3", className)}>
      {label ? (
        <Typography.Text
          className={cn("flex-1 text-text-primary", disabled && "text-text-disabled")}
        >
          {label}
        </Typography.Text>
      ) : null}
      <RNSwitch
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        ios_backgroundColor={theme.bg.muted}
        onValueChange={onValueChange}
        testID={testID}
        thumbColor={theme.bg.card}
        trackColor={{ false: theme.bg.muted, true: theme.accent }}
        value={value}
      />
    </View>
  );
}

export default Switch;
