import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { ChoiceRow } from "@sincpro/mobile-ui/Form/choice-row";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { attempt, errorMessage } from "@sincpro/mobile-ui/utils/async";
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export type SelectOption<T extends string | number> = {
  label: string;
  value: T;
};

export type SelectProps<T extends string | number> = {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void | Promise<void>;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  title?: string;
  /** Kept for compatibility: a row applies its option on tap, on Android and iOS alike. */
  confirmLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
  testID?: string;
};

function SelectOptions<T extends string | number>({
  options,
  value,
  blocked,
  onSelect,
}: {
  options: readonly SelectOption<T>[];
  value: T | null;
  blocked: boolean;
  onSelect: (value: T) => void;
}) {
  if (!options.length) {
    return <Typography.Text>No hay opciones disponibles.</Typography.Text>;
  }
  return (
    <View className="gap-2">
      {options.map((option, index) => (
        <ChoiceRow
          disabled={blocked}
          key={`${index}:${String(option.value)}`}
          label={option.label}
          onPress={() => onSelect(option.value)}
          selected={option.value === value}
        />
      ))}
    </View>
  );
}

function Select<T extends string | number>({
  options,
  value,
  onChange,
  onBlur,
  label,
  placeholder = "Seleccionar…",
  title,
  disabled = false,
  readOnly = false,
  loading = false,
  error,
  className,
  testID,
}: SelectProps<T>) {
  const theme = useTheme();
  const saving = useRef(false);
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<T | null>(null);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<string>();
  const selected = options.find((option) => option.value === value);
  const draftIndex = options.findIndex((option) => option.value === draftValue);
  const blocked = disabled || readOnly || loading || pending;
  const close = () => {
    if (saving.current) return;
    setOpen(false);
    onBlur?.();
  };
  const commit = async (next: T | null) => {
    if (next === null || blocked || saving.current) return;
    saving.current = true;
    setPending(true);
    setFailure(undefined);
    const result = await attempt(async () => {
      await onChange(next);
      setOpen(false);
      onBlur?.();
    });
    saving.current = false;
    setPending(false);
    if (!result.ok) {
      setFailure(
        errorMessage(result.error, "No se pudo aplicar la selección. Vuelve a intentarlo."),
      );
    }
  };

  return (
    <View className={cn("gap-1", className)} testID={testID}>
      {label ? (
        <Typography.Text className="text-text-primary" semibold variant="bodySmall">
          {label}
        </Typography.Text>
      ) : null}
      <Pressable
        accessibilityHint="Abre el selector de opciones"
        accessibilityLabel={
          label
            ? `${label}: ${selected?.label ?? placeholder}`
            : (selected?.label ?? placeholder)
        }
        accessibilityRole="button"
        accessibilityState={{ disabled: blocked, expanded: open, busy: loading || pending }}
        className="flex-row items-center gap-3 rounded-lg border border-input bg-bg-card px-3"
        disabled={blocked}
        onPress={() => {
          setDraftValue(selected?.value ?? null);
          setFailure(undefined);
          setOpen(true);
        }}
        style={{ minHeight: 48, minWidth: 48 }}
      >
        <Typography.Text
          className={cn("flex-1", selected ? "text-text-primary" : "text-text-tertiary")}
          style={{ paddingVertical: 12 }}
        >
          {selected?.label ?? placeholder}
        </Typography.Text>
        {loading || pending ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <Icon color={theme.icon.secondary} name="expand" size={18} />
        )}
      </Pressable>
      {error ? (
        <Typography.Text accessibilityLiveRegion="polite" className="text-danger">
          {error}
        </Typography.Text>
      ) : null}
      {/* One selection on both platforms: a list that shows each option whole (a wheel
          truncates long labels) and applies it on tap. */}
      <Sheet
        dismissible={!pending}
        onClose={close}
        title={title ?? label ?? "Seleccionar"}
        visible={open}
      >
        {open ? (
          <SelectOptions
            blocked={blocked}
            onSelect={(next) => {
              setDraftValue(next);
              void commit(next);
            }}
            options={options}
            value={draftValue ?? value}
          />
        ) : null}
        {draftValue !== null && draftIndex < 0 ? (
          <Typography.Text accessibilityRole="alert" className="text-danger">
            La opción ya no está disponible. Selecciona otra.
          </Typography.Text>
        ) : null}
        {failure ? (
          <Typography.Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            className="pt-3 text-danger"
            selectable
          >
            {failure}
          </Typography.Text>
        ) : null}
      </Sheet>
    </View>
  );
}

export default Select;
