import DateTimePicker from "@expo/ui/community/datetime-picker";
import { Actions } from "@sincpro/mobile-ui/Actions";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { relativeLuminance, useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useRef, useState } from "react";
import { Platform, View } from "react-native";

export type DatePickerProps = {
  value: Date | null;
  onChange: (value: Date) => void | Promise<void>;
  mode?: "date" | "time" | "datetime";
  label?: string;
  placeholder?: string;
  format?: (value: Date) => string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  testID?: string;
};

function defaultFormat(value: Date, mode: DatePickerProps["mode"]): string {
  if (mode === "time")
    return value.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  if (mode === "datetime") return value.toLocaleString("es-BO");
  return value.toLocaleDateString("es-BO");
}

function comparableDate(value: Date, mode: DatePickerProps["mode"]): number {
  return mode === "date"
    ? new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
    : value.getTime();
}

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
  readOnly = false,
  className,
  testID,
}: DatePickerProps) {
  const theme = useTheme();
  const appearance = relativeLuminance(theme.bg.card) < 0.179 ? "dark" : "light";
  const saving = useRef(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => value ?? new Date());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const blocked = disabled || readOnly || pending;
  const fmt = format ?? ((date: Date) => defaultFormat(date, mode));
  const close = () => {
    if (!saving.current) setOpen(false);
  };
  const save = async () => {
    if (blocked || saving.current) return;
    if (
      (minimumDate && comparableDate(draft, mode) < comparableDate(minimumDate, mode)) ||
      (maximumDate && comparableDate(draft, mode) > comparableDate(maximumDate, mode))
    ) {
      setError("Selecciona una fecha y hora dentro del rango permitido.");
      return;
    }
    saving.current = true;
    setPending(true);
    setError(undefined);
    try {
      await onChange(draft);
      setOpen(false);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message.trim()
          ? cause.message
          : "No se pudo aplicar la fecha. Vuelve a intentarlo.",
      );
    } finally {
      saving.current = false;
      setPending(false);
    }
  };
  const update = (date: Date) => {
    if (blocked || saving.current) return;
    setDraft(date);
    setError(undefined);
  };

  return (
    <View className={cn("gap-1", className)} testID={testID}>
      {label ? (
        <Typography.Text className="text-text-primary" semibold variant="bodySmall">
          {label}
        </Typography.Text>
      ) : null}
      <Pressable
        accessibilityHint="Abre el selector de fecha y hora"
        accessibilityLabel={label ?? placeholder}
        accessibilityRole="button"
        accessibilityState={{ disabled: blocked, expanded: open }}
        accessibilityValue={{ text: value ? fmt(value) : placeholder }}
        className="flex-row items-center gap-3 rounded-lg border border-input bg-bg-card px-3"
        disabled={blocked}
        onPress={() => {
          const initial = value ?? new Date();
          setDraft(
            minimumDate && comparableDate(initial, mode) < comparableDate(minimumDate, mode)
              ? minimumDate
              : maximumDate &&
                  comparableDate(initial, mode) > comparableDate(maximumDate, mode)
                ? maximumDate
                : initial,
          );
          setError(undefined);
          setOpen(true);
        }}
        style={{ minHeight: 48, minWidth: 48 }}
      >
        <Typography.Text
          className={cn("flex-1", value ? "text-text-primary" : "text-text-tertiary")}
          style={{ paddingVertical: 12 }}
        >
          {value ? fmt(value) : placeholder}
        </Typography.Text>
        <Icon
          color={theme.icon.secondary}
          name={mode === "time" ? "time" : "calendar"}
          size={18}
        />
      </Pressable>
      <Sheet
        dismissible={!pending}
        footer={
          <Actions.Button
            disabled={blocked}
            loading={pending}
            onPress={() => void save()}
            title="Aplicar"
          />
        }
        onClose={close}
        title={label ?? (mode === "time" ? "Seleccionar hora" : "Seleccionar fecha")}
        visible={open}
      >
        {open ? (
          <View
            accessibilityElementsHidden={blocked}
            importantForAccessibility={blocked ? "no-hide-descendants" : "auto"}
            pointerEvents={blocked ? "none" : "auto"}
          >
            <DateTimePicker
              accentColor={theme.primary}
              disabled={blocked}
              display={mode === "time" || mode === "datetime" ? "spinner" : "inline"}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              mode={Platform.OS === "android" && mode === "datetime" ? "date" : mode}
              onValueChange={(_event, date) => update(date)}
              presentation="inline"
              testID={testID ? `${testID}-date-picker` : undefined}
              themeVariant={appearance}
              value={draft}
            />
            {Platform.OS === "android" && mode === "datetime" ? (
              <DateTimePicker
                accentColor={theme.primary}
                mode="time"
                onValueChange={(_event, date) => {
                  const next = new Date(draft);
                  next.setHours(
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds(),
                  );
                  update(next);
                }}
                presentation="inline"
                testID={testID ? `${testID}-time-picker` : undefined}
                themeVariant={appearance}
                value={draft}
              />
            ) : null}
          </View>
        ) : null}
        {error ? (
          <Typography.Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            className="pt-3 text-danger"
            selectable
          >
            {error}
          </Typography.Text>
        ) : null}
      </Sheet>
    </View>
  );
}

export default DatePicker;
