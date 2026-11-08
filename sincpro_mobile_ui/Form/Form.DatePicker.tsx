import DateTimePicker from "@expo/ui/community/datetime-picker";
import { Actions } from "@sincpro/mobile-ui/Actions";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { relativeLuminance, useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { attempt, errorMessage } from "@sincpro/mobile-ui/utils/async";
import { dateTimeFormat } from "@sincpro/mobile-ui/utils/intl";
import { useLayoutEffect, useRef, useState } from "react";
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

// Same output as toLocale{Time,,Date}String("es-BO"), with shared formatters.
const DEFAULT_FORMATS = {
  time: { hour: "2-digit", minute: "2-digit" },
  datetime: {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  },
  date: { year: "numeric", month: "numeric", day: "numeric" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

function defaultFormat(value: Date, mode: DatePickerProps["mode"]): string {
  const shape = mode === "time" || mode === "datetime" ? mode : "date";
  return dateTimeFormat("es-BO", DEFAULT_FORMATS[shape]).format(value);
}

function comparableDate(value: Date, mode: DatePickerProps["mode"]): number {
  return mode === "date"
    ? new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
    : value.getTime();
}

function withCalendarDay(base: Date, day: Date): Date {
  const next = new Date(base);
  next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
  return next;
}

function withClockTime(base: Date, time: Date): Date {
  const next = new Date(base);
  next.setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  );
  return next;
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
  const dialogSession = useRef(0);
  const visibleOwner = useRef(0);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"date" | "time">("date");
  const [draft, setDraft] = useState(() => value ?? new Date());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const blocked = disabled || readOnly || pending;
  const android = Platform.OS === "android";
  useLayoutEffect(() => {
    if (!android || !open) return;
    visibleOwner.current = dialogSession.current;
  }, [android, open, phase]);
  const fmt = format ?? ((date: Date) => defaultFormat(date, mode));
  const close = () => {
    if (!saving.current) setOpen(false);
  };
  const outOfRange = (next: Date) =>
    (minimumDate !== undefined &&
      comparableDate(next, mode) < comparableDate(minimumDate, mode)) ||
    (maximumDate !== undefined &&
      comparableDate(next, mode) > comparableDate(maximumDate, mode));
  const apply = async (next: Date) => {
    if (android) setOpen(false);
    if (blocked || saving.current) return;
    if (outOfRange(next)) {
      setError("Selecciona una fecha y hora dentro del rango permitido.");
      setDraft(next);
      return;
    }
    saving.current = true;
    setPending(true);
    setError(undefined);
    const result = await attempt(async () => {
      await onChange(next);
      setOpen(false);
    });
    saving.current = false;
    setPending(false);
    if (!result.ok) {
      setDraft(next);
      setError(
        errorMessage(result.error, "No se pudo aplicar la fecha. Vuelve a intentarlo."),
      );
    }
  };
  const update = (date: Date | undefined) => {
    if (!date || blocked || saving.current) return;
    setDraft(date);
    setError(undefined);
  };
  const confirmAndroid = (date: Date | undefined) => {
    if (!date || blocked || saving.current) return;
    if (mode === "datetime" && phase === "date") {
      dialogSession.current += 1;
      setDraft((current) => withCalendarDay(current, date));
      setPhase("time");
      setError(undefined);
      return;
    }
    const next = mode === "datetime" ? withClockTime(draft, date) : date;
    void apply(next);
  };
  const dismissAndroid = () => {
    if (dialogSession.current !== visibleOwner.current) return;
    setOpen(false);
  };
  const openPicker = () => {
    const initial = error ? draft : (value ?? new Date());
    const clamped =
      minimumDate && comparableDate(initial, mode) < comparableDate(minimumDate, mode)
        ? minimumDate
        : maximumDate && comparableDate(initial, mode) > comparableDate(maximumDate, mode)
          ? maximumDate
          : initial;
    dialogSession.current += 1;
    visibleOwner.current = dialogSession.current;
    setDraft(clamped);
    setPhase("date");
    setError(undefined);
    setOpen(true);
  };
  const androidMode = mode === "datetime" ? phase : mode;

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
        onPress={openPicker}
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
      {android && error ? (
        <Typography.Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          className="text-danger"
          selectable
        >
          {error}
        </Typography.Text>
      ) : null}
      {android && open ? (
        <DateTimePicker
          accentColor={theme.primary}
          display="default"
          key={androidMode}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode={androidMode}
          negativeButton={{ label: "Cancelar" }}
          onDismiss={dismissAndroid}
          onValueChange={(_event, date) => confirmAndroid(date)}
          positiveButton={{
            label: mode === "datetime" && phase === "date" ? "Continuar" : "Aplicar",
          }}
          presentation="dialog"
          testID={
            testID
              ? `${testID}-${androidMode === "time" ? "time" : "date"}-picker`
              : undefined
          }
          themeVariant={appearance}
          value={draft}
        />
      ) : null}
      {android ? null : (
        <Sheet
          dismissible={!pending}
          footer={
            <Actions.Button
              disabled={blocked}
              loading={pending}
              onPress={() => void apply(draft)}
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
                mode={mode}
                onValueChange={(_event, date) => update(date)}
                presentation="inline"
                testID={testID ? `${testID}-date-picker` : undefined}
                themeVariant={appearance}
                value={draft}
              />
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
      )}
    </View>
  );
}

export default DatePicker;
