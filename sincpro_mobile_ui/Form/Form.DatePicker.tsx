import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useState } from "react";
import { Platform, View } from "react-native";

export interface DatePickerProps {
  value: Date | null;
  onChange: (value: Date) => void;
  mode?: "date" | "time" | "datetime";
  label?: string;
  placeholder?: string;
  format?: (value: Date) => string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  className?: string;
  testID?: string;
}

function defaultFormat(value: Date, mode: DatePickerProps["mode"]): string {
  if (mode === "time")
    return value.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  if (mode === "datetime") return value.toLocaleString("es-BO");
  return value.toLocaleDateString("es-BO");
}

const iconByMode = {
  date: "calendar-outline",
  time: "time-outline",
  datetime: "calendar-outline",
} as const;

/**
 * **Hybrid** date/time field: tokenized trigger (NativeWind) + **native picker**
 * (`@react-native-community/datetimepicker`) — a case where native wins (expected UX).
 * Subpath `Form/DatePicker`; **optional** peer dep.
 */
function DatePicker({
  value,
  onChange,
  mode = "date",
  label,
  placeholder = "Seleccionar…",
  format,
  minimumDate,
  maximumDate,
  disabled = false,
  className,
  testID,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const fmt = format ?? ((d: Date) => defaultFormat(d, mode));

  const handleValueChange = (_event: unknown, date: Date) => {
    if (Platform.OS === "android") setOpen(false);
    if (date) onChange(date);
  };

  return (
    <View className={cn("gap-1", className)} testID={testID}>
      {label ? (
        <Typography.Text className="font-medium text-text-primary" variant="bodySmall">
          {label}
        </Typography.Text>
      ) : null}

      <Pressable
        accessibilityHint="Abre el selector de fecha"
        accessibilityLabel={label ?? placeholder}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className="flex-row items-center justify-between rounded-lg border border-input bg-bg-card px-3 min-h-[44px]"
        disabled={disabled}
        onPress={() => setOpen(true)}
      >
        <Typography.Text
          className={cn("flex-1 text-sm", value ? "text-text-primary" : "text-text-tertiary")}
        >
          {value ? fmt(value) : placeholder}
        </Typography.Text>
        <Icon color={theme.icon.secondary} name={iconByMode[mode]} size={18} />
      </Pressable>

      {open ? (
        <DateTimePicker
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode={mode === "datetime" ? "date" : mode}
          onDismiss={() => setOpen(false)}
          onValueChange={handleValueChange}
          value={value ?? new Date()}
        />
      ) : null}
    </View>
  );
}

export default DatePicker;
